"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import {
    FileText,
    Upload,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowRight,
    DollarSign,
    Hash,
    Search,
    Filter,
    MoreHorizontal,
    Download,
    Mail,
    ChevronDown,
    ChevronUp,
    FileCheck,
    MessageSquare,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"

export default function ReconcilePage() {
    const { orgId } = useOrg()
    const [invoices, setInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
    const [showDisputeModal, setShowDisputeModal] = useState(false)

    const fetchMatches = useCallback(async () => {
        try {
            const data = await apiRequest('/api/reconcile/matches', {}, orgId)
            setInvoices(data)
        } catch (err) {
            console.error("Match Fetch Error:", err)
        } finally {
            setLoading(false)
        }
    }, [orgId])

    useEffect(() => {
        fetchMatches()
    }, [fetchMatches])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        setUploading(true)

        const formData = new FormData()
        formData.append('file', e.target.files[0])
        formData.append('user_id', 'PilotUser_01')

        try {
            await apiRequest('/api/reconcile/upload', {
                method: 'POST',
                body: formData
            }, orgId)
            fetchMatches()
        } catch (err) {
            console.error("Upload Error:", err)
        } finally {
            setUploading(false)
        }
    }

    const handleAction = async (invoiceId: number, action: 'APPROVE' | 'DISPUTE') => {
        try {
            await apiRequest('/api/reconcile/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoice_id: invoiceId, action })
            }, orgId)
            fetchMatches()
        } catch (err) {
            console.error("Action Error:", err)
        }
    }

    if (loading) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="relative">
                        <DollarSign size={48} className="text-emerald-500 animate-bounce" />
                    </div>
                    <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs">Auditing Financial Records...</span>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                            <FileCheck size={14} /> Financial Audit & Reconciliation
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            Invoice <span className="text-emerald-600">Audit</span> Center
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-2xl">
                            Automatically verify incoming carrier invoices against original quoted rates to prevent overbilling and leakage.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className={cn(
                            "flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm cursor-pointer hover:opacity-90 transition-all shadow-lg shadow-primary/20",
                            uploading ? "opacity-50 cursor-not-allowed" : ""
                        )}>
                            <Upload size={18} />
                            {uploading ? "Processing Invoice..." : "Upload New Invoice"}
                            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept=".pdf,.doc,.docx" />
                        </label>
                    </div>
                </header>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Audited", value: invoices.length, icon: FileText, color: "blue" },
                        { label: "Perfect Matches", value: invoices.filter(i => i.status === 'MATCHED').length, icon: CheckCircle, color: "emerald" },
                        { label: "Discrepancies", value: invoices.filter(i => i.status === 'DISCREPANCY').length, icon: AlertCircle, color: "red" },
                        { label: "Financial Impact", value: `$${invoices.reduce((acc, i) => acc + (i.discrepancy_details?.diff || 0), 0).toFixed(2)}`, icon: DollarSign, color: "amber" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center justify-between glass-card">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                            </div>
                            <div className={cn(
                                "p-3 rounded-2xl",
                                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                                    stat.color === 'red' ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" :
                                        stat.color === 'blue' ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            )}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Table */}
                <div className="bg-card rounded-[32px] border border-border shadow-xl shadow-neutral-200/50 dark:shadow-none overflow-hidden glass-card">
                    <div className="p-8 border-b border-border bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-2xl border border-border w-full md:w-96">
                            <Search size={18} className="text-neutral-400" />
                            <input type="text" placeholder="Search Invoices or POs..." className="bg-transparent border-none text-sm font-medium focus:ring-0 w-full text-foreground placeholder:text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-3 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-neutral-200">
                                <Filter size={18} className="text-neutral-500" />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border text-sm font-bold text-muted-foreground hover:border-emerald-500 hover:text-emerald-500 transition-all">
                                <Download size={16} /> Export Audit
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Invoice Node</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Matched Quote / PO</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Financial Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Variance</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="group hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-muted rounded-2xl text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground uppercase tracking-tight">{inv.invoice_number}</p>
                                                    <p className="text-[10px] font-black text-neutral-400">{new Date(inv.invoice_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {inv.quote_data ? (
                                                <div>
                                                    <p className="font-bold text-foreground">{inv.quote_data.carrier}</p>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase">{inv.quote_data.po_number || "NO PO LINKED"}</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-muted-foreground/50 italic">No Matching Quote Found</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                inv.status === 'MATCHED' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                                                    inv.status === 'DISCREPANCY' ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" :
                                                        inv.status === 'APPROVED' ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" : "bg-muted text-muted-foreground"
                                            )}>
                                                {inv.status === 'MATCHED' && <CheckCircle size={10} />}
                                                {inv.status === 'DISCREPANCY' && <AlertCircle size={10} />}
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {inv.discrepancy_details ? (
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-black text-red-600">+${inv.discrepancy_details.diff}</p>
                                                    <p className="text-[10px] font-bold text-neutral-400 uppercase italic leading-none">{inv.discrepancy_details.reason}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm font-black text-emerald-600">$0.00</p>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {inv.status === 'DISCREPANCY' ? (
                                                    <button
                                                        onClick={() => handleAction(inv.id, 'DISPUTE')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                                                        title="Dispute Charges"
                                                    >
                                                        <Mail size={16} />
                                                    </button>
                                                ) : null}
                                                <button
                                                    onClick={() => handleAction(inv.id, 'APPROVE')}
                                                    disabled={inv.status === 'APPROVED'}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                        inv.status === 'APPROVED' ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:opacity-90"
                                                    )}
                                                >
                                                    {inv.status === 'APPROVED' ? "Paid" : "Approve"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                            <div className="relative inline-block mb-4">
                                                <FileCheck size={64} className="text-muted/30" />
                                                <Upload size={24} className="absolute -bottom-2 -right-2 text-emerald-500 animate-bounce" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground">No Invoices to Audit</h3>
                                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                                                Upload your first carrier invoice to start the automated reconciliation process.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Automation Tip */}
                <div className="bg-card dark:bg-emerald-950 rounded-3xl p-8 border border-border relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Zap size={180} className="text-emerald-500" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-500/20 dark:border-emerald-500/30">
                            <Zap size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Financial AI Insight</span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground dark:text-white mb-4">You've recovered $0.00 in leaked freight spend this month.</h3>
                        <p className="text-muted-foreground dark:text-emerald-100/70 font-medium leading-relaxed">
                            LogiMatch AI has identified 0 discrepancies in your carrier invoices today. By automating reconciliation, you've reduced manual audit time by 100%.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
