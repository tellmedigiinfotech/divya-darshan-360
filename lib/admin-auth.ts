"use client"

import { API_BASE, ApiError } from "@/lib/api"

const STORAGE_KEY = "dd360_admin_password"

export function getAdminPassword(): string | null {
    if (typeof window === "undefined") return null
    try {
        return window.sessionStorage.getItem(STORAGE_KEY)
    } catch {
        return null
    }
}

export function setAdminPassword(password: string): void {
    if (typeof window === "undefined") return
    try {
        window.sessionStorage.setItem(STORAGE_KEY, password)
    } catch {
        /* ignore */
    }
}

export function clearAdminPassword(): void {
    if (typeof window === "undefined") return
    try {
        window.sessionStorage.removeItem(STORAGE_KEY)
    } catch {
        /* ignore */
    }
}

type AdminFetchOptions = Omit<RequestInit, "body"> & { body?: unknown }

export async function adminFetch<T>(path: string, opts: AdminFetchOptions = {}): Promise<T> {
    const password = getAdminPassword()
    if (!password) {
        throw new ApiError(401, "Admin password not set")
    }
    const headers: Record<string, string> = {
        Accept: "application/json",
        "X-Admin-Password": password,
        ...(opts.headers as Record<string, string> | undefined),
    }
    if (opts.body !== undefined && !(opts.body instanceof FormData)) {
        headers["Content-Type"] = "application/json"
    }
    const init: RequestInit = {
        ...opts,
        headers,
        body:
            opts.body === undefined
                ? undefined
                : opts.body instanceof FormData
                  ? opts.body
                  : JSON.stringify(opts.body),
    }
    const res = await fetch(`${API_BASE}${path}`, init)
    const text = await res.text()
    const data = text ? safeJson(text) : null
    if (!res.ok) {
        const message =
            (data && typeof data === "object" && "detail" in data && typeof data.detail === "string"
                ? data.detail
                : null) || `Request failed (HTTP ${res.status})`
        throw new ApiError(res.status, message, data)
    }
    return data as T
}

function safeJson(text: string): unknown {
    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}

/** Verify the password by calling /admin/me. Returns true on success. */
export async function verifyAdminPassword(password: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/me`, {
        headers: { "X-Admin-Password": password, Accept: "application/json" },
    })
    return res.ok
}
