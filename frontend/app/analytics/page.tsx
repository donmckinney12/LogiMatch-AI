"use client"

import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import {
    TrendingUp,
    Globe,
    Sword,
    ShieldAlert,
    ArrowRight,
    BarChart3,
    Zap
} from "lucide-react"

const intelligenceModules = [
    {
        name: 'Executive Savings Reports',
        href: '/analytics/executive',
        icon: TrendingUp,
        desc: 'Direct ROI tracking and procurement budget visualization for CFOs and decision makers.',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        name: 'Rate Benchmarking',
        href: '/analytics/market',
        icon: Globe,
        desc: 'Check live market rates against your current contracts to find overspending.',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    },
    {
        name: 'Procurement Strategy',
        href: '/analytics/war-room',
        icon: Sword,
        desc: 'Simulate lane changes and carrier shifts to optimize your bottom line.',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10'
    },
    {
        name: 'Disruption Alerts',
        href: '/risk',
        icon: ShieldAlert,
        desc: 'Instant notifications when lane vulnerabilities or carrier delays threaten your budget.',
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/10'
    }
]

export default function AnalyticsOverviewPage() {
    return (
        <AppLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                    <Link href="/portal" className="hover:text-primary transition-colors flex items-center gap-1">
                        Portal
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">Intelligence Hub</span>
                </div>
                <header className="border-b border-border/40 pb-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground italic uppercase">Strategic Cost Control</h2>
                        <p className="text-muted-foreground font-medium text-lg">Direct access to your procurement ROI and real-time market savings.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {intelligenceModules.map((module) => (
                        <Link
                            key={module.name}
                            href={module.href}
                            className="group p-8 bg-card rounded-[32px] border border-border/40 hover:border-primary/50 transition-all shadow-xl glass-card relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                            <div className="flex items-start gap-6">
                                <div className={`p-4 rounded-2xl ${module.bgColor} ${module.color} group-hover:scale-110 transition-transform`}>
                                    <module.icon size={28} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black uppercase italic tracking-tight mb-2 group-hover:text-primary transition-colors">
                                        {module.name}
                                    </h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed mb-6">
                                        {module.desc}
                                    </p>
                                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group-hover:gap-3 transition-all">
                                        Launch Intelligence Module <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Global Stats Mini-Preview */}
                <div className="p-12 bg-primary rounded-[40px] shadow-2xl shadow-primary/20 relative overflow-hidden group border border-white/10">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
                                Synthesizing Global Insights <br />
                                In Real-Time.
                            </h2>
                            <p className="text-primary-foreground/80 font-medium">
                                LogiMatch AI processes millions of data points across global trade lanes to provide you with a competitive advantage in every ocean and air tender.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md">
                                <p className="text-3xl font-black text-white">2.4k+</p>
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Global Lanes</p>
                            </div>
                            <div className="text-center p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md">
                                <p className="text-3xl font-black text-white">98%</p>
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Model Accuracy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
