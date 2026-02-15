"use client"

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Zap, Info, BarChart, History } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BillingPage() {
    const [usage, setUsage] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [interval, setInterval] = useState<'month' | 'year'>('month')

    useEffect(() => {
        fetchUsage()
    }, [])

    const fetchUsage = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/usage?user_id=PilotUser_01')
            const data = await res.json()
            setUsage(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const goToCheckout = (tier: string, price: number) => {
        // Redirect to checkout page with tier and price info
        const params = new URLSearchParams({
            tier,
            price: price.toString(),
            interval
        })
        window.location.href = `/checkout?${params.toString()}`
    }

    if (loading && !usage) return <div className="p-8">Loading billing data...</div>

    const processed = usage?.quotes_processed || 0
    const limit = usage?.usage_limit || 50
    const progress = Math.min(100, (processed / limit) * 100)

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-in pb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Usage</h1>
                    <p className="text-muted-foreground">Manage your subscription and track normalization credits.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Subscription */}
                    <Card className="md:col-span-2 border-border bg-card glass-card">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-foreground font-black uppercase text-xs tracking-wider">
                                <span>Active Plan</span>
                                <Badge className={cn(
                                    "border-none font-black text-[10px] tracking-widest",
                                    usage?.subscription_tier === 'PRO' ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                )}>
                                    {usage?.subscription_tier} PLAN
                                </Badge>
                            </CardTitle>
                            <CardDescription className="text-muted-foreground font-medium">
                                Your current billing cycle ends on {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Normalization Credits Used</span>
                                    <span className="text-foreground font-black">{processed} / {limit} quotes</span>
                                </div>
                                <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-500",
                                            progress > 90 ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]" : "bg-primary shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                                        )}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                {usage?.overage > 0 && (
                                    <p className="text-[10px] text-red-600 dark:text-red-400 font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <Zap size={12} /> Overage detected: {usage.overage} extra quotes processed. Total overage fees: ${usage.overage_fees.toFixed(2)}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Monthly Base</p>
                                    <p className="text-2xl font-black text-foreground">${usage?.monthly_base?.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Total Accrued</p>
                                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">${(usage?.monthly_base + (usage?.overage_fees || 0)).toFixed(2)}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 border-t border-border rounded-b-xl flex justify-between items-center p-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight">
                                <CreditCard size={14} />
                                <span>Default: Visa •••• 4242</span>
                            </div>
                            <button className="text-xs font-black text-primary hover:text-blue-500 uppercase tracking-widest transition-colors">Update Payment</button>
                        </CardFooter>
                    </Card>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <Card className="border-border bg-card glass-card h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                    <BarChart size={14} className="text-blue-500" /> Usage Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm font-medium text-foreground leading-relaxed">
                                    Your team is processing <span className="font-black text-blue-600 dark:text-blue-400">12% more</span> quotes than last month.
                                </p>
                                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex gap-3">
                                    <Info className="text-amber-500 shrink-0" size={18} />
                                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 leading-normal">
                                        Approaching limit. Consider upgrading to avoid overage fees.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Pricing Tiers */}
                <div className="pt-8 pb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Enterprise Scalability Tiers</h2>
                            <p className="text-sm text-muted-foreground font-medium">Clear, performance-driven pricing for logistics teams of any size.</p>
                        </div>

                        <div className="flex items-center gap-3 bg-muted p-1 rounded-2xl border border-border">
                            <button
                                onClick={() => setInterval('month')}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    interval === 'month' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setInterval('year')}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    interval === 'year' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600-20" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Yearly
                                <span className="bg-green-500/20 text-[8px] px-1.5 py-0.5 rounded-full text-green-600 dark:text-green-400">SAVE 20%</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className={cn(
                            "border-border bg-card glass-card overflow-hidden",
                            usage?.subscription_tier === 'BASE' && "ring-2 ring-primary shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                        )}>
                            <CardHeader>
                                <CardTitle className="font-black tracking-tight text-foreground uppercase text-xs">Base Tier</CardTitle>
                                <CardDescription className="text-muted-foreground font-medium">Perfect for small logistics teams.</CardDescription>
                                <div className="text-3xl font-black mt-4 text-foreground">
                                    ${interval === 'month' ? '99' : '79'}
                                    <span className="text-sm font-bold text-muted-foreground">/mo</span>
                                </div>
                                {interval === 'year' && <p className="text-[10px] font-bold text-green-500 mt-1 uppercase">Billed yearly ($948/yr)</p>}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="text-xs font-bold text-muted-foreground space-y-3">
                                    <li className="flex items-center gap-2">✅ <span className="text-foreground">50</span> Normalizations / mo</li>
                                    <li className="flex items-center gap-2">✅ Audit History (30 days)</li>
                                    <li className="flex items-center gap-2">✅ Basic Analytics</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <button
                                    disabled={usage?.subscription_tier === 'BASE'}
                                    onClick={() => goToCheckout('BASE', interval === 'month' ? 99 : 79)}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
                                >
                                    {usage?.subscription_tier === 'BASE' ? 'Current Plan' : 'Select Base Plan'}
                                </button>
                            </CardFooter>
                        </Card>

                        <Card className={cn(
                            "border-border bg-card glass-card",
                            usage?.subscription_tier === 'PRO' && "ring-2 ring-purple-600 dark:ring-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.15)]"
                        )}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between font-black tracking-tight text-foreground uppercase text-xs">
                                    <span>Pro Tier</span>
                                    <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-none font-black text-[10px] tracking-widest">POPULAR</Badge>
                                </CardTitle>
                                <CardDescription className="text-muted-foreground font-medium">For growing freight forwarders.</CardDescription>
                                <div className="text-3xl font-black mt-4 text-foreground">
                                    ${interval === 'month' ? '499' : '399'}
                                    <span className="text-sm font-bold text-muted-foreground">/mo</span>
                                </div>
                                {interval === 'year' && <p className="text-[10px] font-bold text-green-500 mt-1 uppercase">Billed yearly ($4,788/yr)</p>}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="text-xs font-bold text-muted-foreground space-y-3">
                                    <li className="flex items-center gap-2">✅ <span className="text-foreground">500</span> Normalizations / mo</li>
                                    <li className="flex items-center gap-2">✅ Multi-Agent Audit (Advanced)</li>
                                    <li className="flex items-center gap-2">✅ ERP & Webhook Integration</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <button
                                    disabled={usage?.subscription_tier === 'PRO'}
                                    onClick={() => goToCheckout('PRO', interval === 'month' ? 499 : 399)}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
                                >
                                    {usage?.subscription_tier === 'PRO' ? 'Current Plan' : 'Select Pro Plan'}
                                </button>
                            </CardFooter>
                        </Card>

                        <Card className={cn(
                            "border-border bg-card glass-card overflow-hidden relative",
                            usage?.subscription_tier === 'ENTERPRISE' && "ring-2 ring-indigo-600 dark:ring-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)]"
                        )}>
                            <div className="absolute top-0 right-0 p-3">
                                <Zap className="text-indigo-500 animate-pulse" size={20} />
                            </div>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between font-black tracking-tight text-foreground uppercase text-xs">
                                    <span>Enterprise Tier</span>
                                    <Badge className="bg-indigo-600 text-white border-none font-black text-[10px] tracking-widest">ENTERPRISE</Badge>
                                </CardTitle>
                                <CardDescription className="text-muted-foreground font-medium">Unlimited scale for global logistics Corridors.</CardDescription>
                                <div className="text-2xl font-black mt-4 text-foreground uppercase tracking-tighter">
                                    Contact Sales
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Custom quotes for high volume</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="text-xs font-bold text-muted-foreground space-y-3">
                                    <li className="flex items-center gap-2">✅ <span className="text-foreground">Unlimited</span> Normalizations</li>
                                    <li className="flex items-center gap-2">✅ Predictive Telematics Hub</li>
                                    <li className="flex items-center gap-2">✅ AI Freight Claims (Unlimited)</li>
                                    <li className="flex items-center gap-2">✅ 24/7 Priority Concierge</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <button
                                    disabled={usage?.subscription_tier === 'ENTERPRISE'}
                                    onClick={() => window.location.href = '/contact?plan=elite'}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 disabled:opacity-30 transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    {usage?.subscription_tier === 'ENTERPRISE' ? 'Current Plan' : 'Contact Sales'}
                                </button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
