"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Zap, Info, BarChart, History, FileText, ShieldAlert, Receipt, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { apiRequest } from '@/lib/api-client'
export default function BillingPage() {
    const { user } = useUser()
    const searchParams = useSearchParams()
    const [usage, setUsage] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [interval, setInterval] = useState<'month' | 'year'>('month')
    const [selectedTier, setSelectedTier] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            fetchUsage()
        }
    }, [user])

    useEffect(() => {
        if (searchParams.get('success')) {
            toast.success('Subscription updated successfully! Your new limits are activating.', {
                duration: 5000,
            })
        }
        if (searchParams.get('canceled')) {
            toast.info('Checkout canceled. Your current plan remains active.')
        }
    }, [searchParams])

    useEffect(() => {
        if (usage && !selectedTier) {
            setSelectedTier(usage.subscription_tier)
        }
    }, [usage, selectedTier])

    const fetchUsage = async () => {
        if (!user) return
        try {
            const data = await apiRequest(`/api/usage?user_id=${user.id}`)
            setUsage(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const tiers = {
        'BASE': { limit: 50, price_mo: 99, price_yr: 79 },
        'PRO': { limit: 500, price_mo: 499, price_yr: 399 },
        'ENTERPRISE': { limit: 10000, price_mo: 2500, price_yr: 2000 } // Representative for preview
    }

    const goToCheckout = (tier: string, price: number) => {
        const params = new URLSearchParams({
            tier,
            price: price.toString(),
            interval
        })
        window.location.href = `/checkout?${params.toString()}`
    }

    if (loading && !usage) return <div className="p-8">Loading billing data...</div>

    const processed = usage?.quotes_processed || 0
    const currentTierData = tiers[usage?.subscription_tier as keyof typeof tiers]
    const selectedTierData = tiers[selectedTier as keyof typeof tiers]

    const limit = selectedTierData?.limit || usage?.usage_limit || 50
    const progress = Math.min(100, (processed / limit) * 100)
    const isPreview = selectedTier !== usage?.subscription_tier

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-in pb-12">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Usage</h1>
                        <p className="text-muted-foreground">Manage your subscription and track normalization credits.</p>
                    </div>
                    {isPreview && (
                        <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pulse">
                            <Info size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Previewing: {selectedTier} Plan</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Subscription / Preview */}
                    <Card className={cn(
                        "md:col-span-2 border-border bg-card glass-card transition-all duration-500",
                        isPreview && "ring-2 ring-primary/50 shadow-2xl scale-[1.01]"
                    )}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-foreground font-black uppercase text-xs tracking-wider">
                                <span>{isPreview ? 'Projected Plan' : 'Active Plan'}</span>
                                <Badge className={cn(
                                    "border-none font-black text-[10px] tracking-widest",
                                    (isPreview ? selectedTier : usage?.subscription_tier) === 'PRO' ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                )}>
                                    {isPreview ? selectedTier : usage?.subscription_tier} PLAN {isPreview && '(PREVIEW)'}
                                </Badge>
                            </CardTitle>
                            <CardDescription className="text-muted-foreground font-medium">
                                {isPreview
                                    ? "Previewing how this upgrade will scale your throughput."
                                    : `Your current billing cycle ends on ${new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Normalization Credits {isPreview ? 'Capacity' : 'Used'}</span>
                                    <span className="text-foreground font-black">{processed} / {limit} quotes</span>
                                </div>
                                <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-700 ease-out",
                                            progress > 90 ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]" : "bg-primary shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                                        )}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                {usage?.overage > 0 && !isPreview && (
                                    <p className="text-[10px] text-red-600 dark:text-red-400 font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <Zap size={12} /> Overage detected: {usage.overage} extra quotes processed. Total overage fees: ${usage.overage_fees.toFixed(2)}
                                    </p>
                                )}
                                {isPreview && (
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <Zap size={12} /> Upgrade increases your capacity by {limit - (usage?.usage_limit || 0)} quotes/month.
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{isPreview ? 'Projected Base' : 'Monthly Base'}</p>
                                    <p className="text-2xl font-black text-foreground">
                                        ${(isPreview ? (interval === 'month' ? selectedTierData?.price_mo : selectedTierData?.price_yr) : usage?.monthly_base)?.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{isPreview ? 'Current Limit' : 'Total Accrued'}</p>
                                    <p className={cn(
                                        "text-2xl font-black",
                                        isPreview ? "text-muted-foreground" : "text-blue-600 dark:text-blue-400"
                                    )}>
                                        {isPreview ? `${usage?.usage_limit} Q` : `$${(usage?.monthly_base + (usage?.overage_fees || 0)).toFixed(2)}`}
                                    </p>
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
                        {/* Base Tier */}
                        <Card
                            onClick={() => setSelectedTier('BASE')}
                            className={cn(
                                "border-border bg-card glass-card overflow-hidden cursor-pointer transition-all duration-300",
                                selectedTier === 'BASE' ? "ring-2 ring-primary shadow-xl scale-[1.02]" : "hover:border-primary/50",
                                usage?.subscription_tier === 'BASE' && "ring-offset-2 ring-emerald-500/30"
                            )}
                        >
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center font-black tracking-tight text-foreground uppercase text-xs">
                                    <span>Base Tier</span>
                                    {usage?.subscription_tier === 'BASE' && <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] tracking-[0.2em] px-2 py-0.5">CURRENT</Badge>}
                                </CardTitle>
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (usage?.subscription_tier !== 'BASE') goToCheckout('BASE', interval === 'month' ? 99 : 79);
                                    }}
                                    className={cn(
                                        "w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg",
                                        usage?.subscription_tier === 'BASE'
                                            ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                                            : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
                                    )}
                                >
                                    {usage?.subscription_tier === 'BASE' ? 'Current Plan' : 'Activate Base Plan'}
                                </button>
                            </CardFooter>
                        </Card>

                        {/* Pro Tier */}
                        <Card
                            onClick={() => setSelectedTier('PRO')}
                            className={cn(
                                "border-border bg-card glass-card cursor-pointer transition-all duration-300",
                                selectedTier === 'PRO' ? "ring-2 ring-purple-600 dark:ring-purple-500 shadow-xl scale-[1.02]" : "hover:border-purple-500/50",
                                usage?.subscription_tier === 'PRO' && "ring-offset-2 ring-emerald-500/30"
                            )}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between font-black tracking-tight text-foreground uppercase text-xs">
                                    <span className="flex items-center gap-2">Pro Tier <Badge className="bg-yellow-500/10 text-yellow-600 border-none font-black text-[8px] tracking-tight">POPULAR</Badge></span>
                                    {usage?.subscription_tier === 'PRO' && <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] tracking-[0.2em] px-2 py-0.5">CURRENT</Badge>}
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (usage?.subscription_tier !== 'PRO') goToCheckout('PRO', interval === 'month' ? 499 : 399);
                                    }}
                                    className={cn(
                                        "w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg",
                                        usage?.subscription_tier === 'PRO'
                                            ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                                            : "bg-purple-600 text-white hover:opacity-90 shadow-purple-600/20"
                                    )}
                                >
                                    {usage?.subscription_tier === 'PRO' ? 'Current Plan' : 'Activate Pro Plan'}
                                </button>
                            </CardFooter>
                        </Card>

                        {/* Enterprise Tier */}
                        <Card
                            onClick={() => setSelectedTier('ENTERPRISE')}
                            className={cn(
                                "border-border bg-card glass-card overflow-hidden relative cursor-pointer transition-all duration-300",
                                selectedTier === 'ENTERPRISE' ? "ring-2 ring-indigo-600 dark:ring-indigo-500 shadow-xl scale-[1.02]" : "hover:border-indigo-500/50",
                                usage?.subscription_tier === 'ENTERPRISE' && "ring-offset-2 ring-emerald-500/30"
                            )}
                        >
                            <div className="absolute top-0 right-0 p-3">
                                <Zap className="text-indigo-500 animate-pulse" size={20} />
                            </div>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between font-black tracking-tight text-foreground uppercase text-xs">
                                    <span>Enterprise Tier</span>
                                    {usage?.subscription_tier === 'ENTERPRISE' ? (
                                        <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] tracking-[0.2em] px-2 py-0.5">CURRENT</Badge>
                                    ) : (
                                        <Badge className="bg-indigo-600 text-white border-none font-black text-[8px] tracking-tight">PLATINUM</Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground font-medium">Unlimited scale for global logistics.</CardDescription>
                                <div className="text-2xl font-black mt-4 text-foreground uppercase tracking-tighter">
                                    Contact Sales
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Custom quotes for high volume</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="text-xs font-bold text-muted-foreground space-y-3">
                                    <li className="flex items-center gap-2">✅ <span className="text-foreground">Unlimited</span> Normalizations</li>
                                    <li className="flex items-center gap-2">✅ Predictive Telematics Hub</li>
                                    <li className="flex items-center gap-2">✅ 24/7 Priority Concierge</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = '/contact?plan=elite';
                                    }}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    {usage?.subscription_tier === 'ENTERPRISE' ? 'Manage Enterprise' : 'Contact Sales'}
                                </button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Product Showcase */}
                <div className="pt-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic tracking-widest">Powered by LogiMatch AI</h2>
                        <p className="text-muted-foreground font-medium mt-2">Unlock the full potential of your normalization credits across our core modules.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: 'Quote Matrix', desc: 'Centralize and normalize thousands of freight quotes instantly.', icon: <FileText size={24} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { title: 'Intelligence Hub', desc: 'Advanced analytics and market benchmark comparisons.', icon: <BarChart size={24} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                            { title: 'Risk Monitor', icon: <ShieldAlert size={24} />, desc: 'Real-time supply chain health and vulnerability tracking.', color: 'text-red-500', bg: 'bg-red-500/10' },
                            { title: 'Global Reconcile', icon: <Receipt size={24} />, desc: 'Automated invoice audit and spend validation.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        ].map((feature, i) => (
                            <div key={i} className="group p-6 rounded-3xl border border-border/50 bg-card glass-card hover:border-primary/50 transition-all duration-300">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-black text-sm uppercase tracking-widest text-foreground">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="pt-24 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-black tracking-tight text-foreground uppercase tracking-widest">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground font-medium mt-2">Everything you need to know about billing and credits.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "What counts as a 'Normalization' credit?", a: "One credit is consumed whenever our AI processes a unique freight quote spreadsheet or PDF. We deduplicate identical files so you're never charged twice for the same data." },
                            { q: "What happens if I exceed my usage limit?", a: "Overage fees are charged per quote at a rate determined by your tier. Pro and Enterprise tiers enjoy significantly lower overages. We'll notify you when you reach 80% and 90% of your limit." },
                            { q: "Can I roll over unused credits?", a: "Credits are allocated monthly or annually based on your plan and do not roll over to the next billing cycle. Enterprise customers can negotiate custom roll-over policies." },
                            { q: "How do I upgrade or downgrade?", a: "You can upgrade instantly from this page. Downgrades take effect at the end of your current billing cycle." }
                        ].map((faq, i) => (
                            <details key={i} className="group p-6 rounded-3xl border border-border/40 bg-card/50 glass-card">
                                <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-sm text-foreground uppercase tracking-tight">
                                    {faq.q}
                                    <ChevronDown size={16} className="text-muted-foreground transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="mt-4 text-sm text-muted-foreground leading-relaxed font-medium border-t border-border/20 pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Blog Preview */}
                <div className="pt-24">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase tracking-widest">Logistics Intelligence Blog</h2>
                            <p className="text-muted-foreground font-medium mt-2">Stay ahead of global freight trends and AI breakthroughs.</p>
                        </div>
                        <Link href="/blog" className="text-xs font-black uppercase tracking-widest text-primary hover:text-blue-500 transition-colors">View All Posts &rarr;</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'The Future of AI Normalization', date: 'Feb 12, 2026', tag: 'Engineering', img: '/blog/ai-norm.png' },
                            { title: 'Top 5 Freight Trends for 2026', date: 'Feb 10, 2026', tag: 'Market Insights', img: '/blog/trends.png' },
                            { title: 'Scaling Logistics ROI', date: 'Feb 05, 2026', tag: 'Case Study', img: '/blog/roi.png' }
                        ].map((post, i) => (
                            <Link key={i} href="/blog" className="group rounded-3xl overflow-hidden border border-border/40 bg-card glass-card hover:border-primary/50 transition-all duration-300">
                                <div className="h-40 bg-muted relative overflow-hidden">
                                    <img src={post.img} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black tracking-widest uppercase mb-2">{post.tag}</Badge>
                                        <p className="text-[10px] font-bold text-muted-foreground">{post.date}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Banner (Ad) */}
                <div className="pt-24 pb-12">
                    <div className="relative rounded-[2.5rem] bg-indigo-600 p-12 overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/20 rounded-full blur-3xl opacity-50" />

                        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <Badge className="bg-white/20 text-white border-none text-[10px] font-black tracking-[0.2em] px-3 py-1 mb-6">UNLIMITED SCALE</Badge>
                                <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-6">
                                    Looking for <br />
                                    <span className="italic opacity-80 underline underline-offset-8">Global Mastery?</span>
                                </h2>
                                <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-md mb-8">
                                    Enterprise customers get custom white-labeling, SOC2 compliance packs, and dedicated ROI concierge support.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => window.location.href = '/contact?plan=enterprise'}
                                        className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/40"
                                    >
                                        Inquire about Enterprise
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/api-reference'}
                                        className="px-8 py-4 bg-indigo-500/50 text-white border border-indigo-200/20 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500/80 transition-all"
                                    >
                                        View API Specs
                                    </button>
                                </div>
                            </div>
                            <div className="hidden lg:flex justify-end pr-8">
                                <div className="relative">
                                    <div className="w-64 h-64 border-4 border-white/20 rounded-full flex items-center justify-center animate-spin-slow">
                                        <Zap size={100} className="text-white fill-current opacity-20" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white p-6 rounded-3xl shadow-2xl rotate-3">
                                            <CreditCard size={40} className="text-indigo-600" />
                                            <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-indigo-900">Virtual Corridor</p>
                                            <p className="text-[8px] font-bold text-indigo-600 mt-1 uppercase">Unlimited Tunnels</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-8">
                        &copy; 2026 LogiMatch AI. Engineered for the 1% of Global Freight Forwarders.
                    </p>
                </div>
            </div>
        </AppLayout>
    )
}
