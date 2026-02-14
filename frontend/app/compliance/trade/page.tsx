"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import {
    ShieldCheck,
    Search,
    Filter,
    Zap,
    Calculator,
    FileText,
    Globe,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function GlobalTradePage() {
    const { orgId } = useOrg()
    const [skus, setSkus] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [classifying, setClassifying] = useState<number | null>(null)
    const [selectedSku, setSelectedSku] = useState<any>(null)
    const [estimation, setEstimation] = useState<any>(null)
    const [estimating, setEstimating] = useState(false)

    const fetchSkus = useCallback(async () => {
        try {
            const data = await apiRequest('/api/inventory/skus', {}, orgId)
            setSkus(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [orgId])

    useEffect(() => { fetchSkus() }, [fetchSkus])

    const handleClassify = async (sku: any) => {
        setClassifying(sku.id)
        try {
            const result = await apiRequest('/api/customs/classify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: sku.name, material: sku.material_composition })
            }, orgId)

            if (result.hs_code) {
                // Update SKU with result
                await apiRequest(`/api/inventory/skus/${sku.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ hs_code: result.hs_code })
                }, orgId)
                fetchSkus()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setClassifying(null)
        }
    }

    const handleEstimate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedSku?.hs_code) return

        setEstimating(true)
        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement)
            const result = await apiRequest('/api/customs/estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hs_code: selectedSku.hs_code,
                    value: parseFloat(formData.get('value') as string),
                    origin: formData.get('origin'),
                    destination: formData.get('destination')
                })
            }, orgId)
            setEstimation(result)
        } catch (err) {
            console.error(err)
        } finally {
            setEstimating(false)
        }
    }

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                            <ShieldCheck size={14} /> Global Trade Compliance
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            Trade <span className="text-primary dark:text-indigo-400">Intelligence</span>
                        </h1>
                        <p className="text-muted-foreground font-medium">Autonomous HS classification, duty estimation, and document governance.</p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                        <FileText size={18} /> Documentation Audit
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Compliance Manager (Table) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card rounded-[40px] border border-border shadow-sm overflow-hidden glass-card">
                            <div className="p-8 border-b border-border bg-muted/50 flex justify-between items-center">
                                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Product Catalog Compliance</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-md uppercase">AI Core Active</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-neutral-50 dark:border-white/5">
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Product / SKU</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">HS Code</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Country of Origin</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                        {skus.map((sku) => (
                                            <tr key={sku.id} className={cn(
                                                "group transition-all hover:bg-neutral-50/50 dark:hover:bg-white/5",
                                                selectedSku?.id === sku.id ? "bg-indigo-50/30 dark:bg-indigo-500/10" : ""
                                            )}>
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="font-bold text-foreground">{sku.name}</p>
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{sku.code}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-mono font-bold text-neutral-600">
                                                    {sku.hs_code ? (
                                                        <span className="flex items-center gap-1.5 text-indigo-600">
                                                            <CheckCircle2 size={12} className="text-green-500" /> {sku.hs_code}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-amber-500 italic">
                                                            <AlertCircle size={12} /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-sm font-bold text-neutral-500 dark:text-neutral-400">
                                                    {sku.origin_country || "Not Set"}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleClassify(sku)}
                                                            disabled={classifying === sku.id}
                                                            className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all active:scale-90"
                                                            title="AI Classification"
                                                        >
                                                            {classifying === sku.id ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedSku(sku); setEstimation(null); }}
                                                            className="p-2 bg-muted text-muted-foreground rounded-xl hover:bg-primary hover:text-primary-foreground transition-all active:scale-90"
                                                            title="Estimate Duties"
                                                        >
                                                            <Calculator size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Duty Estimator (Sidebar/Panel) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card rounded-[40px] p-8 text-foreground border border-border relative overflow-hidden shadow-2xl glass-card">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/30">
                                    <Calculator size={20} className="text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Duty Predictor</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold">Landed Cost Simulation</p>
                                </div>
                            </div>

                            {!selectedSku ? (
                                <div className="py-12 text-center text-neutral-500 space-y-4 border-2 border-dashed border-white/5 rounded-[32px]">
                                    <Globe size={32} className="mx-auto opacity-20" />
                                    <p className="text-xs font-medium px-6">Select a SKU from the catalog to begin trade cost simulation.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleEstimate} className="space-y-6">
                                    <div className="p-4 bg-muted rounded-2xl border border-border">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Target Product</p>
                                        <p className="font-bold text-sm truncate">{selectedSku.name}</p>
                                        <p className="text-[10px] font-mono text-muted-foreground mt-1">HS Code: {selectedSku.hs_code || "N/A"}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Shipment Value ($)</label>
                                            <input
                                                name="value"
                                                type="number"
                                                required
                                                placeholder="e.g. 50000"
                                                className="w-full bg-muted border border-border rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-foreground"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Origin</label>
                                                <input name="origin" defaultValue="CN" className="w-full bg-muted border border-border rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-center text-foreground" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Dest.</label>
                                                <input name="destination" defaultValue="US" className="w-full bg-muted border border-border rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-center text-foreground" />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={estimating || !selectedSku.hs_code}
                                        className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                    >
                                        {estimating ? <Loader2 size={16} className="mx-auto animate-spin" /> : "Run Cost Analysis"}
                                    </button>
                                </form>
                            )}

                            {estimation && (
                                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="h-px bg-border" />
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground font-bold">Import Duty (Est.)</span>
                                            <span className="font-black text-foreground">+${estimation.duty_amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground font-bold">Import VAT (Est.)</span>
                                            <span className="font-black text-foreground">+${estimation.vat_amount.toLocaleString()}</span>
                                        </div>
                                        <div className="pt-2 flex justify-between items-center border-t border-border">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Total Landed</span>
                                            <span className="text-xl font-black text-foreground">${estimation.total_estimated_landed_cost.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-neutral-500 italic leading-tight">
                                        * Includes Section 301 tariffs if applicable. Final rates confirmed at border.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
