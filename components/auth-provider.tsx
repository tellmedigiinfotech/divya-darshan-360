"use client"

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import {
    type ConfirmationResult,
    RecaptchaVerifier,
    type User,
    onAuthStateChanged,
    onIdTokenChanged,
    signInWithPhoneNumber,
    signOut as firebaseSignOut,
} from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase"
import { apiFetch, ApiError } from "@/lib/api"

export type CustomerProfile = {
    customer_id: string
    full_name: string
    phone: string
    email: string | null
    firebase_uid: string | null
    last_shipping_address: {
        line1?: string
        city?: string
        state?: string
        pincode?: string
        country?: string
        notes?: string
    } | null
}

type AuthContextValue = {
    user: User | null
    loading: boolean
    configError: string | null
    customer: CustomerProfile | null
    customerLoading: boolean
    customerError: string | null
    sendOtp: (phoneE164: string, recaptchaElementId: string) => Promise<ConfirmationResult>
    verifyOtp: (confirmation: ConfirmationResult, code: string) => Promise<User>
    refreshCustomer: () => Promise<CustomerProfile | null>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [configError, setConfigError] = useState<string | null>(null)
    const [customer, setCustomer] = useState<CustomerProfile | null>(null)
    const [customerLoading, setCustomerLoading] = useState(false)
    const [customerError, setCustomerError] = useState<string | null>(null)
    const fetchedForUidRef = useRef<string | null>(null)

    useEffect(() => {
        let auth
        try {
            auth = getFirebaseAuth()
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Firebase is not configured."
            setConfigError(msg)
            setLoading(false)
            return
        }
        const unsubAuth = onAuthStateChanged(auth, (u) => {
            setUser(u)
            setLoading(false)
            if (!u) {
                setCustomer(null)
                setCustomerError(null)
                fetchedForUidRef.current = null
            }
        })
        const unsubToken = onIdTokenChanged(auth, (u) => {
            setUser(u)
        })
        return () => {
            unsubAuth()
            unsubToken()
        }
    }, [])

    const fetchCustomer = useCallback(async (): Promise<CustomerProfile | null> => {
        setCustomerLoading(true)
        setCustomerError(null)
        try {
            const me = await apiFetch<{ customer: CustomerProfile }>("/auth/me", {
                auth: true,
            })
            setCustomer(me.customer)
            return me.customer
        } catch (err) {
            const msg =
                err instanceof ApiError
                    ? err.message
                    : err instanceof Error
                      ? err.message
                      : "Could not load profile."
            setCustomerError(msg)
            return null
        } finally {
            setCustomerLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!user) return
        if (fetchedForUidRef.current === user.uid) return
        fetchedForUidRef.current = user.uid
        fetchCustomer()
    }, [user, fetchCustomer])

    const sendOtp = useCallback(
        async (phoneE164: string, recaptchaElementId: string) => {
            const auth = getFirebaseAuth()
            const container = document.getElementById(recaptchaElementId)
            if (!container) {
                throw new Error(
                    `reCAPTCHA container "${recaptchaElementId}" not found in the DOM.`
                )
            }
            if (typeof window !== "undefined" && window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear()
                } catch {
                    /* ignore */
                }
                container.innerHTML = ""
                window.recaptchaVerifier = undefined
            }
            const verifier = new RecaptchaVerifier(auth, recaptchaElementId, {
                size: "invisible",
            })
            window.recaptchaVerifier = verifier
            await verifier.render()
            try {
                return await signInWithPhoneNumber(auth, phoneE164, verifier)
            } catch (err) {
                try {
                    verifier.clear()
                } catch {
                    /* ignore */
                }
                window.recaptchaVerifier = undefined
                throw err
            }
        },
        []
    )

    const verifyOtp = useCallback(
        async (confirmation: ConfirmationResult, code: string) => {
            const credential = await confirmation.confirm(code)
            return credential.user
        },
        []
    )

    const signOut = useCallback(async () => {
        const auth = getFirebaseAuth()
        await firebaseSignOut(auth)
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            configError,
            customer,
            customerLoading,
            customerError,
            sendOtp,
            verifyOtp,
            refreshCustomer: fetchCustomer,
            signOut,
        }),
        [user, loading, configError, customer, customerLoading, customerError, sendOtp, verifyOtp, fetchCustomer, signOut]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>")
    }
    return ctx
}
