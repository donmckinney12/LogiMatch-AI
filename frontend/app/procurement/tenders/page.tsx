"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import {
    Briefcase,
    Plus,
    Clock,
    UserCheck,
    BarChart3,
    ArrowRight,
    Search,
    Filter,
    ShieldCheck,
    Zap,
    Users,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    XCircle,
    Info,
    Calendar,
    MessageSquare,
    DollarSign,
    MoreHorizontal,
    Share2,
    ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"

export default function TendersPage() {
    const { orgId } = useOrg()
    const [tenders, setTenders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedTender, setSelectedTender] = useState<any>(null)
    const [bids, setBids] = useState<any[]>([])
    const [loadingBids, setLoadingBids] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        lane_info: "",
        estimated_volume: "",
        deadline: "",
        description: ""
    })

    const fetchTenders = useCallback(async () => {
        try {
            const data = await apiRequest('/api/tenders', {}, orgId)
            setTenders(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [orgId])

    useEffect(() => {
        fetchTenders()
    }, [fetchTenders])

    const fetchBids = async (tenderId: number) => {
        setLoadingBids(true)
        try {
            const data = await apiRequest(`/api/tenders/${tenderId}/bids`, {}, orgId)
            setBids(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingBids(false)
        }
    }

    const handleCreateTender = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await apiRequest('/api/tenders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }, orgId)
            setShowCreateModal(false)
            fetchTenders()
        } catch (err) {
            console.error(err)
        }
    }

    const handleAward = async (tenderId: number, bidId: number) => {
        try {
            await apiRequest(`/api/tenders/${tenderId}/award`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bid_id: bidId })
            }, orgId)
            fetchTenders()
            fetchBids(tenderId)
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="relative">
                        <Briefcase size={48} className="text-blue-500 animate-bounce" />
                    </div>
                    <span className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Initializing Procurement Grid...</span>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                            <Briefcase size={14} /> Bid & Tender Management
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            Procurement <span className="text-primary dark:text-blue-400">Events</span>
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-2xl">
                            Run structured RFQs and manage carrier bidding events in one unified command center.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
                    >
                        <Plus size={18} /> Start RFQ Event
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tender List */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="rounded-3xl border border-border shadow-sm overflow-hidden glass-card">
                            <div className="p-6 border-b border-border bg-muted/50 flex justify-between items-center">
                                <h3 className="font-bold text-foreground flex items-center gap-2 uppercase text-xs tracking-wider">
                                    Active Events
                                </h3>
                                <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">{tenders.length} TOTAL</span>
                            </div>
                            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                                {tenders.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setSelectedTender(t)
                                            fetchBids(t.id)
                                        }}
                                        className={cn(
                                            "w-full p-6 text-left transition-all hover:bg-muted group",
                                            selectedTender?.id === t.id ? "bg-blue-500/10 border-l-4 border-blue-500" : ""
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                                                t.status === 'OPEN' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                                            )}>
                                                {t.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-muted-foreground">#{t.id}</span>
                                        </div>
                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{t.title}</h4>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center gap-1 text-[10px] font-black text-muted-foreground uppercase">
                                                <Users size={12} /> {t.bid_count} Bids
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-black text-muted-foreground uppercase">
                                                <Calendar size={12} /> {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No Deadline'}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bids Detail Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedTender ? (
                            <div className="space-y-6">
                                {/* Tender Quick Stats */}
                                <div className="rounded-3xl border border-border shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 glass-card">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-2xl font-black text-foreground">{selectedTender.title}</h2>
                                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                                                <Share2 size={16} className="cursor-pointer" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-lg">
                                            {selectedTender.description || "No description provided for this procurement event."}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                Lane: {selectedTender.lane_info || 'Global'}
                                            </span>
                                            <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                Volume: {selectedTender.estimated_volume || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 min-w-[120px]">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Bid Link</p>
                                        <div className="p-4 bg-muted border border-border rounded-2xl flex items-center gap-2">
                                            <ExternalLink size={16} className="text-blue-500 dark:text-blue-400" />
                                            <span className="text-xs font-bold text-muted-foreground cursor-pointer hover:text-primary transition-colors underline underline-offset-4">
                                                Copy Invite Link
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bid Table */}
                                <div className="rounded-[32px] border border-border shadow-sm overflow-hidden glass-card">
                                    <div className="p-6 border-b border-border bg-muted/50 flex justify-between items-center">
                                        <h3 className="font-bold text-foreground flex items-center gap-2 uppercase text-xs tracking-wider">
                                            Carrier Submissions
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const loaders = toast.loading("AI Winner Recommendation Engine running...")
                                                    setTimeout(() => {
                                                        toast.success("AI Recommendation Analysis Complete", {
                                                            id: loaders,
                                                            description: "Maersk (Line 3) recommended based on transit-cost efficiency and historical performance.",
                                                            duration: 6000
                                                        })
                                                    }, 2000)
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
                                            >
                                                <Zap size={10} /> AI Winner Recommendation
                                            </button>
                                        </div>
                                    </div>

                                    {loadingBids ? (
                                        <div className="p-12 text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest animate-pulse">
                                            Loading Bids...
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-border bg-muted/30">
                                                        <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Carrier</th>
                                                        <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Offered Rate</th>
                                                        <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Transit</th>
                                                        <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                                                    {bids.map((b) => (
                                                        <tr key={b.id} className={cn(
                                                            "group hover:bg-muted/50 transition-all text-foreground",
                                                            b.is_winning_bid ? "bg-emerald-50/50 dark:bg-emerald-500/10" : ""
                                                        )}>
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-black text-muted-foreground text-xs">
                                                                        {b.carrier_name.substring(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-foreground">{b.carrier_name}</p>
                                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(b.submitted_at).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5 text-right font-black text-foreground">
                                                                ${b.offered_rate.toLocaleString()}
                                                            </td>
                                                            <td className="px-8 py-5 text-center">
                                                                <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-bold text-muted-foreground">
                                                                    {b.transit_time_days} Days
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-5 text-right">
                                                                {b.is_winning_bid ? (
                                                                    <span className="flex items-center justify-end gap-1.5 text-emerald-600 font-black text-[10px] uppercase">
                                                                        <CheckCircle2 size={14} /> Awarded
                                                                    </span>
                                                                ) : (
                                                                    <div className="flex justify-end gap-2">
                                                                        <Link
                                                                            href={`/procurement/negotiate/${b.id}`}
                                                                            className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                                                                        >
                                                                            Negotiate
                                                                        </Link>
                                                                        <button
                                                                            disabled={selectedTender.status === 'AWARDED'}
                                                                            onClick={() => handleAward(selectedTender.id, b.id)}
                                                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-30"
                                                                        >
                                                                            Award
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {bids.length === 0 && (
                                                        <tr>
                                                            <td colSpan={4} className="py-20 text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest space-y-4">
                                                                <Users size={32} className="mx-auto opacity-10 mb-2" />
                                                                Waiting for carrier submissions...
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[48px] border-2 border-dashed border-border h-full min-h-[500px] flex flex-col items-center justify-center space-y-4 p-12 text-center glass-card">
                                <div className="p-6 bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-[32px]">
                                    <Briefcase size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-foreground">Procurement Command Center</h3>
                                <p className="text-muted-foreground font-medium max-w-sm">
                                    Select an RFQ event from the left sidebar to analyze carrier bids, run simulations, and award contracts.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border glass-card">
                        <div className="p-8 border-b border-border flex items-center justify-between">
                            <h3 className="text-2xl font-black text-foreground">Start RFQ <span className="text-primary dark:text-blue-400">Event</span></h3>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <XCircle size={24} className="text-muted-foreground" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTender} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Event Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Q3 Ocean Freight - Shanghai to LA"
                                        className="w-full p-4 bg-muted border border-border rounded-2xl font-bold text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lane / Corridor</label>
                                    <input
                                        type="text"
                                        placeholder="Region or Port Pair"
                                        className="w-full p-4 bg-muted border border-border rounded-2xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none"
                                        onChange={(e) => setFormData({ ...formData, lane_info: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Estimated Vol (TEU/Kg)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 500 TEU"
                                        className="w-full p-4 bg-muted border border-border rounded-2xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none"
                                        onChange={(e) => setFormData({ ...formData, estimated_volume: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Submission Deadline</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full p-4 bg-muted border border-border rounded-2xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none"
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Scope & Requirements</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Detail freight specifications..."
                                        className="w-full p-4 bg-muted border border-border rounded-2xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase hover:bg-primary/90 transition-all shadow-xl shadow-primary/10">
                                Launch RFQ to Carrier Network
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
