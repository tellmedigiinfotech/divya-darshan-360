"use client"

import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app"
import { type Auth, getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
}

let cachedApp: FirebaseApp | null = null
let cachedAuth: Auth | null = null

export function getFirebaseApp(): FirebaseApp {
    if (cachedApp) return cachedApp
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        throw new Error(
            "Firebase web SDK is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local."
        )
    }
    cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
    return cachedApp
}

export function getFirebaseAuth(): Auth {
    if (cachedAuth) return cachedAuth
    cachedAuth = getAuth(getFirebaseApp())
    return cachedAuth
}
