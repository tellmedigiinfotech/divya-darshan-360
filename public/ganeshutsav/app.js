// ponytail: routing hits the public OSRM demo server (router.project-osrm.org).
// Free, no key, rate-limited, and explicitly "not for heavy production use".
// Fine for building. Before festival-week traffic, point ROUTING_BASE at a
// self-hosted OSRM or an OpenRouteService key. Nothing else has to change.
const ROUTING_BASE = "https://router.project-osrm.org/route/v1/foot";

const PUNE = [18.5165, 73.8545];
const LANG_KEY = "pgy.lang";

let strings = {};
let data = {};
let services = {};
let lang = "en";

let map, mandalLayer, routeLayer, startMarker;
let startLatLng = null;
let pickingStart = false;
let selection = null; // { title, sub, stops }
let activeTab = "routes";

const $ = (id) => document.getElementById(id);
const t = (key) => (strings[lang] && strings[lang][key]) || key;
const tr = (field) => (field && (field[lang] || field.en)) || "";
const byId = (id) => data.mandals.find((m) => m.id === id);
const xy = (m) => [m.lat, m.lng];

/* ---------- ad card ----------
 * Shows the ad in whichever language the user picked, floated over the map when
 * they select a route or mandal.
 *
 * Deliberately NOT a blocking interstitial before the directions. This is a
 * wayfinding tool people open mid-walk in a crowd on mobile data, and putting a
 * 12 second gate in front of the route is the fastest way to spike bounces,
 * which would poison the very numbers the Kumbh pitch depends on. So: muted
 * picture-in-picture beside the route, tap for sound, dismissable.
 *
 * Once per session by default. Flip AD_EVERY_SELECTION if you want it on every
 * tap instead, but that also multiplies data use per visitor.
 *
 * Not skippable: no close button, no pause, no native controls. It clears
 * itself when the clip ends, because the alternative is a card permanently
 * covering a third of the map on a wayfinding tool. Set AD_STAYS_AFTER_END if
 * you would rather it sit there for the rest of the visit.
 */
const AD_EVERY_SELECTION = false;
const AD_STAYS_AFTER_END = false;
const AD_SEEN_KEY = "pgy.ad_seen";

function maybeShowAd() {
  if (!AD_EVERY_SELECTION) {
    try { if (sessionStorage.getItem(AD_SEEN_KEY)) return; } catch { /* private mode */ }
  }

  const el = $("ad");
  const v = $("ad-video");
  const src = `assets/ads/ganesh-ad-${lang}.mp4`;
  if (v.getAttribute("src") !== src) {
    v.setAttribute("src", src);
    v.setAttribute("poster", `assets/ads/ganesh-ad-${lang}.jpg`);
  }
  el.hidden = false;
  try { sessionStorage.setItem(AD_SEEN_KEY, "1"); } catch { /* not fatal */ }
  const trigger = selection ? selection.kind : "unknown";

  // Sound on by default. This is reached synchronously from the user's tap on a
  // route, so it sits inside a user-activation context and browsers normally
  // allow it. When they do not (iOS low power, in-app webviews, autoplay
  // settings) play() rejects, and an unguarded call would leave a dead black
  // box where the ad should be. So fall back to muted rather than to nothing,
  // and record which of the two actually happened.
  v.muted = false;
  $("ad-sound").classList.add("on");
  v.play().then(
    () => track("ad_shown", { language: lang, trigger, sound: "on" }),
    () => {
      v.muted = true;
      $("ad-sound").classList.remove("on");
      v.play().catch(() => { /* leave the poster showing */ });
      track("ad_shown", { language: lang, trigger, sound: "blocked" });
    }
  );
}

function adFinished() {
  track("ad_completed", { language: lang, muted: $("ad-video").muted });
  if (!AD_STAYS_AFTER_END) $("ad").hidden = true;
}

/* ---------- analytics ----------
 * Event names are deliberately chosen so each one answers a question an
 * authority would ask, not to count pageviews:
 *   maps_handoff   someone actually set off walking. This is the conversion.
 *   mandal_selected / route_selected   aggregate demand, by destination and hour.
 *   language_set   whether the thing reached non-English speakers.
 *   sos_opened / helpline_called   whether it served safety, not just tourism.
 *   route_failed   reliability, so "99% of route requests succeeded" is provable.
 * Analytics must never break the page, hence the blanket try/catch.
 */
