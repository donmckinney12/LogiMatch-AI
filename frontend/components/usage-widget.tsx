"use client"

import { useEffect, useState } from 'react'
import { HardDrive, BarChart3, ShieldCheck, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { apiRequest } from '@/lib/api-client'

export function UsageWidget() {
    const [usage, setUsage] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const data = await apiRequest('/api/usage?user_id=PilotUser_01')
                setUsage(data)
            } catch (e) {
                console.error("Usage fetch failed", e)
            } finally {
                setLoading(false)
            }
        }
        fetchUsage()
        const interval = setInterval(fetchUsage, 30000)
        return () => clearInterval(interval)
    }, [])

    if (loading) return <div className="animate-pulse bg-neutral-100 dark:bg-white/5 h-32 rounded-xl" />

    const processed = usage?.quotes_processed || 0
    const limit = usage?.usage_limit || 50
    const percentage = Math.min(100, (processed / limit) * 100)
    const tier = usage?.subscription_tier || 'BASE'

    return (
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                    <BarChart3 size={16} className="text-blue-600 dark:text-blue-400" />
                    Tier: {tier}
                </h3>
                {usage?.overage > 0 && (
                    <Zap size={14} className="text-red-500 animate-pulse" fill="currentColor" />
                )}
            </div>

            <div className="space-y-3">
                {/* Quotes Processed */}
                <div>
                    <div className="flex justify-between text-[10px] font-bold text-neutral-500 uppercase mb-1">
                        <span>Normalization Credits</span>
                        <span>{processed} / {limit}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-500",
                                usage?.overage > 0 ? "bg-red-500" : "bg-blue-600"
                            )}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    {usage?.overage > 0 && (
                        <p className="text-[10px] text-red-600 mt-1 font-bold animate-pulse">
                            LIMIT EXCEEDED (+${usage.overage_fees.toFixed(2)} FEES)
                        </p>
                    )}
                </div>

                {/* Storage Mock */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <HardDrive size={12} />
                        <span>Audit Persistence</span>
                    </div>
                    <span className="font-medium text-foreground">ACTIVE</span>
                </div>

                {/* Security Status Mock */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <ShieldCheck size={12} />
                        <span>Role: ADMIN</span>
                    </div>
                    <span className="text-green-600 font-bold uppercase text-[10px]">VERIFIED</span>
                </div>

                {/* Deployment Signature */}
                <div className="pt-1 flex items-center justify-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-blue-500/50">
                    <Zap size={8} fill="currentColor" />
                    <span>Production Sync Active</span>
                </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-white/5">
                <Link
                    href="/settings/billing"
                    className="w-full inline-flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:text-blue-700 transition-colors"
                >
                    Manage Subscription & Overages
                </Link>
            </div>
        </div>
    )
}
