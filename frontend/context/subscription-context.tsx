"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

export type Tier = 'BASE' | 'PRO' | 'ENTERPRISE'

interface SubscriptionContextType {
    tier: Tier
    loading: boolean
    checkAccess: (requiredTier: Tier) => boolean
    refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

const TIER_LEVELS: Record<Tier, number> = {
    'BASE': 1,
    'PRO': 2,
    'ENTERPRISE': 3
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser()
    const [tier, setTier] = useState<Tier>('BASE')
    const [loading, setLoading] = useState(true)

    const fetchSubscription = async () => {
        if (!user) return
        try {
            // In a real app, this would be a dedicated endpoint or part of the user session
            // For now, we reuse the usage endpoint which returns the tier
            const res = await fetch(`http://localhost:5000/api/usage?user_id=${user.id}`)
            if (res.ok) {
                const data = await res.json()
                setTier(data.subscription_tier as Tier || 'BASE')
            }
        } catch (error) {
            console.error("Failed to fetch subscription:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoaded && user) {
            fetchSubscription()
        } else if (isLoaded && !user) {
            setLoading(false)
        }
    }, [isLoaded, user])

    const checkAccess = (requiredTier: Tier) => {
        return TIER_LEVELS[tier] >= TIER_LEVELS[requiredTier]
    }

    return (
        <SubscriptionContext.Provider value={{ tier, loading, checkAccess, refreshSubscription: fetchSubscription }}>
            {children}
        </SubscriptionContext.Provider>
    )
}

export function useSubscription() {
    const context = useContext(SubscriptionContext)
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider')
    }
    return context
}