const ANALYTICS_APP = "ganeshutsav";

function track(name, params) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, { app: ANALYTICS_APP, ui_lang: lang, ...params });
    }
    // Vercel custom events, present only on paid plans. Harmless if absent.
    if (typeof window.va === "function") window.va("event", { name, ...params });
  } catch { /* never let instrumentation take the page down */ }
}

// localStorage throws in some privacy modes, and a throw here would kill the page.
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* not fatal */ } },
};

boot();

async function boot() {
  const [s, d, sv] = await Promise.all([
    fetch("data/strings.json").then((r) => r.json()),
    fetch("data/mandals.json").then((r) => r.json()),
    fetch("data/services.json").then((r) => r.json()),
  ]);
  strings = s;
  data = d;
  services = sv;

  initMap();
  wire();
  syncSheetHeight();

  const saved = store.get(LANG_KEY);
  const known = saved && strings[saved];
  setLang(known ? saved : detectLang(), known ? "restored" : "detected");
  if (!saved) $("lang-gate").hidden = false;

  // Open framed on the mandals themselves, not on a generic view of Pune.
  fitTo(L.latLngBounds(data.mandals.map(xy)));
}

function detectLang() {
  const l = (navigator.language || "en").toLowerCase();
  if (l.startsWith("mr")) return "mr";
  if (l.startsWith("hi")) return "hi";
  return "en";
}

/* ---------- map ---------- */

function initMap() {
  map = L.map("map", { zoomControl: false, attributionControl: true }).setView(PUNE, 15);
  // Plain OSM tiles, desaturated in CSS (.leaflet-tile-pane) rather than swapped
  // for a styled basemap, because every muted basemap worth using wants an API
  // key. The route and pins have to be the loudest thing on a sunlit phone.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 19,
  }).addTo(map);
  if (window.innerWidth >= 900) L.control.zoom({ position: "bottomright" }).addTo(map);

  mandalLayer = L.layerGroup().addTo(map);
  routeLayer = L.layerGroup().addTo(map);

  map.on("click", (e) => {
    if (pickingStart) {
      setStart([e.latlng.lat, e.latlng.lng]);
      toast(t("startSet"));
      return;
    }
    // Tap the map to get the map back: drop the sheet to its peek height so
    // only the tab row is left over it. Marker clicks stop propagation so
    // selecting a mandal does not immediately collapse the sheet again.
    applySnap(0);
  });
}

// The map shows whatever the open tab is about. Showing mandals, parking and
// hospitals all at once turns the old city into confetti.
function renderPins() {
  mandalLayer.clearLayers();
  const parking = activeTab === "parking";
  const help = activeTab === "emergency";
  const items = parking ? services.parking : help ? services.places : data.mandals;
  const cls = parking ? " parking" : help ? " help" : "";

  items.forEach((item) => {
    const marker = L.marker([item.lat, item.lng], {
      icon: L.divIcon({ className: "", html: `<div class="pin${cls}"></div>`, iconSize: [19, 19], iconAnchor: [9, 9] }),
      keyboard: false,
    }).addTo(mandalLayer);

    if (!parking && !help) {
      marker.on("click", (ev) => { L.DomEvent.stopPropagation(ev); selectMandal(item, "map"); });
    } else {
      marker.on("click", (ev) => L.DomEvent.stopPropagation(ev));
      marker.bindPopup(
        `<strong>${tr(item.name)}</strong><br>${tr(item.locality)}<br>` +
        `<a href="${gmapsTo(item)}" target="_blank" rel="noopener">${t("directions")}</a>`
      );
    }
  });
}

function focusPlace(item) {
  map.setView([item.lat, item.lng], 17);
  applySnap(0);
}

function gmapsTo(item) {
  const u = new URL("https://www.google.com/maps/dir/");
  u.searchParams.set("api", "1");
  u.searchParams.set("destination", `${item.lat},${item.lng}`);
  return u.toString();
}

