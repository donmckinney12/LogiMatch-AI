"use client"

import Link from "next/link"
import {
    LayoutDashboard,
    TrendingUp,
    Zap,
    Scale,
    ChevronRight,
    ArrowLeft,
    Gavel,
    Globe,
    MapPin,
    CreditCard,
    ShieldCheck,
    Package,
    LifeBuoy,
    FileBadge,
    BarChart3,
    Sword,
    ArrowUpRight,
    Search,
    User,
    Settings,
    HelpCircle,
    Mail,
    Clock,
    Shield,
    BarChart,
    Lock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/context/subscription-context"
import { OnboardingGuide } from "@/components/onboarding-guide"

const quadrants = [
    {
        name: "Procurement Center",
        icon: LayoutDashboard,
        color: "blue",
        desc: "Strategic sourcing and tender management",
        primaryStat: "8 Active Tenders",
        subStat: "+$124k Saved this month",
        hasData: false, // Defaulting to false for demonstration of empty states
        cta: { label: "Launch First Tender", href: "/procurement/tenders" },
        links: [
            { name: "Mission Control", href: "/dashboard", icon: LayoutDashboard },
            { name: "Tender Management", href: "/procurement/tenders", icon: Gavel },
            { name: "Savings Matrix", href: "/quotes", icon: BarChart3 },
        ]
    },
    {
        name: "Intelligence Suite",
        icon: TrendingUp,
        color: "amber",
        desc: "Market dynamics and predictive modeling",
        primaryStat: "Market Volatility: Low",
        subStat: "Shanghai-LA Rates Down 4%",
        hasData: false,
        cta: { label: "Analyze Market Trends", href: "/analytics" },
        links: [
            { name: "Market Intelligence", href: "/analytics/market", icon: Globe },
            { name: "Strategic War Room", href: "/analytics/war-room", icon: Sword },
            { name: "Intelligence Hub", href: "/analytics", icon: Zap },
        ]
    },
    {
        name: "Operations Hub",
        icon: Zap,
        color: "emerald",
        desc: "Real-time execution and telematics",
        primaryStat: "43 Shipments Active",
        subStat: "98.2% On-Time Performance",
        hasData: false,
        cta: { label: "Connect Telematics", href: "/tracking" },
        links: [
            { name: "Global Tracking", href: "/tracking", icon: MapPin },
            { name: "Inventory Impact", href: "/inventory", icon: Package },
            { name: "Claims Center", href: "/logistics/claims", icon: LifeBuoy },
        ]
    },
    {
        name: "Compliance & Governance",
        icon: Scale,
        color: "purple",
        desc: "Regulatory filings and audit trails",
        primaryStat: "100% Audit Readiness",
        subStat: "No Pending HS Discrepancies",
        hasData: true, // Keep compliance as having data
        cta: { label: "Review Audit Trail", href: "/compliance" },
        links: [
            { name: "Legal Center", href: "/settings/legal", icon: Scale },
            { name: "Trade Compliance", href: "/compliance", icon: FileBadge },
            { name: "Billing & Credits", href: "/settings/billing", icon: CreditCard },
        ]
    }
]

export default function ClientPortal() {
    const { tier, loading, usageLimit, quotesProcessed, billingCycleStart } = useSubscription()
    const router = useRouter()

    const daysRemaining = billingCycleStart ? Math.max(0, 30 - Math.floor((new Date().getTime() - new Date(billingCycleStart).getTime()) / (1000 * 60 * 60 * 24))) : 0
    const usagePercentage = usageLimit > 0 ? (quotesProcessed / usageLimit) * 100 : 0

    const isPayingCustomer = ['BASE', 'PRO', 'ENTERPRISE'].includes(tier)

    const handleModuleClick = (e: React.MouseEvent, href: string) => {
        if (!isPayingCustomer) {
            e.preventDefault()
            router.push('/settings/billing')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Zap size={48} className="text-primary animate-pulse" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Initializing Command Center...</p>
            </div>
        )
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Top Navigation Row */}
            <div className="flex items-center">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Home
                </Link>
            </div>

            {/* Hero Section */}
            <div className="relative">
                <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                            <span className={cn("flex h-1.5 w-1.5 rounded-full bg-primary", isPayingCustomer && "animate-pulse")} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                {isPayingCustomer ? "Enterprise System Online — v4.2.0" : "Preview Mode — v4.2.0"}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground italic uppercase leading-none">
                            Global <br />
                            <span className="text-primary italic">Command Center.</span>
                        </h1>
                        <p className="mt-4 text-muted-foreground font-medium text-lg max-w-2xl">
                            Consolidated access to your enterprise supply chain stack. Monitor performance, execute strategies, and ensure compliance across all active corridors.
                        </p>
                    </div>

                    {/* Subscription & Usage Widget */}
                    <div className="flex-shrink-0 w-full xl:w-[480px] bg-card border border-border/50 rounded-[32px] p-6 shadow-2xl shadow-black/5 glass-card relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Account Status</div>
                                    <div className="text-lg font-black text-foreground italic uppercase tracking-tighter">{tier} PLAN</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1.5 text-emerald-500 mb-0.5">
                                    <Clock size={14} />
                                    <span className="text-sm font-black italic">{daysRemaining} DAYS</span>
                                </div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Remaining in cycle</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <BarChart size={12} /> Usage Tracking
                                </div>
                                <div className="text-foreground">{quotesProcessed} / {usageLimit} <span className="text-muted-foreground italic ml-1">(Quotes)</span></div>
                            </div>
                            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        usagePercentage > 90 ? "bg-rose-500" : usagePercentage > 75 ? "bg-amber-500" : "bg-primary"
                                    )}
                                    style={{ width: `${Math.min(100, usagePercentage)}%` }}
                                />
                            </div>
                            {usagePercentage > 85 && (
                                <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest animate-pulse">
                                    Warning: You are approaching your usage limit.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboarding Guide */}
            <OnboardingGuide />

            {/* Quadrant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {quadrants.map((q) => (
                    <div key={q.name} className="group bg-card border border-border/50 rounded-[32px] overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-xl shadow-black/5">
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-8">
                                <div className={cn(
                                    "p-4 rounded-2xl transition-transform group-hover:scale-110",
                                    q.color === 'blue' && "bg-blue-500/10 text-blue-500",
                                    q.color === 'amber' && "bg-amber-500/10 text-amber-500",
                                    q.color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                                    q.color === 'purple' && "bg-purple-500/10 text-purple-500",
                                )}>
                                    <q.icon size={28} />
                                </div>
                                <div className="text-right">
                                    {q.hasData ? (
                                        <>
                                            <div className="text-xl font-black text-foreground italic uppercase tracking-tight leading-none mb-1">{q.primaryStat}</div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{q.subStat}</div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">No active data</div>
                                            <Link
                                                href={q.cta!.href}
                                                className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95"
                                            >
                                                <Zap size={10} className="fill-current" />
                                                {q.cta!.label}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-foreground italic uppercase tracking-tighter mb-2">{q.name}</h3>
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed">{q.desc}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {q.links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => handleModuleClick(e, link.href)}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all group/link"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-xl bg-card border border-border/50 text-muted-foreground group-hover/link:text-primary transition-colors relative">
                                                <link.icon size={16} />
                                                {!isPayingCustomer && (
                                                    <div className="absolute -top-1 -right-1 p-0.5 bg-rose-500 rounded-full text-white ring-2 ring-background">
                                                        <Lock size={8} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-bold tracking-tight text-foreground group-hover/link:text-primary transition-colors">{link.name}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-muted-foreground group-hover/link:text-primary group-hover/link:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Utility Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: "My Profile", icon: User, desc: "Personal settings & activity", href: "/settings" },
                    { name: "Documentation", icon: HelpCircle, desc: "API specs and user guides", href: "/docs" },
                    { name: "System Config", icon: Settings, desc: "Enterprise integration tools", href: "/settings/legal" },
                ].map((item) => (
                    <Link key={item.name} href={item.href} className="flex items-center gap-4 p-6 bg-muted/20 border border-border/40 rounded-[24px] hover:bg-muted/40 transition-all group">
                        <div className="p-3 bg-background rounded-xl text-muted-foreground group-hover:text-primary transition-colors border border-border/50">
                            <item.icon size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-black uppercase italic tracking-tight flex items-center gap-1">
                                {item.name} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium">{item.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
