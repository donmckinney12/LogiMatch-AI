"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ChevronRight,
    LayoutDashboard,
    TrendingUp,
    Zap,
    Scale,
    Command,
    ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

const hubs = [
    {
        name: "Procurement Center",
        href: "/dashboard",
        routes: ["/dashboard", "/procurement", "/quotes"],
        icon: LayoutDashboard,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        description: "Tenders & Savings"
    },
    {
        name: "Intelligence Suite",
        href: "/analytics",
        routes: ["/analytics"],
        icon: TrendingUp,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        description: "Market Dynamics"
    },
    {
        name: "Operations Hub",
        href: "/tracking",
        routes: ["/tracking", "/inventory", "/logistics"],
        icon: Zap,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        description: "Global Tracking"
    },
    {
        name: "Compliance & Governance",
        href: "/compliance",
        routes: ["/compliance", "/settings/legal"],
        icon: Scale,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        description: "Trade & Legal"
    }
]

export function QuickSwitcher() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState(false)

    // Only show if we are in one of the defined hub routes
    const isModulePage = hubs.some(hub => hub.routes.some(route => pathname.startsWith(route)))

    if (!isModulePage) return null

    const currentHub = hubs.find(hub => hub.routes.some(route => pathname.startsWith(route))) || hubs[0]

    return (
        <div className="relative z-40 mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-4">
                {/* Back to Portal CTA */}
                <Link
                    href="/portal"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/40 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all group"
                >
                    <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                    Portal
                </Link>

                <div className="h-4 w-[1px] bg-border/40" />

                {/* Breadcrumb / Hub Switcher */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-card/40 backdrop-blur-md border border-border/50 shadow-sm hover:border-primary/40 transition-all group"
                    >
                        <div className={cn("p-1.5 rounded-lg", currentHub.bg, currentHub.color)}>
                            <currentHub.icon size={16} />
                        </div>
                        <div className="flex flex-col items-start translate-y-[1px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Active Hub</span>
                            <span className="text-sm font-black italic uppercase tracking-tighter text-foreground flex items-center gap-1">
                                {currentHub.name}
                                <ChevronRight size={14} className={cn("text-muted-foreground transition-transform duration-300", isOpen && "rotate-90")} />
                            </span>
                        </div>
                    </button>

                    {isOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                            <div className="absolute top-full left-0 mt-2 w-72 p-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-[24px] shadow-2xl z-20 animate-in zoom-in-95 fade-in duration-200">
                                <div className="p-3 mb-1">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                        <Command size={12} /> Direct Module Access
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                    {hubs.map((hub) => (
                                        <Link
                                            key={hub.name}
                                            href={hub.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 p-3 rounded-xl transition-all group/item",
                                                pathname.startsWith(hub.href) ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50 border border-transparent"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-2 rounded-lg transition-transform group-hover/item:scale-110",
                                                hub.bg,
                                                hub.color
                                            )}>
                                                <hub.icon size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-sm font-black uppercase italic tracking-tighter transition-colors",
                                                    pathname.startsWith(hub.href) ? "text-primary" : "text-foreground group-hover/item:text-primary"
                                                )}>
                                                    {hub.name}
                                                </span>
                                                <span className="text-[10px] font-medium text-muted-foreground">{hub.description}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
