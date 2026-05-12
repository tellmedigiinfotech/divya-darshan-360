"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogIn, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AuthButton() {
    const pathname = usePathname() || ""
    const { user, loading, configError, signOut } = useAuth()

    // Hide on the dedicated /login page — would just be redundant.
    if (pathname.startsWith("/login")) return null

    // If Firebase isn't configured at all, don't show the button.
    if (configError) return null

    // First-paint flicker: keep the slot quiet during the auth check.
    if (loading) {
        return (
            <div
                aria-hidden
                className="fixed top-6 right-6 z-50 h-10 w-10 rounded-full glass border border-primary/15 backdrop-blur-md"
            />
        )
    }

    if (!user) {
        return (
            <Link
                href={`/login?next=${encodeURIComponent(pathname || "/")}`}
                className="fixed top-6 right-6 z-50 inline-flex items-center gap-2 rounded-full glass border border-primary/30 bg-primary/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg shadow-primary/10"
            >
                <LogIn className="w-4 h-4" />
                <span className="font-serif tracking-wide">Sign in</span>
            </Link>
        )
    }

    const phone = user.phoneNumber || ""
    const shortPhone = phone.replace(/^\+91/, "").replace(/(\d{5})(\d{5})/, "$1 $2")

    // If Firebase has a real photo (e.g. from a future Google sign-in), use
    // it. Otherwise generate a stable saffron-themed avatar from the phone
    // via DiceBear — same seed -> same picture forever.
    const seed = phone || user.uid
    const generatedAvatar = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=fef3c7,fde68a,fcd34d,fbbf24&radius=50`
    const avatarUrl = user.photoURL || generatedAvatar

    return (
        <div className="fixed top-6 right-6 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full glass border border-primary/30 bg-white/60 backdrop-blur-md pl-1 pr-3 py-1 text-sm font-medium text-foreground hover:bg-primary/10 transition-all shadow-lg shadow-primary/10"
                        aria-label="Account menu"
                    >
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full ring-1 ring-primary/30 bg-white object-cover"
                        />
                        <span className="hidden sm:inline font-mono text-xs text-muted-foreground">
                            +91 {shortPhone}
                        </span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="flex items-center gap-3 py-3">
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full ring-1 ring-primary/30 bg-white object-cover"
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Signed in</span>
                            <span className="font-mono text-sm">{phone || "—"}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            void signOut()
                        }}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
