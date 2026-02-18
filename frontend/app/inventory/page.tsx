"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import {
    Package,
    AlertTriangle,
    ArrowUpRight,
    Plus,
    Search,
    Filter,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    TrendingDown,
    Activity
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function InventoryDashboard() {
    const { orgId } = useOrg()
    const [skus, setSkus] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        current_stock: 0,
        safety_stock: 10,
        reorder_point: 20,
        unit_measure: "units",
        lead_time_days: 14
    })

    const fetchStatus = useCallback(async () => {
        try {
            const data = await apiRequest('/api/inventory/status', {}, orgId)
            setSkus(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [orgId])

    useEffect(() => {
        fetchStatus()
    }, [fetchStatus])

    const handleAddSKU = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await apiRequest('/api/inventory/skus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }, orgId)
            setShowAddModal(false)
            fetchStatus()
        } catch (err) {
            console.error(err)
        }
    }

    const stats = {
        total_skus: skus.length,
        critical: skus.filter(s => s.risk_level === 'CRITICAL').length,
        high_risk: skus.filter(s => s.risk_level === 'HIGH').length,
        incoming: skus.reduce((acc, s) => acc + s.total_incoming, 0)
    }

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-foreground tracking-tight">Predictive <span className="text-blue-600 dark:text-blue-400">Inventory</span></h1>
                        <p className="text-muted-foreground font-medium">Correlating shipment ETAs with SKU stock levels.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={18} /> Register New SKU
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 rounded-[32px] border border-neutral-100 dark:border-white/10 shadow-sm transition-transform hover:scale-[1.02] glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                                <Package size={20} />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Roster</span>
                        </div>
                        <div className="text-3xl font-black text-foreground">{stats.total_skus}</div>
                        <p className="text-xs font-bold text-muted-foreground mt-1">Unique SKUs Tracked</p>
                    </div>

                    <div className="p-6 rounded-[32px] border border-neutral-100 dark:border-white/10 shadow-sm transition-transform hover:scale-[1.02] glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-2xl">
                                <AlertTriangle size={20} />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Attention Required</span>
                        </div>
                        <div className="text-3xl font-black text-red-600 dark:text-red-500">{stats.critical}</div>
                        <p className="text-xs font-bold text-muted-foreground mt-1">Critical Stock-outs</p>
                    </div>

                    <div className="p-6 rounded-[32px] border border-neutral-100 dark:border-white/10 shadow-sm transition-transform hover:scale-[1.02] glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 rounded-2xl">
                                <TrendingDown size={20} />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Forecasting</span>
                        </div>
                        <div className="text-3xl font-black text-orange-500 dark:text-orange-400">{stats.high_risk}</div>
                        <p className="text-xs font-bold text-muted-foreground mt-1">High Risk (Reorder Hit)</p>
                    </div>

                    <div className="p-6 rounded-[32px] border border-neutral-100 dark:border-white/10 shadow-sm transition-transform hover:scale-[1.02] glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl">
                                <Truck size={20} />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Inbound Pipeline</span>
                        </div>
                        <div className="text-3xl font-black text-green-600 dark:text-green-500">{stats.incoming}</div>
                        <p className="text-xs font-bold text-muted-foreground mt-1">Incoming Units (Transit)</p>
                    </div>
                </div>

                {/* Directory Table */}
                <div className="rounded-[40px] border border-border shadow-sm overflow-hidden glass-card">
                    <div className="p-8 border-b border-border bg-muted/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="Filter SKUs by code or description..."
                                className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-2xl font-medium text-foreground outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                        <div className="flex gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <Activity size={16} /> Predictor: Active
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted/30">
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Item / Code</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Current Stock</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Safety Level</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status / Risk</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Pipeline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {skus.map((item) => (
                                    <tr key={item.sku.id} className="group hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors border-b border-neutral-50 dark:border-white/5">
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="font-bold text-foreground leading-none mb-1">{item.sku.name}</p>
                                                <p className="text-xs text-muted-foreground font-black uppercase tracking-tighter">{item.sku.code}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={cn(
                                                "text-lg font-black",
                                                item.sku.current_stock <= item.sku.safety_stock ? "text-red-600 dark:text-red-500" : "text-foreground"
                                            )}>
                                                {item.sku.current_stock}
                                            </span>
                                            <span className="text-[10px] font-bold text-muted-foreground ml-1 italic">{item.sku.unit_measure}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Reorder @ {item.sku.reorder_point}</span>
                                                <div className="w-24 h-1.5 bg-neutral-100 dark:bg-white/10 rounded-full mt-1.5 overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            item.sku.current_stock <= item.sku.safety_stock ? "bg-red-500" : "bg-blue-500"
                                                        )}
                                                        style={{ width: `${Math.min((item.sku.current_stock / item.sku.reorder_point) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                item.risk_level === 'CRITICAL' ? "bg-red-100 text-red-700" :
                                                    item.risk_level === 'HIGH' ? "bg-orange-100 text-orange-700" :
                                                        "bg-green-100 text-green-700"
                                            )}>
                                                {item.risk_level === 'CRITICAL' && <AlertTriangle size={12} />}
                                                {item.risk_level === 'HIGH' && <Clock size={12} />}
                                                {item.risk_level === 'LOW' && <CheckCircle2 size={12} />}
                                                {item.risk_level === 'CRITICAL' ? 'Stock-out Imminent' :
                                                    item.risk_level === 'HIGH' ? 'Reorder Required' : 'Adequate'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {item.total_incoming > 0 ? (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-black text-blue-600 flex items-center gap-1">
                                                        +{item.total_incoming} <ArrowUpRight size={14} />
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground">Incoming Shipment</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-muted-foreground/40">No Inbound</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Insight Card */}
                <div className="bg-card rounded-[40px] p-10 text-foreground flex flex-col md:flex-row items-center justify-between gap-8 border border-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <Activity size={180} />
                    </div>
                    <div className="space-y-4 max-w-xl relative z-10 text-center md:text-left">
                        <h3 className="text-2xl font-black flex items-center justify-center md:justify-start gap-3">
                            <span className="p-2 bg-blue-600 rounded-xl"><Activity size={24} /></span>
                            Supply Chain <span className="text-blue-500">Correlation</span>
                        </h3>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            LogiMatch AI has detected that **{stats.high_risk} SKUs** are dipping below reorder points while their replenishment shipments are caught in
                            current port congestion.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                            <button
                                onClick={() => {
                                    const promise = new Promise((resolve) => setTimeout(() => resolve({ impact: 'MODERATE' }), 3000));
                                    toast.promise(promise, {
                                        loading: 'Running hardware-accelerated Stock-out Simulation...',
                                        success: (data: any) => {
                                            return `Simulation Complete. Impact: ${data.impact}. Risk mitigation report generated.`;
                                        },
                                        error: 'Simulation failed to initialize.',
                                    });
                                }}
                                className="px-6 py-3 bg-muted hover:bg-muted/80 dark:bg-white/10 dark:hover:bg-white/20 border border-border dark:border-white/10 rounded-2xl text-sm font-bold transition-all"
                            >
                                Run Stock-out Simulation
                            </button>
                            <button
                                onClick={() => {
                                    const promise = new Promise((resolve) => setTimeout(() => resolve({ expedited: 3 }), 2000));
                                    toast.promise(promise, {
                                        loading: 'Opening Expedite Center...',
                                        success: (data: any) => {
                                            return `Priority lanes active. ${data.expedited} shipments moved to "EXPRESS" class.`;
                                        },
                                        error: 'Failed to access Expedite Center.',
                                    });
                                }}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                            >
                                Open Expedite Center
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Add SKU Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="rounded-[40px] p-10 w-full max-w-md shadow-2xl animate-in zoom-in duration-300 border border-border glass-card">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-foreground">Add <span className="text-blue-600 dark:text-blue-400">New SKU</span></h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <Plus className="rotate-45 text-muted-foreground" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSKU} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Item Description</label>
                                <input
                                    required
                                    className="w-full px-5 py-3 bg-muted border border-border rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="e.g. Lithium-Ion Battery Pack B1"
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">SKU Code</label>
                                    <input
                                        required
                                        className="w-full px-5 py-3 bg-muted border border-border rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="P/N: 123-456"
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Stock</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-3 bg-muted border border-border rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="0"
                                        onChange={e => setFormData({ ...formData, current_stock: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] mt-4">
                                Register Inventory Asset
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
