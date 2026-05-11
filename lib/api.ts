import { getFirebaseAuth } from "@/lib/firebase"

export const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8001"

export class ApiError extends Error {
    status: number
    detail: unknown

    constructor(status: number, message: string, detail?: unknown) {
        super(message)
        this.status = status
        this.detail = detail
    }
}

type ApiOptions = Omit<RequestInit, "body"> & {
    body?: unknown
    auth?: boolean
}

async function buildHeaders(opts: ApiOptions): Promise<HeadersInit> {
    const headers: Record<string, string> = {
        Accept: "application/json",
        ...(opts.headers as Record<string, string> | undefined),
    }
    if (opts.body !== undefined && !(opts.body instanceof FormData)) {
        headers["Content-Type"] = "application/json"
    }
    if (opts.auth) {
        const user = getFirebaseAuth().currentUser
        if (!user) {
            throw new ApiError(401, "Not signed in")
        }
        const token = await user.getIdToken()
        headers["Authorization"] = `Bearer ${token}`
    }
    return headers
}

export async function apiFetch<T>(path: string, opts: ApiOptions = {}): Promise<T> {
    const headers = await buildHeaders(opts)
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
