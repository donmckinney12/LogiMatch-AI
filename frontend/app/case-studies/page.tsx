"use client"

import { AppLayout } from "@/components/app-layout"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, ShieldCheck, Zap, Globe, ArrowRight, Quote, CheckCircle2 } from "lucide-react"

const caseStudies = [
    {
        company: "GlobalRetail Corp",
        logo: "GR",
        title: "Scaling Trans-Pacific Procurement for a Fortune 500 Retailer",
        metrics: [
            { label: "Direct Savings", value: "$4.2M/yr", icon: Zap },
            { label: "Audit Accuracy", value: "99.9%", icon: ShieldCheck },
            { label: "Process Speed", value: "10x Faster", icon: BarChart3 }
        ],
        description: "How GlobalRetail Corp used LogiMatch AI to automate invoice reconciliation across 40+ carriers and 2,000 monthly shipments.",
        challenge: "Manual auditing was missing 12% of fuel surcharge overcharges, costing millions in leakages.",
        solution: "Implemented LogiMatch Auto-Ingest to normalize data and flag discrepancies in real-time.",
        color: "blue"
    },
    {
        company: "Nexus Logistics",
        logo: "NX",
        title: "Eliminating Hidden Fees in European LTL Networks",
        metrics: [
            { label: "Margin Increase", value: "+8.5%", icon: Zap },
            { label: "Lanes Optimized", value: "450+", icon: Globe },
            { label: "Carrier Compliance", value: "94%", icon: CheckCircle2 }
        ],
        description: "Nexus Logistics leveraged LogiMatch AI to gain visibility into pallet-level pricing variances across its fragmented European partner base.",
        challenge: "Carrier tariffs were inconsistent, making it impossible to predict exact landed costs.",
        solution: "Used LogiMatch Benchmarking to cross-reference partner rates with live market indices.",
        color: "emerald"
    }
]

export default function CaseStudiesPage() {
    return (
        <AppLayout>
            <div className="max-w-[1200px] mx-auto space-y-16 py-12 px-6">
                {/* Header */}
                <div className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <Quote size={14} /> Customer Success
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground italic uppercase">
                        Real Impact. <br />
                        <span className="text-primary italic">Measurable ROI.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        Discover how the world's leading brands use LogiMatch AI to reclaim lost spend and dominate their supply chains.
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-12">
                    {caseStudies.map((study, i) => (
                        <Card key={i} className="glass-card border-border/40 overflow-hidden group">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="p-8 lg:p-12 space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black`}>
                                            {study.logo}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Success Story</p>
                                            <h3 className="text-xl font-black text-foreground">{study.company}</h3>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-black tracking-tight text-foreground italic uppercase leading-tight">
                                        {study.title}
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {study.metrics.map((metric, j) => (
                                            <div key={j} className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                                <div className="flex items-center justify-between text-primary group-hover:text-primary-foreground">
                                                    <metric.icon size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{metric.label}</span>
                                                </div>
                                                <p className="text-xl font-black tracking-tight">{metric.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border/40">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60">The Challenge</p>
                                            <p className="text-sm font-medium text-muted-foreground">{study.challenge}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">The Result</p>
                                            <p className="text-sm font-medium text-muted-foreground">{study.solution}</p>
                                        </div>
                                    </div>

                                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-primary hover:shadow-xl hover:shadow-primary/20 flex gap-2">
                                        View Full Report <ArrowRight size={18} />
                                    </Button>
                                </div>

                                <div className="bg-muted min-h-[400px] relative overflow-hidden hidden lg:block border-l border-border/40">
                                    <img
                                        src={i % 2 === 0
                                            ? "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200"
                                            : "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1200"
                                        }
                                        alt="Case Study Visual"
                                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background" />
                                    <div className="absolute bottom-12 left-12 right-12 p-8 bg-background/80 backdrop-blur-xl border border-border/50 rounded-[32px] shadow-2xl space-y-4">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                                            <Quote size={20} fill="currentColor" />
                                        </div>
                                        <p className="text-lg font-bold italic tracking-tight text-foreground leading-tight">
                                            "LogiMatch AI didn't just find overcharges; it fundamentally changed how we negotiate with our global carrier network."
                                        </p>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">VP of Global Logistics, {study.company}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="bg-gradient-to-br from-indigo-950 to-blue-900 rounded-[56px] p-16 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent)] opacity-50" />
                    <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">Your bottom line <br /> deserves an <span className="text-blue-400">audit</span>.</h2>
                        <p className="text-blue-200/80 font-medium text-lg">
                            Stop leaving money on the table. Join the enterprise platform built for high-stakes logistics operations.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button className="h-16 px-10 rounded-2xl bg-primary font-black uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-transform">Get Started Free</Button>
                            <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/20 bg-white/10 font-black uppercase tracking-widest text-white backdrop-blur-xl hover:bg-white/20 transition-all">Request Demo</Button>
                        </div>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </AppLayout>
    )
}
