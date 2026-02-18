import Link from "next/link"
import { ArrowRight, Clock, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

const articles = [
    {
        title: "The Future of AI in Ocean Freight Procurement",
        excerpt: "Discover how large language models are eliminating manual data entry in global logistics...",
        date: "Feb 15, 2026",
        tag: "Industry AI",
        image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=800",
        link: "/blog"
    },
    {
        title: "3 KPIs Every Logistics Executive Should Track",
        excerpt: "Moving beyond landed cost: Why transit reliability and carbon impact are the next big metrics...",
        date: "Feb 12, 2026",
        tag: "Executive Strategy",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        link: "/blog"
    },
    {
        title: "Surviving the Next Supply Chain Disruption",
        excerpt: "Proactive risk monitoring is no longer optional. How to build a resilient lane strategy...",
        date: "Feb 10, 2026",
        tag: "Risk Management",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
        link: "/blog"
    }
]

export function BlogPreview() {
    return (
        <section className="py-24 sm:py-32 bg-muted/30">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Thought Leadership</h2>
                    <p className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl italic uppercase">
                        Logistics Intelligence
                    </p>
                    <p className="mt-4 text-lg font-medium text-muted-foreground">
                        Insights from our team on the intersection of AI and Global Trade.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-12">
                        {/* Featured Article */}
                        <article className="lg:col-span-2 flex flex-col items-start justify-between bg-card p-3 rounded-[40px] border border-border/40 hover:border-primary/50 transition-all group overflow-hidden shadow-2xl relative">
                            <div className="w-full aspect-[21/9] bg-muted rounded-[32px] mb-6 flex items-center justify-center overflow-hidden relative">
                                <img src={articles[0].image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 z-10">
                                    <div className="flex items-center gap-x-4 text-xs mb-4">
                                        <span className={cn(
                                            "rounded-full px-3 py-1.5 font-black text-white uppercase tracking-widest shadow-lg",
                                            articles[0].tag === 'Market Update' ? "bg-emerald-500 shadow-emerald-500/20" :
                                                articles[0].tag === 'Executive Strategy' ? "bg-purple-600 shadow-purple-500/20" :
                                                    "bg-primary shadow-primary/20"
                                        )}>
                                            {articles[0].tag}
                                        </span>
                                        <time dateTime="2026-02-15" className="text-white/80 flex items-center gap-1 font-bold">
                                            <Clock size={14} /> {articles[0].date}
                                        </time>
                                    </div>
                                    <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl leading-none">
                                        <Link href={articles[0].link}>
                                            <span className="absolute inset-0" />
                                            {articles[0].title}
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                            <div className="px-8 pb-8">
                                <p className="text-lg font-medium leading-8 text-muted-foreground mb-6">
                                    {articles[0].excerpt}
                                </p>
                                <Link href={articles[0].link} className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Read Featured Insight <ArrowRight size={18} />
                                </Link>
                            </div>
                        </article>

                        {/* Secondary Articles */}
                        <div className="space-y-8">
                            {articles.slice(1).map((a, idx) => (
                                <article key={idx} className="flex flex-col items-start justify-between bg-card/50 p-6 rounded-[32px] border border-border/40 hover:border-primary/40 transition-all group shadow-lg">
                                    <div className="flex items-center gap-x-4 text-[10px] mb-4">
                                        <span className={cn(
                                            "font-black uppercase tracking-widest",
                                            a.tag === 'Market Update' ? "text-emerald-500" :
                                                a.tag === 'Executive Strategy' ? "text-purple-500" :
                                                    "text-primary"
                                        )}>
                                            {a.tag}
                                        </span>
                                        <time dateTime="2026-02-12" className="text-muted-foreground font-bold">
                                            {a.date}
                                        </time>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="text-lg font-black italic tracking-tight text-foreground group-hover:text-primary transition-colors">
                                            <Link href={a.link}>
                                                <span className="absolute inset-0" />
                                                {a.title}
                                            </Link>
                                        </h3>
                                        <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-muted-foreground">
                                            {a.excerpt}
                                        </p>
                                    </div>
                                </article>
                            ))}

                            <div className="p-8 rounded-[32px] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center space-y-4 bg-muted/5 group hover:border-primary/20 transition-all">
                                <Tag className="text-muted-foreground group-hover:text-primary transition-colors" size={24} />
                                <div className="space-y-1">
                                    <p className="text-sm font-black uppercase tracking-tight italic">More Insights Await</p>
                                    <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">Access our full library of freight strategies.</p>
                                </div>
                                <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-blue-500 transition-colors">
                                    Explore Archive
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 text-center">
                    <Link href="/case-studies" className="inline-block px-8 py-4 bg-foreground text-background font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all shadow-xl">
                        View All Case Studies
                    </Link>
                </div>
            </div>
        </section>
    )
}
