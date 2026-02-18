"use client"

import { AppLayout } from "@/components/app-layout"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Cpu, Globe, ArrowRight, Calendar, User } from "lucide-react"

const blogPosts = [
    {
        title: "The Death of the Manual Spreadsheet in Logistics",
        excerpt: "Why enterprise shippers are ditching legacy Excel workflows for AI-driven normalization engines.",
        category: "Digital Transformation",
        date: "Feb 12, 2026",
        author: "Sarah Jensen",
        icon: Zap,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        title: "Predicting the Q3 Ocean Freight Rate Spike",
        excerpt: "Analysis of trans-pacific capacity constraints and how to lock in contract rates now.",
        category: "Market Intelligence",
        date: "Feb 08, 2026",
        author: "Mike Chen",
        icon: TrendingUp,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10"
    },
    {
        title: "NLP vs OCR: The Future of Document Processing",
        excerpt: "Deep dive into how LogiMatch uses transformer models to understand complex carrier tariffs.",
        category: "Engineering",
        date: "Feb 01, 2026",
        author: "Alex Rivera",
        icon: Cpu,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10"
    }
]

export default function BlogPage() {
    return (
        <AppLayout>
            <div className="max-w-[1200px] mx-auto space-y-16 py-12 px-6">
                {/* Header */}
                <div className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <Globe size={14} /> LogiMatch Insights
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground italic uppercase">
                        Intelligence for the <br />
                        <span className="text-primary italic">Modern Shipper</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        Expert analysis on global trade, freight procurement, and the AI revolution in supply chain.
                    </p>
                </div>

                {/* Featured Post */}
                <Card className="glass-card border-border/40 overflow-hidden group cursor-pointer hover:border-primary/50 transition-all duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="h-64 lg:h-full bg-muted relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200"
                                alt="Logistics Center"
                                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden lg:block" />
                        </div>
                        <div className="p-8 lg:p-12 space-y-6 flex flex-col justify-center">
                            <Badge variant="outline" className="w-fit text-primary border-primary/20 bg-primary/5 uppercase tracking-widest font-black text-[10px]">Featured Article</Badge>
                            <h2 className="text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors italic uppercase leading-none">
                                2026 State of Logistics: The Shift to Autonomous Procurement
                            </h2>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                As global supply chains decouple, the ability to rapidly pivot carriers and normalize
                                landing costs in milliseconds has become the ultimate competitive advantage.
                            </p>
                            <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground pt-4 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><User size={14} className="text-primary" /> Staff Intelligence</span>
                                <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> Feb 15, 2026</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogPosts.map((post, i) => (
                        <Card key={i} className="glass-card border-border/40 flex flex-col group hover:border-primary/50 transition-all duration-300">
                            <CardHeader className="space-y-4">
                                <div className={`p-3 w-fit rounded-2xl ${post.bgColor} ${post.color}`}>
                                    <post.icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{post.category}</span>
                                    <CardTitle className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                                        {post.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between space-y-6">
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        <Calendar size={12} /> {post.date}
                                    </div>
                                    <button className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group/btn">
                                        Read More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Newsletter */}
                <section className="bg-primary/5 border border-primary/20 rounded-[48px] p-12 text-center space-y-8 glass-card">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic leading-none">Stay Ahead of the Market</h2>
                        <p className="text-muted-foreground font-medium">
                            Join 12,000+ logistics leaders receiving our weekly intelligence briefing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
                            <input
                                type="email"
                                placeholder="work@company.com"
                                className="flex-1 px-6 py-4 bg-background border border-border rounded-2xl placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-primary/20 transition-all">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            <SiteFooter />
        </AppLayout>
    )
}
