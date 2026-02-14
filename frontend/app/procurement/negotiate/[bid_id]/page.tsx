"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import {
    Send,
    ChevronLeft,
    DollarSign,
    Bot,
    User,
    CheckCircle2,
    XCircle,
    ArrowDownRight,
    TrendingDown,
    ShieldCheck,
    Loader2,
    BarChart3,
    Zap,
    Scale
} from "lucide-react"
import { cn } from "@/lib/utils"
// Recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export default function NegotiationPage() {
    const { bid_id } = useParams()
    const router = useRouter()
    const { orgId } = useOrg()
    const [messages, setMessages] = useState<any[]>([])
    const [bidInfo, setBidInfo] = useState<any>(null)
    const [offerAmount, setOfferAmount] = useState("")
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Mock Comparison Data
    const comparisonData = [
        { name: 'Market Avg', rate: 2.15 },
        { name: 'Target', rate: 1.85 },
        { name: 'Current Bid', rate: 1.95 },
    ];

    const fetchHistory = useCallback(async () => {
        try {
            const data = await apiRequest(`/api/negotiate/${bid_id}/history`, {}, orgId)
            setMessages(data)
        } catch (err) {
            console.error(err)
        }
    }, [bid_id, orgId])

    useEffect(() => {
        fetchHistory()
    }, [fetchHistory])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendCounter = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!offerAmount || loading) return

        setLoading(true)
        try {
            await apiRequest('/api/negotiate/counter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bid_id: parseInt(bid_id as string), amount: parseFloat(offerAmount) })
            }, orgId)
            setOfferAmount("")
            fetchHistory()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] flex flex-col gap-6 animate-in fade-in duration-500">
                {/* Header */}
                <header className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-muted rounded-xl transition-all text-foreground"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                <DollarSign size={14} /> Price Discovery
                            </div>
                            <h1 className="text-2xl font-black text-foreground">
                                Negotiating Bid <span className="text-primary">#{bid_id}</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Session Active
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

                    {/* LEFT COL: Deal Intelligence Visuals (Bento) */}
                    <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2">
                        {/* Comparison Chart */}
                        <div className="p-6 bg-card rounded-[32px] border border-border shadow-sm glass-card h-[320px] flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <Scale size={18} className="text-primary" />
                                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Rate Comparison</h3>
                            </div>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={comparisonData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'var(--muted)/20' }}
                                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                                            itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={24}>
                                            {comparisonData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 1 ? '#3b82f6' : index === 2 ? '#10b981' : '#94a3b8'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <span>Target: $1.85</span>
                                <span>Current: $1.95</span>
                            </div>
                        </div>

                        {/* AI Insight */}
                        <div className="p-6 bg-neutral-900 rounded-[32px] text-white shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Bot size={18} className="text-yellow-400" />
                                </div>
                                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Negotiation Coach</h3>
                            </div>
                            <p className="text-sm font-medium text-neutral-200 leading-relaxed mb-4">
                                The carrier is currently <strong>$0.10 above target</strong>. Market data suggests they have 15% margin flexibility on this lane due to backhaul needs.
                            </p>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Recommended Counter</span>
                                <span className="text-xl font-black text-white">$1.88 / kg</span>
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 dark:bg-blue-500/10 rounded-[32px] border border-blue-100 dark:border-blue-500/20">
                            <h3 className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-widest mb-2">Win Probability</h3>
                            <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-3 mb-2 overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full w-[72%]" />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                <span>High Chance</span>
                                <span>72%</span>
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE/RIGHT COL: Chat Container (Spans 2) */}
                    <div className="lg:col-span-2 bg-card rounded-[40px] border border-border shadow-sm overflow-hidden flex flex-col glass-card h-full">
                        {/* Message Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                                    <div className="p-6 bg-primary/10 text-primary rounded-[32px] animate-bounce">
                                        <Bot size={48} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-foreground">Agent Ready</h3>
                                        <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                                            The carrier agent is online. Submit a counter-offer to begin negotiations.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
                                        msg.author.includes("Customer") ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                        msg.author.includes("Customer")
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-blue-600 text-white"
                                    )}>
                                        {msg.author.includes("Customer") ? <User size={20} /> : <Bot size={20} />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[70%] space-y-1",
                                        msg.author.includes("Customer") ? "items-end" : "items-start"
                                    )}>
                                        <div className={cn(
                                            "px-6 py-4 rounded-[28px] text-sm font-medium shadow-sm transition-all",
                                            msg.author.includes("Customer")
                                                ? "bg-muted text-foreground rounded-tr-none"
                                                : "bg-blue-50 dark:bg-blue-500/10 text-blue-900 dark:text-blue-100 rounded-tl-none border border-blue-100/50 dark:border-blue-500/20"
                                        )}>
                                            {msg.content}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 mt-1">
                                            {msg.author} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-muted/20 border-t border-border mt-auto">
                            <form onSubmit={handleSendCounter} className="flex gap-4 items-end">
                                <div className="flex-1 relative">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4 mb-2 block">
                                        Your Counter-Offer ($)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                        <input
                                            type="number"
                                            value={offerAmount}
                                            onChange={(e) => setOfferAmount(e.target.value)}
                                            placeholder="Enter target rate..."
                                            className="w-full pl-14 pr-6 py-5 bg-background border border-border rounded-[28px] font-black text-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm text-foreground placeholder:text-muted-foreground"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !offerAmount}
                                    className="h-[68px] px-8 bg-primary text-primary-foreground rounded-[28px] font-black flex items-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95 mb-[-2px]"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                    <span className="hidden md:inline">Submit Counter</span>
                                </button>
                            </form>
                            <div className="mt-4 flex items-center justify-center gap-6 opacity-60">
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <ShieldCheck size={12} className="text-green-500" /> Encrypted
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <CheckCircle2 size={12} className="text-blue-500" /> Verified
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