function fitTo(bounds) {
  const wide = window.innerWidth >= 900;
  const sheetH = $("sheet").getBoundingClientRect().height;
  map.fitBounds(bounds, {
    paddingTopLeft: wide ? [460, 40] : [36, 96],
    paddingBottomRight: wide ? [40, 40] : [36, sheetH + 32],
  });
}

/* ---------- selection + routing ---------- */

function selectCircuit(c) {
  selection = { kind: "circuit", ref: c, stops: c.stopIds.map(byId) };
  track("route_selected", { route_id: c.id, stop_count: c.stopIds.length });
  showDetail();
  drawRoute();
  maybeShowAd();
}

function selectMandal(m, source = "list") {
  selection = { kind: "mandal", ref: m, stops: [m] };
  track("mandal_selected", { mandal_id: m.id, locality: m.locality.en, source });
  showDetail();
  drawRoute();
  maybeShowAd();
}

// Titles are resolved on read, not stored, so a language switch needs no bookkeeping.
const selTitle = () => tr(selection.ref.name);
const selSub = () => tr(selection.kind === "circuit" ? selection.ref.subtitle : selection.ref.blurb);

async function drawRoute() {
  routeLayer.clearLayers();
  const stops = selection.stops;
  const points = startLatLng ? [startLatLng, ...stops.map(xy)] : stops.map(xy);

  points.forEach((p, i) => {
    const isStart = !!startLatLng && i === 0;
    const label = isStart ? "★" : String(startLatLng ? i : i + 1);
    L.marker(p, {
      icon: L.divIcon({
        className: "",
        html: `<div class="pin-num${isStart ? " start" : ""}">${label}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }),
      keyboard: false,
    }).addTo(routeLayer);
  });

  if (points.length < 2) {
    map.setView(points[0], 17);
    setStats(null);
    return;
  }

  toast(t("loadingRoute"));
  const coords = points.map((p) => `${p[1]},${p[0]}`).join(";");
  try {
    const res = await fetch(`${ROUTING_BASE}/${coords}?overview=full&geometries=geojson`);
    const json = await res.json();
    if (!json.routes || !json.routes.length) throw new Error("no route");
    const route = json.routes[0];
    const line = L.geoJSON(route.geometry, {
      style: { color: "#c2540a", weight: 6, opacity: 0.9, lineJoin: "round" },
    }).addTo(routeLayer);
    fitTo(line.getBounds());
    setStats(route);
    hideToast();
    track("route_drawn", {
      kind: selection.kind,
      target_id: selection.ref.id,
      stop_count: stops.length,
      distance_km: +(route.distance / 1000).toFixed(2),
      walk_min: Math.round((route.distance / 1000 / WALK_KMPH) * 60),
      from_location: !!startLatLng,
    });
  } catch {
    // Route service failed. The pins are still useful, so show those and say so.
    fitTo(L.latLngBounds(points));
    setStats(null);
    toast(t("routeError"));
    track("route_failed", { kind: selection.kind, target_id: selection.ref.id, stop_count: stops.length });
  }
}

// ponytail: walking time is derived from distance, not taken from the router.
// The public OSRM demo server is built with the car profile and returns driving
// durations even on a /foot/ URL (2.4km came back as "6 min"). 4.5 km/h is an
// honest urban walking pace. A real foot-profile router can replace this.
const WALK_KMPH = 4.5;

function setStats(route) {
  const n = selection.stops.length;
  const unit = n === 1 ? t("stop") : t("stops");
  const parts = [];
  if (route) {
    const km = route.distance / 1000;
    parts.push(`${km.toFixed(1)} ${t("km")}`);
    parts.push(`${Math.round((km / WALK_KMPH) * 60)} ${t("min")} ${t("walk")}`);
  }
  parts.push(`${n} ${unit}`);
  $("detail-stats").textContent = parts.join(" · ");
  $("detail-note").hidden = !route;
}

// Google Maps handles turn-by-turn far better than we ever will, so hand off to
// it. Omitting `origin` makes Google start from the walker's live location.
function gmapsUrl() {
  const stops = selection.stops.map((m) => `${m.lat},${m.lng}`);
  const u = new URL("https://www.google.com/maps/dir/");
  u.searchParams.set("api", "1");
  if (startLatLng) u.searchParams.set("origin", `${startLatLng[0]},${startLatLng[1]}`);
  u.searchParams.set("destination", stops[stops.length - 1]);
  const via = stops.slice(0, -1);
  if (via.length) u.searchParams.set("waypoints", via.join("|"));
  u.searchParams.set("travelmode", "walking");
  return u.toString();
}

/* ---------- start point ---------- */

function setStart(latlng) {
  startLatLng = latlng;
  pickingStart = false;
  $("locate-btn").classList.remove("on");
  if (startMarker) startMarker.remove();
  startMarker = L.marker(latlng, {
    icon: L.divIcon({ className: "", html: '<div class="pin-num start">★</div>', iconSize: [32, 32], iconAnchor: [16, 16] }),
    keyboard: false,
  }).addTo(map);
  if (selection) { drawRoute(); refreshStartButton(); }
}

function locateMe() {
  if (!navigator.geolocation) { track("locate_used", { outcome: "unavailable" }); return askForTap(); }
  toast(t("locating"));
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      track("locate_used", { outcome: "granted" });
      setStart([pos.coords.latitude, pos.coords.longitude]);
      hideToast();
      if (!selection) map.setView([pos.coords.latitude, pos.coords.longitude], 16);
    },
    () => { track("locate_used", { outcome: "denied" }); askForTap(); },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function askForTap() {
  pickingStart = true;
  $("locate-btn").classList.add("on");
  toast(t("locationOff"));
}

function refreshStartButton() {
  const btn = $("start-btn");
  if (startLatLng) {
    btn.textContent = t("usingYourLocation");
    btn.classList.add("done");
    btn.disabled = true;
  } else {
    btn.textContent = t("startFromLocation");
    btn.classList.remove("done");
    btn.disabled = false;
  }
}

/* ---------- views ---------- */

function showDetail() {
  $("view-list").hidden = true;
  $("view-detail").hidden = false;
  applySnap(1); // leave the drawn route visible above the sheet
  $("detail-title").textContent = selTitle();
  $("detail-sub").textContent = selSub();
  $("gmaps-btn").href = gmapsUrl();
  setStats(null);
  refreshStartButton();

  const ol = $("detail-stops");
  ol.innerHTML = "";
  selection.stops.forEach((m, i) => {
    const li = document.createElement("li");
    const row = document.createElement("button");
    row.className = "stop-row";
    row.innerHTML =
      `<span class="stop-num">${i + 1}</span>` +
      `<span><span class="stop-name">${tr(m.name)}</span>` +
      `<span class="stop-locality">${tr(m.locality)}</span></span>`;
    row.addEventListener("click", () => map.setView(xy(m), 17));
    li.appendChild(row);
    ol.appendChild(li);
  });
}

function showList() {
  $("view-detail").hidden = true;
  $("view-list").hidden = false;
}

function setTab(name) {
  activeTab = name;
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
}

function searchBlob(m) {
  return [m.name, m.locality]
    .flatMap((f) => Object.values(f))
    .join(" ")
    .toLowerCase();
}

function renderList() {
  const q = $("search").value.trim().toLowerCase();
  const list = $("list");
  list.innerHTML = "";
  renderPins();

  if (!q && activeTab === "emergency") return renderEmergency(list);
  if (!q && activeTab === "parking") return renderParking(list);

  if (q) setTab("all");
  const showRoutes = !q && activeTab === "routes";

  if (showRoutes) {
    data.circuits.forEach((c) => {
      list.appendChild(
        card(tr(c.name), tr(c.subtitle), `${c.stopIds.length} ${t("stops")}`, () => selectCircuit(c))
      );
    });
    return;
  }

  const hits = q ? data.mandals.filter((m) => searchBlob(m).includes(q)) : data.mandals;
  if (!hits.length) {
    list.innerHTML = `<p class="empty">${t("noResults")}</p>`;
    return;
  }
  hits.forEach((m) =>
    list.appendChild(card(tr(m.name), tr(m.locality), "", () => selectMandal(m, q ? "search" : "list")))
  );
}

function renderEmergency(list) {
  // Emergency is reached from the SOS button on the map, not from a tab, so it
  // needs its own way back.
  const back = document.createElement("button");
  back.className = "back-btn";
  back.innerHTML =
    '<svg class="ico" viewBox="0 0 24 24"><path d="M15 19 8 12l7-7"/></svg>' + `<span>${t("back")}</span>`;
  back.addEventListener("click", () => { setTab("routes"); renderList(); });
  list.appendChild(back);

  list.appendChild(head(t("helplines")));
  services.helplines.forEach((h) => {
    const a = document.createElement("a");
    a.className = "call-row";
    a.href = `tel:${h.number}`;
    a.addEventListener("click", () => track("helpline_called", { helpline: h.number }));
    a.innerHTML =
      `<span class="call-num">${h.number}</span>` +
      `<span class="call-text"><span class="call-name">${tr(h.name)}</span>` +
      `<span class="call-note">${tr(h.note)}</span></span>` +
      `<svg class="ico call-icon" viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.25 1z"/></svg>`;
    list.appendChild(a);
  });

  list.appendChild(head(t("nearbyHelp")));
  services.places.forEach((p) => list.appendChild(placeRow(p, tr(p.locality))));
}

function renderParking(list) {
  const warn = document.createElement("p");
  warn.className = "warn";
  warn.textContent = t("parkingWarning");
  list.appendChild(warn);
  services.parking.forEach((p) => {
    const veh = p.vehicles === "two" ? t("vehTwo") : p.vehicles === "four" ? t("vehFour") : t("vehBoth");
    list.appendChild(placeRow(p, `${tr(p.locality)} · ${veh}`));
  });
}

function head(text) {
  const el = document.createElement("p");
  el.className = "section-head";
  el.textContent = text;
  return el;
}

// Card centres the map on it, the button beside it hands off to Google Maps.
function placeRow(item, sub) {
  const wrap = document.createElement("div");
  wrap.className = "row-wrap";
  wrap.appendChild(card(tr(item.name), sub, "", () => focusPlace(item)));
  const a = document.createElement("a");
  a.className = "dir-btn";
  a.href = gmapsTo(item);
  a.target = "_blank";
  a.rel = "noopener";
  a.innerHTML =
    '<svg class="ico" viewBox="0 0 24 24"><path d="M12 21s7-6.6 7-11a7 7 0 1 0-14 0c0 4.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>' +
    `<span>${t("directions")}</span>`;
  a.addEventListener("click", () =>
    track("maps_handoff", { kind: item.vehicles ? "parking" : "help", target_id: item.id, stop_count: 1 })
  );
  wrap.appendChild(a);
  return wrap;
}

function card(title, sub, meta, onClick) {
  const el = document.createElement("button");
  el.className = "card";
  el.innerHTML =
    `<span class="card-title">${title}</span>` +
    `<span class="card-sub">${sub}</span>` +
    (meta ? `<span class="card-meta">${meta}</span>` : "");
  el.addEventListener("click", onClick);
  return el;
}

/* ---------- language ---------- */

function setLang(next, source = "chosen") {
  lang = next;
  store.set(LANG_KEY, next);
  document.documentElement.lang = next;
  track("language_set", { language: next, source });

  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  $("lang-code").textContent = t("langShort");

  renderList();
  // Redraw the detail view only if it is the one on screen, so switching
  // language from the list does not yank the user into a detail page.
  if (selection && !$("view-detail").hidden) showDetail();
  else if (selection) refreshStartButton();
}

/* ---------- sheet, toast, wiring ---------- */

// Three snap points: mostly-map, half, mostly-list. Drag follows the finger and
// snaps to the nearest on release. A tap still works for anyone who does not drag.
const SNAPS = [0.24, 0.46, 0.86];
// The collapsed state still has to show the tab row, which is a fixed pixel
// height, so on a short phone the percentage alone is not enough.
const PEEK_MIN_PX = 150;
let snapIdx = 1;

function isDesktop() { return window.innerWidth >= 900; }

function snapPx(i) {
  const h = window.innerHeight * SNAPS[i];
  return i === 0 ? Math.max(PEEK_MIN_PX, h) : h;
}

function setSheetPx(px, animate) {
  $("sheet").style.transition = animate ? "" : "none";
  document.documentElement.style.setProperty("--sheet-h", Math.round(px) + "px");
}

function applySnap(i, animate = true) {
  if (isDesktop()) return;
  snapIdx = Math.max(0, Math.min(SNAPS.length - 1, i));
  setSheetPx(snapPx(snapIdx), animate);
  document.body.classList.toggle("sheet-full", snapIdx === SNAPS.length - 1);
}

function syncSheetHeight() { applySnap(snapIdx, false); }

function wireSheetDrag() {
  const handle = $("sheet-handle");
  let startY = 0, startH = 0, dragging = false, moved = 0;

  handle.addEventListener("pointerdown", (e) => {
    if (isDesktop()) return;
    dragging = true;
    moved = 0;
    startY = e.clientY;
    startH = $("sheet").getBoundingClientRect().height;
    handle.setPointerCapture(e.pointerId);
  });

  handle.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dy = e.clientY - startY;
    moved = Math.max(moved, Math.abs(dy));
    setSheetPx(Math.max(snapPx(0), Math.min(snapPx(SNAPS.length - 1), startH - dy)), false);
  });

  const end = () => {
    if (!dragging) return;
    dragging = false;
    if (moved < 6) {
      // Barely moved, so it was a tap: toggle between full and half.
      applySnap(snapIdx === SNAPS.length - 1 ? 1 : SNAPS.length - 1);
      return;
    }
    const h = $("sheet").getBoundingClientRect().height;
    let nearest = 0;
    SNAPS.forEach((_, i) => {
      if (Math.abs(snapPx(i) - h) < Math.abs(snapPx(nearest) - h)) nearest = i;
    });
    applySnap(nearest);
  };
  handle.addEventListener("pointerup", end);
  handle.addEventListener("pointercancel", end);
}

let toastTimer;
function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4500);
}
function hideToast() { $("toast").hidden = true; }

