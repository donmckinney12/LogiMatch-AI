"use client"

import Link from "next/link"
import { Zap, Mail, Twitter, Instagram, ArrowUp } from "lucide-react"

export function SiteFooter() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-[1800px] px-6 py-12 lg:px-8 lg:py-16">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20">
                                <Zap size={18} className="text-primary-foreground fill-current" />
                            </div>
                            <span className="font-heading text-lg font-black tracking-tight text-foreground uppercase italic leading-none">LogiMatch AI</span>
                        </Link>
                        <p className="text-sm leading-6 text-muted-foreground max-w-xs">
                            Revolutionizing global freight procurement with enterprise-grade AI normalization and real-time ROI tracking.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="https://x.com/Logimatch_AI" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter size={20} />
                            </Link>
                            <Link href="https://www.instagram.com/logimatch_ai/" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </Link>
                            <Link href="mailto:mckinneydonald321@logimatch.online" className="text-muted-foreground hover:text-primary transition-colors">
                                <Mail size={20} />
                            </Link>
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Solutions</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <Link href="/quotes" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Quote Matrix</Link>
                                    </li>
                                    <li>
                                        <Link href="/analytics/executive" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Executive Insights</Link>
                                    </li>
                                    <li>
                                        <Link href="/risk" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Risk Monitor</Link>
                                    </li>
                                    <li>
                                        <Link href="/compliance" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Compliance Hub</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Resources</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <Link href="/blog" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                                    </li>
                                    <li>
                                        <Link href="/docs" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
                                    </li>
                                    <li>
                                        <Link href="/case-studies" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Case Studies</Link>
                                    </li>
                                    <li>
                                        <Link href="/api-reference" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">API Reference</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <Link href="/" className="text-sm font-bold text-foreground hover:text-primary transition-colors tracking-tight">Home</Link>
                                    </li>
                                    <li>
                                        <Link href="/about" className="text-sm font-bold text-foreground hover:text-primary transition-colors tracking-tight">About LogiMatch AI</Link>
                                    </li>
                                    <li>
                                        <Link href="/contact" className="text-sm font-bold text-foreground hover:text-primary transition-colors tracking-tight">Contact Sales & Support</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <Link href="/settings/legal" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link href="/settings/legal" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                                    </li>
                                    <li>
                                        <Link href="/settings/legal" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-border/40 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row justify-between items-center gap-4 relative">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        &copy; 2026 LogiMatch AI. All rights reserved. Built for the future of global logistics.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Systems Operational</span>
                        </div>
                        <button
                            onClick={scrollToTop}
                            className="p-3 bg-muted hover:bg-muted/80 rounded-xl text-muted-foreground hover:text-primary transition-all group active:scale-90"
                            title="Back to Top"
                        >
                            <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}
