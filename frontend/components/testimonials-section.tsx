import { Star, Quote } from "lucide-react"

const testimonials = [
    {
        quote: "LogiMatch AI transformed our procurement cycle. We've seen a 22% reduction in landed costs within the first quarter.",
        author: "Sarah Jenkins",
        role: "VP of Global Logistics",
        company: "NexGen Supply Chain",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
        quote: "The Atlas AI recommendations are shockingly accurate. It's like having a senior logistics analyst working 24/7.",
        author: "Marcus Chen",
        role: "Director of Operations",
        company: "Velocity Freight",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
    },
    {
        quote: "Finally, a platform that handles complex international quote normalization without manual spreadsheets. A game changer.",
        author: "Elena Rodriguez",
        role: "Head of Procurement",
        company: "Global Trade Hub",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
    }
]

export function TestimonialsSection() {
    return (
        <section className="py-24 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Enterprise Reliability</h2>
                    <p className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl italic uppercase">
                        Trusted by Industry Leaders
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="flex flex-col justify-between bg-card p-8 rounded-[32px] border border-border/40 shadow-xl glass-card hover:shadow-primary/5 transition-all group">
                            <div className="flex gap-1 mb-6 text-amber-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <blockquote className="relative">
                                <Quote className="absolute -top-4 -left-4 text-primary/10 w-12 h-12" />
                                <p className="text-lg font-medium leading-8 text-foreground group-hover:text-primary transition-colors italic">
                                    "{t.quote}"
                                </p>
                            </blockquote>
                            <div className="mt-8 flex items-center gap-x-4 border-t border-border/40 pt-6">
                                <img src={t.image} alt="" className="h-12 w-12 rounded-2xl bg-muted object-cover border border-border/50 shadow-md" />
                                <div className="text-sm leading-6">
                                    <p className="font-black text-foreground">{t.author}</p>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.role} @ {t.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
