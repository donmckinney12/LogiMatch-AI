"use client"

import * as React from "react"
import Link from "next/link"
import {
    CheckCircle2,
    Circle,
    Rocket,
    ChevronRight,
    Users,
    Unplug,
    Gavel,
    TrendingUp,
    ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
    {
        id: "profile",
        title: "Complete Org Profile",
        desc: "Set up company details and preferences",
        href: "/settings",
        icon: Users,
        isCompleted: true
    },
    {
        id: "integration",
        title: "Connect First Carrier",
        desc: "Integrate ERP or TMS for data sync",
        href: "/tracking",
        icon: Unplug,
        isCompleted: false
    },
    {
        id: "tender",
        title: "Launch First Tender",
        desc: "Start a spot bid or contract event",
        href: "/procurement/tenders",
        icon: Gavel,
        isCompleted: false
    },
    {
        id: "intel",
        title: "Review Market Trends",
        desc: "Analyze latest route volatility",
        href: "/analytics",
        icon: TrendingUp,
        isCompleted: false
    }
]

export function OnboardingGuide() {
    const completedCount = steps.filter(s => s.isCompleted).length
    const progressPercentage = (completedCount / steps.length) * 100

    return (
        <div className="relative group overflow-hidden bg-card border border-border/50 rounded-[32px] p-6 shadow-2xl shadow-black/5 glass-card mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                {/* Progress Circle Side */}
                <div className="flex-shrink-0 flex flex-col items-center text-center">
                    <div className="relative h-24 w-24 mb-4">
                        <svg className="h-full w-full -rotate-90 transform">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-muted-foreground/10"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 40}
                                strokeDashoffset={2 * Math.PI * 40 * (1 - progressPercentage / 100)}
                                className="text-primary transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black italic tracking-tighter text-foreground leading-none">{Math.round(progressPercentage)}%</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Complete</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 justify-center text-primary mb-1">
                            <Rocket size={14} className="fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Quick Start Guide</span>
                        </div>
                        <h3 className="text-sm font-black italic uppercase tracking-tighter text-foreground">Launch Your Hub</h3>
                    </div>
                </div>

                {/* Vertical Divider for Desktop */}
                <div className="hidden lg:block w-[1px] h-32 bg-border/40" />

                {/* Steps Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {steps.map((step) => (
                        <Link
                            key={step.id}
                            href={step.href}
                            className={cn(
                                "group/step relative p-4 rounded-[24px] border transition-all duration-300",
                                step.isCompleted
                                    ? "bg-emerald-500/5 border-emerald-500/20 opacity-60"
                                    : "bg-muted/20 border-border/40 hover:border-primary/40 hover:bg-muted/40"
                            )}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={cn(
                                    "p-2 rounded-xl border transition-colors",
                                    step.isCompleted ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-card border-border/50 text-muted-foreground group-hover/step:text-primary group-hover/step:border-primary/30"
                                )}>
                                    <step.icon size={16} />
                                </div>
                                {step.isCompleted ? (
                                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-500/20" />
                                ) : (
                                    <Circle size={16} className="text-muted-foreground/30 group-hover/step:text-primary/30" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <div className={cn(
                                    "text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
                                    step.isCompleted ? "text-emerald-600/80" : "text-foreground group-hover/step:text-primary"
                                )}>
                                    {step.title}
                                    {!step.isCompleted && <ChevronRight size={10} className="opacity-0 group-hover/step:opacity-100 group-hover/step:translate-x-0.5 transition-all" />}
                                </div>
                                <p className="text-[9px] font-medium text-muted-foreground leading-tight">{step.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Completion Banner (Only when all done) */}
            {progressPercentage === 100 && (
                <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-500 rounded-full text-white">
                            <ShieldCheck size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">All Systems Optimized — Ready for Full Operation</span>
                    </div>
                </div>
            )}
        </div>
    )
}
