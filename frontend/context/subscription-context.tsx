"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

export type Tier = 'BASE' | 'PRO' | 'ENTERPRISE'

interface SubscriptionContextType {
    tier: Tier
    loading: boolean
    usageLimit: number
    quotesProcessed: number
    billingCycleStart: string | null
    checkAccess: (requiredTier: Tier) => boolean
    refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

const TIER_LEVELS: Record<Tier, number> = {
    'BASE': 1,
    'PRO': 2,
    'ENTERPRISE': 3
}

import { apiRequest } from '@/lib/api-client'

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser()
    const [tier, setTier] = useState<Tier>('BASE')
    const [loading, setLoading] = useState(true)
    const [usageLimit, setUsageLimit] = useState(0)
    const [quotesProcessed, setQuotesProcessed] = useState(0)
    const [billingCycleStart, setBillingCycleStart] = useState<string | null>(null)

    const fetchSubscription = async () => {
        if (!user) return
        try {
            const data = await apiRequest(`/api/usage?user_id=${user.id}`)
            setTier(data.subscription_tier as Tier || 'BASE')
            setUsageLimit(data.usage_limit || 0)
            setQuotesProcessed(data.quotes_processed || 0)
            setBillingCycleStart(data.billing_cycle_start || null)
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
        <SubscriptionContext.Provider value={{
            tier,
            loading,
            usageLimit,
            quotesProcessed,
            billingCycleStart,
            checkAccess,
            refreshSubscription: fetchSubscription
        }}>
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
