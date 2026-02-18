"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import {
    Search,
    Book,
    MessageCircle,
    Video,
    FileText,
    ChevronRight,
    ArrowUpRight,
    HelpCircle,
    Zap,
    Cpu,
    Shield,
    Blocks
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const popularArticles = [
        { title: "Technical Quick Start", description: "Deploy LogiMatch into your stack in 15 minutes.", icon: Zap, route: "/docs/quick-start" },
        { title: "Introduction to AI Ingestion", description: "Learn how the neural core processes OCR data.", icon: Blocks, route: "#" },
        { title: "Configuring SAP Connectors", description: "Step-by-step guide for ERP integration.", icon: Cpu, route: "#" },
        { title: "Audit Trail Compliance", description: "How to export records for SOC 2 audits.", icon: Shield, route: "#" }
    ]

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-indigo-950 to-blue-900 rounded-[64px] p-16 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]" />

                    <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-xl">
                            <HelpCircle size={16} className="text-blue-400" /> Professional Support Hub
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter leading-tight italic">
                            How can we <span className="text-blue-400">empower</span> your operations today?
                        </h1>

                        <div className="relative max-w-2xl mx-auto pt-4">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
                            <Input
                                placeholder="Search documentation, guides, and SDKs..."
                                className="h-20 pl-16 pr-8 bg-white/10 border-white/20 rounded-[32px] text-xl font-medium placeholder:text-white/30 backdrop-blur-xl shadow-2xl focus:bg-white/15 focus:ring-4 focus:ring-blue-500/20 transition-all text-white border-2"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-blue-200/60 pt-4">
                            <span>Popular:</span>
                            <button className="hover:text-white transition-colors">API Keys</button>
                            <span>•</span>
                            <button className="hover:text-white transition-colors">Maersk Ingestion</button>
                            <span>•</span>
                            <button className="hover:text-white transition-colors">SSO Setup</button>
                        </div>
                    </div>
                </div>

                {/* Resource Categories */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div
                        onClick={() => router.push("/docs/quick-start")}
                        className="group bg-primary border border-primary/20 p-8 rounded-[40px] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all duration-500 cursor-pointer flex flex-col justify-between h-[320px] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                            <Zap size={28} className="fill-current" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-2xl font-black text-white italic">Quick Start</h3>
                            <p className="text-white/70 text-sm font-medium">Integration guide for AI/ML engineers & logistics leads.</p>
                        </div>
                        <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px]">
                            Get Started <ChevronRight size={14} />
                        </div>
                    </div>

                    <div className="group bg-card border border-border p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500 glass-card flex flex-col justify-between h-[320px]">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                            <Book size={28} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Full Docs</h3>
                            <p className="text-muted-foreground text-xs font-medium">Deep dives into features and API specs.</p>
                        </div>
                        <Button variant="link" className="p-0 text-primary font-black gap-2 h-auto text-[10px] uppercase tracking-widest underline-offset-4">
                            Browse Docs <ChevronRight size={14} />
                        </Button>
                    </div>

                    <div className="group bg-card border border-border p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500 glass-card flex flex-col justify-between h-[320px]">
                        <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                            <Video size={28} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Tutorials</h3>
                            <p className="text-muted-foreground text-xs font-medium">Step-by-step masterclasses.</p>
                        </div>
                        <Button variant="link" className="p-0 text-blue-500 font-black gap-2 h-auto text-[10px] uppercase tracking-widest underline-offset-4">
                            Watch Now <ChevronRight size={14} />
                        </Button>
                    </div>

                    <div className="group bg-card border border-border p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500 glass-card flex flex-col justify-between h-[320px]">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                            <MessageCircle size={28} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Community</h3>
                            <p className="text-muted-foreground text-xs font-medium">Join 5k experts in Discord.</p>
                        </div>
                        <Button variant="link" className="p-0 text-emerald-500 font-black gap-2 h-auto text-[10px] uppercase tracking-widest underline-offset-4">
                            Join Discord <ArrowUpRight size={14} />
                        </Button>
                    </div>
                </div>

                {/* Popular Articles List */}
                <div className="space-y-10">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                        <span className="w-12 h-1 bg-primary rounded-full" />
                        Trending Resources
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {popularArticles.map((article, i) => (
                            <button
                                key={i}
                                onClick={() => article.route !== "#" && router.push(article.route)}
                                className="flex items-center gap-6 p-8 bg-card border border-border rounded-[32px] hover:border-primary/50 text-left transition-all duration-300 group shadow-sm hover:shadow-xl glass-card"
                            >
                                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 shrink-0 border border-border">
                                    <article.icon size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">{article.title}</h4>
                                    <p className="text-sm text-muted-foreground font-medium">{article.description}</p>
                                </div>
                                <ChevronRight className="ml-auto text-muted-foreground/30 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-2" size={24} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Support CTA */}
                <div className="bg-muted/30 border border-border/50 rounded-[48px] p-16 flex flex-col md:flex-row items-center justify-between gap-10 mt-12 glass-card">
                    <div className="space-y-4 max-w-xl">
                        <h2 className="text-4xl font-black tracking-tight">Still need assistance?</h2>
                        <p className="text-muted-foreground text-xl font-medium">
                            Our enterprise engineering team is available 24/7 for dedicated mission support.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="h-16 px-10 rounded-2xl font-black text-lg border-2 border-primary/20 hover:border-primary">
                            Live Chat
                        </Button>
                        <Button className="h-16 px-10 rounded-2xl font-black text-lg bg-primary shadow-2xl shadow-primary/20">
                            Submit Ticket
                        </Button>
                    </div>
                </div>

            </div>
        </AppLayout>
    )
}
