"use client"

import React from 'react'
import { useSubscription, Tier } from '@/context/subscription-context'
import { Lock } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'

interface FeatureGateProps {
    children: React.ReactNode
    requiredTier: Tier
    fallback?: React.ReactNode
    showLock?: boolean
}

export function FeatureGate({ children, requiredTier, fallback, showLock = false }: FeatureGateProps) {
    const { checkAccess, loading } = useSubscription()

    if (loading) return null // Or a skeleton

    if (checkAccess(requiredTier)) {
        return <>{children}</>
    }

    if (fallback) {
        return <>{fallback}</>
    }

    if (showLock) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div className="relative group cursor-not-allowed opacity-60 grayscale">
                            <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="pointer-events-none">
                                {children}
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-neutral-900 text-white border-neutral-800">
                        <p className="font-bold text-xs">Requires {requiredTier} Plan</p>
                        <Link href="/settings/billing" className="text-[10px] text-blue-400 hover:underline mt-1 block">
                            Upgrade to unlock
                        </Link>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return null
}
