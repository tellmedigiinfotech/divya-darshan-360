import Link from "next/link"

/**
 * Fixed brand mark, top-left — the counterpart to <AuthButton /> on the right.
 *
 * No backing plate: /logo.png is a transparent cutout and sits straight on the
 * page. Drop shadows carry the legibility instead, since the hero video runs
 * through both bright and dark scenes underneath it.
 */
export function SiteLogo() {
    return (
        <Link
            href="/"
            aria-label="Divya Darshan 360 — home"
            className="fixed top-6 left-6 z-50 inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
            <img
                src="/logo.png"
                alt=""
                className="w-11 h-11 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
            />
            <span className="hidden sm:inline font-serif tracking-tight text-lg leading-none text-foreground drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]">
                Divya Darshan <span className="text-primary">360</span>
            </span>
        </Link>
    )
}
