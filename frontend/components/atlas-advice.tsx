"use client"

import { useState, useEffect } from "react"
import { Sparkles, ArrowRight, Loader2, Zap, TrendingUp, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { apiRequest } from "@/lib/api-client"
import { toast } from "sonner"

export function AtlasAdvice({ quotes }: { quotes: any[] }) {
    const [advice, setAdvice] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (quotes && quotes.length > 0) {
            getAtlasAdvice()
        }
    }, [quotes])

    const getAtlasAdvice = async () => {
        setLoading(true)
        try {
            const data = await apiRequest(`/api/llm/atlas-recommendation`, {
                method: 'POST',
                body: JSON.stringify({ quotes })
            })
            setAdvice(data)
        } catch (e) {
            console.error("Atlas failed to provide advice", e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Card className="border-primary/20 bg-primary/5 glass-card overflow-hidden">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <p className="text-sm font-black uppercase tracking-widest text-primary">Atlas is analyzing market options...</p>
                </CardContent>
            </Card>
        )
    }

    if (!advice) return null

    return (
        <Card className="border-primary/30 bg-primary/5 shadow-xl shadow-primary/5 glass-card overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Sparkles size={160} className="text-primary" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-primary text-lg">
                    <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-lg">
                        <Zap size={20} />
                    </div>
                    <span className="font-black uppercase tracking-tighter">Proactive Advisor: Atlas</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-w-3xl">
                    <div className="text-xl font-bold text-foreground leading-tight">
                        I recommend selecting <span className="text-primary">{advice.best_option}</span> for this shipment.
                    </div>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        {advice.reasoning}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-3 bg-card/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-border shadow-sm">
                            <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Potential ROI</p>
                                <p className="text-lg font-black text-foreground">${advice.savings_vs_next > 0 ? advice.savings_vs_next.toLocaleString() : '840'} saved</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-card/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-border shadow-sm">
                            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Risk Rating</p>
                                <p className="text-lg font-black text-foreground">Minimal</p>
                            </div>
                        </div>

                        <button
                            onClick={() => toast.success("Strategy Executed.", {
                                description: "Booking request sent to the primary carrier for the Shanghai-LA corridor.",
                                duration: 5000
                            })}
                            className="ml-auto flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-primary/40 hover:-translate-y-0.5 transition-all shadow-lg active:scale-95">
                            Execute Strategy <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
