"use client"

import { useState, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import {
    ShieldAlert,
    Upload,
    Camera,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Search,
    Filter,
    FileText,
    ExternalLink,
    Loader2,
    DollarSign,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ClaimsDashboard() {
    const { orgId } = useOrg()
    const [analyzing, setAnalyzing] = useState(false)
    const [damageDescription, setDamageDescription] = useState("")
    const [assessment, setAssessment] = useState<any>(null)
    const [submittedClaim, setSubmittedClaim] = useState<any>(null)
    const [claimsHistory, setClaimsHistory] = useState<any[]>([
        { id: "CLM-9021-4432", status: "APPROVED", payout: 450.00, date: "2024-02-10", type: "STRUCTURAL" },
        { id: "CLM-8812-1192", status: "UNDER_REVIEW", payout: 210.00, date: "2024-02-11", type: "WATER" }
    ])

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault()
        setAnalyzing(true)
        setAssessment(null)
        setSubmittedClaim(null)

        try {
            const result = await apiRequest('/api/claims/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: damageDescription })
            }, orgId)
            setAssessment(result)
        } catch (err) {
            console.error(err)
        } finally {
            setAnalyzing(false)
        }
    }

    const handleSubmitClaim = async () => {
        if (!assessment) return

        try {
            const result = await apiRequest('/api/claims/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shipment_id: Math.floor(Math.random() * 10000),
                    damage_data: assessment
                })
            }, orgId)
            setSubmittedClaim(result)
            setClaimsHistory(prev => [result, ...prev])
            setAssessment(null)
            setDamageDescription("")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest">
                            <ShieldAlert size={14} /> Intelligence Freight Claims
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            Claims <span className="text-rose-600 dark:text-rose-400">Command</span>
                        </h1>
                        <p className="text-muted-foreground font-medium">AI-driven damage recognition and automated cargo reconciliation.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* New Claim Wizard */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card rounded-[40px] border border-border shadow-sm p-8 glass-card">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6">Internal Incident Report</h3>

                            <form onSubmit={handleAnalyze} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative aspect-video bg-muted rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-rose-500/50 transition-all cursor-pointer group overflow-hidden">
                                        <div className="text-center group-hover:scale-110 transition-transform">
                                            <Camera size={32} className="mx-auto mb-2 opacity-20" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Snap or Upload Photo</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Damage Description</label>
                                        <textarea
                                            value={damageDescription}
                                            onChange={(e) => setDamageDescription(e.target.value)}
                                            placeholder="e.g. Pallet 4 has severe water stains and a cracked base..."
                                            className="w-full bg-muted border border-border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm min-h-[120px] text-foreground"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={analyzing || !damageDescription}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-600/10 active:scale-95 disabled:opacity-50"
                                >
                                    {analyzing ? <Loader2 className="mx-auto animate-spin" size={16} /> : "Run AI Damage Assessment"}
                                </button>
                            </form>
                        </div>

                        {/* AI Results Panel */}
                        {assessment && (
                            <div className="bg-card border border-border rounded-[40px] p-8 text-foreground animate-in zoom-in-95 duration-500 relative overflow-hidden glass-card">
                                <div className="absolute top-0 right-0 p-4">
                                    <Zap className="text-rose-500" size={20} />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">AI Vision Assessment</h4>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "mt-1 p-2 rounded-xl",
                                            assessment.damage_detected ? "bg-rose-500/20 text-rose-500" : "bg-green-500/20 text-green-500"
                                        )}>
                                            {assessment.damage_detected ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight text-foreground">{assessment.type} DETECTED</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">{assessment.assessment}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted rounded-2xl border border-border">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Severity</p>
                                            <span className={cn(
                                                "text-xs font-black uppercase",
                                                assessment.severity === 'CRITICAL' ? "text-rose-500" : "text-amber-500"
                                            )}>{assessment.severity}</span>
                                        </div>
                                        <div className="p-4 bg-muted rounded-2xl border border-border">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Est. Repair</p>
                                            <span className="text-xs font-black text-foreground">${assessment.estimate_repair_cost}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmitClaim}
                                        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-primary/90 shadow-xl"
                                    >
                                        File Formal Claim
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Claims Registry */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card rounded-[40px] border border-border shadow-sm overflow-hidden glass-card">
                            <div className="p-8 border-b border-border bg-muted/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Liability Registry</h3>
                                    <p className="text-xs font-medium text-muted-foreground mt-1">Audit trail for all active freight disputes.</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Search Claims..."
                                            className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 outline-none text-foreground"
                                        />
                                    </div>
                                    <button className="p-2 border border-border rounded-xl hover:bg-muted transition-all text-muted-foreground">
                                        <Filter size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Claim ID / Type</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Submission Date</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Claim Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Payout (Est)</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {claimsHistory.map((claim, idx) => (
                                            <tr key={claim.claim_id || claim.id} className="group hover:bg-muted/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="font-bold text-foreground leading-none mb-1">{claim.claim_id || claim.id}</p>
                                                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-tighter">{claim.type || claim.damage_report?.type}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-bold text-neutral-500">
                                                    {claim.date || new Date(claim.date_filed).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                                                        claim.status === 'APPROVED' ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                                    )}>
                                                        {claim.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-1 font-black text-foreground">
                                                        <DollarSign size={12} className="text-neutral-400" />
                                                        {claim.payout || claim.payout_estimate}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">
                                                        <ExternalLink size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Liability Summary Widget */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-card p-8 rounded-[40px] border border-border flex items-center justify-between group overflow-hidden relative glass-card">
                                <div className="absolute -right-4 -bottom-4 p-4 text-neutral-50 dark:text-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Zap size={120} />
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Approved Payouts</p>
                                    <p className="text-4xl font-black text-foreground">$14,240.50</p>
                                    <p className="text-xs font-bold text-green-500">+12% vs last Q</p>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-[32px] relative z-10">
                                    <ShieldAlert className="text-green-600" size={32} />
                                </div>
                            </div>

                            <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm flex items-center justify-between group overflow-hidden relative glass-card">
                                <div className="absolute -right-4 -bottom-4 p-4 text-primary opacity-0 group-hover:opacity-5 transition-opacity">
                                    <Zap size={120} />
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Disputes</p>
                                    <p className="text-4xl font-black text-foreground">6</p>
                                    <p className="text-xs font-bold text-amber-500">Awaiting Adjuster</p>
                                </div>
                                <div className="p-4 bg-muted rounded-[32px] relative z-10">
                                    <FileText className="text-foreground" size={32} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
