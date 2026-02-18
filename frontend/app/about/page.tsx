"use client"

import { AppLayout } from "@/components/app-layout"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Zap, Shield, Globe, Users, Trophy, Target, ChevronRight, PieChart } from "lucide-react"

export default function AboutPage() {
    return (
        <AppLayout>
            <div className="max-w-[1200px] mx-auto space-y-16 py-12 px-6">
                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        <Zap size={14} className="fill-current" /> Our Mission
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
                        The No-Nonsense Future of <br />
                        <span className="text-primary italic">Global Logistics</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                        LogiMatch AI was born from a simple observation: the freight industry is drowning in manual work,
                        vague pricing, and fragmented data. We're here to fix that with pure, unadulterated intelligence.
                    </p>
                </section>

                {/* Core Philosophy Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="glass-card border-border/40 p-8 space-y-4 hover:border-primary/50 transition-all group">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 w-fit group-hover:scale-110 transition-transform">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Radical Transparency</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            No hidden fees, no "market adjustments" that don't make sense. We provide the hard data so you can make informed decisions instantly.
                        </p>
                    </Card>

                    <Card className="glass-card border-border/40 p-8 space-y-4 hover:border-primary/50 transition-all group">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500 w-fit group-hover:scale-110 transition-transform">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Enterprise OCD</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Our OCR and normalization engine doesn't just "read" PDFs—it audits every line item for absolute accuracy and compliance.
                        </p>
                    </Card>

                    <Card className="glass-card border-border/40 p-8 space-y-4 hover:border-primary/50 transition-all group">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 w-fit group-hover:scale-110 transition-transform">
                            <Trophy size={24} />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Performance First</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            We don't just find the cheapest carrier; we find the one that actually delivers on time. Your ROI is our only benchmark.
                        </p>
                    </Card>
                </div>

                {/* Team / Story Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3 italic">
                                <Users className="text-primary" /> Behind the Code
                            </h2>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                We're a team of logistics veterans and AI researchers tired of the "status quo."
                                We saw billion-dollar companies running their supply chains on brittle Excel sheets and legacy ERPs
                                that belong in the 90s.
                            </p>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                LogiMatch AI is our answer to that stagnation. We're building the operating system for the
                                next generation of trade—one that is automated, predictive, and undeniably efficient.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="space-y-1">
                                <div className="text-2xl font-black text-foreground">50M+</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-primary">Data Points Audited</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-black text-foreground">14.2%</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-primary">Avg. Client Savings</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <Card className="bg-primary/5 border-primary/20 p-8 rounded-[40px] relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10 space-y-6">
                                <Target size={40} className="text-primary mb-4" />
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">Our Vision</h3>
                                <p className="text-sm text-foreground/80 font-bold leading-relaxed">
                                    "To eliminate friction from global commerce by ensuring every shipment is
                                    audited, optimized, and delivered with surgical precision."
                                </p>
                                <div className="pt-4 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 shadow-lg" />
                                    <div>
                                        <div className="text-xs font-black text-foreground uppercase tracking-widest">Founder & CEO</div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Engineering Lead</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-card border border-border/40 rounded-[48px] p-12 text-center space-y-8 glass-card">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Ready to stop guessing?</h2>
                    <p className="text-muted-foreground font-medium max-w-xl mx-auto">
                        Join the hundreds of enterprise logistics teams using LogiMatch AI to reclaim their margins.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                            Deploy Intelligence
                        </button>
                        <button className="px-8 py-4 bg-muted border border-border text-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-muted/80 transition-all">
                            Contact Strategy Team
                        </button>
                    </div>
                </section>
            </div>
            <SiteFooter />
        </AppLayout>
    )
}