function wire() {
  wireSheetDrag();

  document.querySelectorAll(".tab").forEach((b) =>
    b.addEventListener("click", () => {
      setTab(b.dataset.tab);
      track("tab_changed", { tab: b.dataset.tab });
      showList();
      renderList();
      // Parking sits outside the mandal cluster, so bring it into view.
      if (b.dataset.tab === "parking") {
        fitTo(L.latLngBounds(services.parking.map((p) => [p.lat, p.lng])));
      }
    })
  );

  $("sos-btn").addEventListener("click", () => {
    track("sos_opened", {});
    setTab("emergency");
    showList();
    renderList();
    applySnap(SNAPS.length - 1);
    fitTo(L.latLngBounds(services.places.map((p) => [p.lat, p.lng])));
  });

  // One event per search, not per keystroke. What people look for and fail to
  // find is the most useful signal here: it names the mandals we are missing.
  let searchTimer;
  $("search").addEventListener("input", () => {
    showList();
    renderList();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const q = $("search").value.trim();
      if (q.length < 2) return;
      track("search_performed", {
        query: q.slice(0, 60).toLowerCase(),
        results: data.mandals.filter((m) => searchBlob(m).includes(q.toLowerCase())).length,
      });
    }, 900);
  });
  $("search").addEventListener("focus", () => { applySnap(SNAPS.length - 1); showList(); });

  // The conversion: someone left for Google Maps, meaning they actually set off.
  $("gmaps-btn").addEventListener("click", () => {
    if (!selection) return;
    track("maps_handoff", {
      kind: selection.kind,
      target_id: selection.ref.id,
      stop_count: selection.stops.length,
      from_location: !!startLatLng,
    });
  });

  $("ad-sound").addEventListener("click", () => {
    const v = $("ad-video");
    v.muted = !v.muted;
    $("ad-sound").classList.toggle("on", !v.muted);
    if (!v.muted) v.play().catch(() => {});
    track(v.muted ? "ad_muted" : "ad_unmuted", { language: lang });
  });
  $("ad-video").addEventListener("ended", adFinished);

  $("back-btn").addEventListener("click", showList);
  $("locate-btn").addEventListener("click", locateMe);
  $("start-btn").addEventListener("click", locateMe);

  $("lang-btn").addEventListener("click", () => { $("lang-gate").hidden = false; });
  document.querySelectorAll(".lang-choice").forEach((b) =>
    b.addEventListener("click", () => { setLang(b.dataset.lang); $("lang-gate").hidden = true; })
  );

  window.addEventListener("resize", syncSheetHeight);
}
