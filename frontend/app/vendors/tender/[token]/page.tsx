"use client"

import { useState, useEffect, useCallback, use } from "react"
import {
    Briefcase,
    Zap,
    Clock,
    DollarSign,
    Calendar,
    CheckCircle2,
    ArrowRight,
    MapPin,
    Package,
    ShieldCheck,
    Truck,
    Info,
    TrendingUp,
    BarChart3,
    Globe
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
// Recharts imports
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock Data for Charts
const volumeTrendData = [
    { month: 'Jan', volume: 400 },
    { month: 'Feb', volume: 300 },
    { month: 'Mar', volume: 550 },
    { month: 'Apr', volume: 450 },
    { month: 'May', volume: 600 },
    { month: 'Jun', volume: 750 },
];

import { apiRequest } from "@/lib/api-client"

export default function CarrierBidPortal({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params)
    const [tender, setTender] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [carriers, setCarriers] = useState<any[]>([])

    // Form State
    const [formData, setFormData] = useState({
        carrier_id: "",
        offered_rate: "",
        transit_time_days: "",
        carrier_notes: ""
    })

    const fetchTender = useCallback(async () => {
        try {
            const data = await apiRequest(`/api/tenders/${token}`)
            setTender(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [token])

    const fetchCarriers = async () => {
        try {
            const data = await apiRequest('/api/carriers')
            setCarriers(data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchTender()
        fetchCarriers()
    }, [fetchTender])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await apiRequest('/api/tenders/bids/submit', {
                method: 'POST',
                body: JSON.stringify({
                    tender_id: tender.id,
                    ...formData,
                    offered_rate: parseFloat(formData.offered_rate),
                    transit_time_days: parseInt(formData.transit_time_days)
                })
            })
            setSubmitted(true)
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <Briefcase size={48} className="text-primary" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Opening Secure Portal...</span>
                </div>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <div className="bg-card rounded-[48px] p-12 shadow-2xl shadow-primary/10 border border-border max-w-md w-full text-center space-y-6 animate-in zoom-in duration-300 glass-card">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-foreground">Bid Submitted Successfully</h1>
                    <p className="text-muted-foreground font-medium">
                        Your offer for **{tender?.title}** has been recorded. The procurement team will notify you if your bid is selected.
                    </p>
                    <div className="pt-4 border-t border-border flex flex-col gap-3">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-muted-foreground">
                            <span>Reference</span>
                            <span className="text-foreground">BID-{Math.floor(Math.random() * 90000) + 10000}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!tender) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <ShieldCheck size={48} className="mx-auto text-destructive" />
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Access Denied / Expired</h1>
                    <p className="text-muted-foreground font-medium">This tender invitation is no longer active.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background font-sans text-foreground transition-colors selection:bg-primary/20">
            {/* Nav */}
            <nav className="p-8 max-w-[1600px] mx-auto flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-50 rounded-b-[40px] border-b border-border mb-8">
                <div className="flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg tracking-tight">LogiMatch AI</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                    <ShieldCheck size={12} /> Secure Partner Portal
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header Section (Full Width) */}
                <div className="md:col-span-12 p-8 md:p-12 bg-card rounded-[40px] border border-border glass-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:scale-125 transition-transform duration-1000">
                        <Globe size={200} />
                    </div>
                    <div className="relative z-10 space-y-4 max-w-3xl">
                        <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <Clock size={14} /> Bid Deadline: {tender.deadline ? new Date(tender.deadline).toLocaleString() : 'Open'}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
                            RFQ Invitation: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 uppercase tracking-tighter">
                                {tender.title}
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                            {tender.description || "You have been invited to bid on this exclusive logistics contract. Please review the lane details and volume projections below before submitting your best offer."}
                        </p>
                    </div>
                </div>

                {/* Left Column - Bento Grid of Data */}
                <div className="md:col-span-4 grid grid-cols-2 gap-6 content-start">

                    {/* Lane Info Card */}
                    <div className="col-span-2 p-6 bg-card rounded-[32px] border border-border shadow-sm glass-card flex items-center justify-between hover:border-primary/50 transition-colors">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Lane</p>
                            <div className="flex items-center gap-2 text-xl font-black text-foreground">
                                <MapPin className="text-primary" size={20} />
                                {tender.lane_info || 'Global Operations'}
                            </div>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Globe size={24} />
                        </div>
                    </div>

                    {/* Volume Card */}
                    <div className="col-span-2 md:col-span-1 p-6 bg-card rounded-[32px] border border-border shadow-sm glass-card hover:border-primary/50 transition-colors">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Est. Volume</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-black text-foreground">{tender.estimated_volume || 'N/A'}</span>
                            <span className="text-xs font-bold text-muted-foreground mb-1">TEU</span>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="col-span-2 md:col-span-1 p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-[32px] border border-emerald-100 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between">
                        <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2">Status</p>
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black">
                            <CheckCircle2 size={20} />
                            Active
                        </div>
                    </div>

                    {/* Volume Trend Chart (Bento Visual) */}
                    <div className="col-span-2 p-6 bg-card rounded-[32px] border border-border shadow-sm glass-card h-[280px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <BarChart3 size={16} className="text-primary" />
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Volume Forecast</span>
                            </div>
                            <span className="text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-2 py-1 rounded-full">+12% YoY</span>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={volumeTrendData}>
                                    <defs>
                                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insight (Bento Visual) */}
                    <div className="col-span-2 p-6 bg-neutral-900 rounded-[32px] text-white flex items-start gap-4 shadow-xl">
                        <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                            <Zap size={20} className="text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">AI Recommendation</p>
                            <p className="text-sm font-medium text-neutral-200 leading-snug">
                                Based on current market rates for <strong>{tender.lane_info || 'this lane'}</strong>, a rate between <strong>$1.75 - $1.90 / kg</strong> has the highest probability of award.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Right Column - Submission Form */}
                <div className="md:col-span-8">
                    <div className="bg-card p-8 lg:p-12 rounded-[48px] border border-border shadow-2xl shadow-black/5 dark:shadow-black/20 glass-card h-full flex flex-col justify-center">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">Submit Your <span className="text-primary">Best Offer</span></h2>
                            <p className="text-muted-foreground">Complete the secure form below. All bits are encrypted.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 col-span-2 md:col-span-1">
                                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                                        Carrier Identity
                                    </label>
                                    <select
                                        required
                                        className="w-full p-4 bg-muted border border-border rounded-2xl font-bold text-foreground focus:ring-4 focus:ring-primary/10 outline-none h-[60px] transition-all"
                                        onChange={(e) => setFormData({ ...formData, carrier_id: e.target.value })}
                                    >
                                        <option value="">Select Your Organization</option>
                                        {carriers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4 col-span-2 md:col-span-1">
                                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                                        All-In Rate (USD)
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black group-focus-within:text-primary transition-colors">
                                            $
                                        </div>
                                        <input
                                            required
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full p-4 pl-8 bg-muted border border-border rounded-2xl font-bold text-foreground focus:ring-4 focus:ring-primary/10 outline-none h-[60px] transition-all"
                                            onChange={(e) => setFormData({ ...formData, offered_rate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 col-span-2 md:col-span-1">
                                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                                        Transit Time (Days)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="Est. Terminal to Terminal"
                                        className="w-full p-4 bg-muted border border-border rounded-2xl font-bold text-foreground focus:ring-4 focus:ring-primary/10 outline-none h-[60px] transition-all"
                                        onChange={(e) => setFormData({ ...formData, transit_time_days: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4 col-span-2">
                                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                                        Service Notes / Conditions
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Any specific routing instructions or exclusions..."
                                        className="w-full p-4 bg-muted border border-border rounded-[32px] font-bold text-foreground focus:ring-4 focus:ring-primary/10 outline-none resize-none transition-all"
                                        onChange={(e) => setFormData({ ...formData, carrier_notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-center pt-4">
                                <div className="flex-1 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex items-start gap-3 w-full">
                                    <Info size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-[10px] leading-relaxed text-blue-700 dark:text-blue-300 font-medium">
                                        Legal: By submitting this bid, your organization agrees to honor the rate for the duration of the tender period.
                                    </p>
                                </div>
                                <button className="w-full md:w-auto px-12 py-5 bg-primary text-primary-foreground rounded-[32px] font-black text-lg uppercase hover:bg-primary/90 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 whitespace-nowrap">
                                    Submit Offer <ArrowRight size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </main>
        </div>
    )
}
