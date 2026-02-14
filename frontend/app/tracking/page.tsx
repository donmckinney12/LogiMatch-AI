"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import { TrackingMap } from "@/components/tracking-map"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import {
    Navigation,
    AlertTriangle,
    Clock,
    Ship,
    Plane,
    ExternalLink,
    ChevronRight,
    Search,
    Filter,
    Activity,
    Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function LiveTrackingPage() {
    const { orgId } = useOrg()
    const [inventoryData, setInventoryData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchData = useCallback(async () => {
        try {
            const data = await apiRequest('/api/inventory/status', {}, orgId)
            setInventoryData(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [orgId])

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 10000) // Polling every 10s for "live" feel
        return () => clearInterval(interval)
    }, [fetchData])

    // Flatten all shipments from SKU details
    const allShipments = inventoryData.flatMap(sku =>
        sku.shipment_details.map((sd: any) => ({
            ...sd.telemetry,
            sku_name: sku.sku.name,
            risk_level: sku.risk_level
        }))
    )

    const highRiskShipments = allShipments.filter(s => s.eta_drift_hours > 12)

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-6 animate-in pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                            <Globe size={14} /> Global Situational Awareness
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            Live <span className="text-primary dark:text-blue-400">Telematics</span>
                        </h1>
                        <p className="text-muted-foreground font-medium">Real-time GPS tracking converged with predictive inventory risk.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border border-border shadow-sm glass-card">
                        <button className="px-4 py-2 bg-primary dark:bg-primary text-primary-foreground rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95">
                            Live Feed
                        </button>
                        <button className="px-4 py-2 hover:bg-muted text-muted-foreground rounded-xl text-xs font-bold transition-all">
                            History
                        </button>
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar: High-Risk Feed */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card rounded-[40px] border border-border shadow-sm p-8 space-y-6 glass-card">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest">Watchlist</h3>
                                <span className="bg-destructive/10 text-destructive text-[10px] font-black px-2 py-0.5 rounded-md">
                                    {highRiskShipments.length} ALERT
                                </span>
                            </div>

                            <div className="space-y-4">
                                {highRiskShipments.length > 0 ? highRiskShipments.map((shipment, idx) => (
                                    <div key={idx} className="p-4 bg-red-50/50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 group cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle size={14} className="text-red-500" />
                                                <span className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase tracking-widest">Delay Drift</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-red-600 dark:text-red-400">+{shipment.eta_drift_hours}h</span>
                                        </div>
                                        <p className="text-sm font-black text-foreground mb-1 group-hover:text-primary transition-colors">{shipment.sku_name}</p>
                                        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                                            <span>{shipment.destination}</span>
                                            <div className="flex items-center gap-1">
                                                <ChevronRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-12 text-center text-muted-foreground/40">
                                        <Clock size={32} className="mx-auto opacity-20 mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No Critical Delays</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inventory Context Widget */}
                        <div className="bg-card border border-border rounded-[40px] p-8 text-foreground relative overflow-hidden glass-card">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Activity size={80} className="text-primary" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Stock Correlation</h4>
                            <div className="space-y-4">
                                {inventoryData.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold mb-1">
                                            <span className="text-muted-foreground">{item.sku.code}</span>
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded text-[8px] font-black tracking-tighter",
                                                item.risk_level === 'CRITICAL'
                                                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                                    : "bg-green-500/10 text-green-600 dark:text-green-400"
                                            )}>
                                                {item.risk_level}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden border border-border/50">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-1000",
                                                    item.risk_level === 'CRITICAL' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(37,99,235,0.3)]"
                                                )}
                                                style={{ width: `${(item.sku.current_stock / item.sku.reorder_point) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
                                Optimization Engine
                            </button>
                        </div>
                    </div>

                    {/* Main Section: Map & Table */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Interactive Map */}
                        <TrackingMap shipments={allShipments} />

                        {/* Detailed Table */}
                        <div className="bg-card rounded-[40px] border border-border shadow-sm overflow-hidden glass-card">
                            <div className="p-8 border-b border-neutral-50 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by shipment ID or port..."
                                        className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-2xl font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4 items-center">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sorting by Visibility</span>
                                    <button className="p-2 bg-muted/50 dark:bg-white/5 rounded-xl hover:bg-muted transition-all">
                                        <Filter size={18} className="text-muted-foreground" />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-muted/30 dark:bg-white/5 border-b border-border">
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Shipment / SKU</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Coordinates</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Velocity</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Arrival Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {allShipments.map((s, idx) => (
                                            <tr key={idx} className="group hover:bg-muted/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="font-bold text-foreground leading-none mb-1">#{s.shipment_id}</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[10px] font-black text-primary dark:text-blue-400 uppercase tracking-tighter">{s.sku_name}</p>
                                                            {s.in_geofence && (
                                                                <span className="text-[8px] font-black bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-widest">In Geofence</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="font-mono text-[10px] text-muted-foreground font-bold">
                                                        {s.latitude.toFixed(4)}°N, {s.longitude.toFixed(4)}°W
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <Navigation size={12} className="text-primary" style={{ transform: `rotate(${s.heading}deg)` }} />
                                                        <span className="text-xs font-black text-foreground">{s.speed_knots} KT</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-foreground">{s.destination}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={cn(
                                                                "text-[10px] font-black uppercase tracking-widest",
                                                                s.eta_drift_hours > 0 ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"
                                                            )}>
                                                                {s.eta_drift_hours > 0 ? `Delayed by ${s.eta_drift_hours}h` : 'On Schedule'}
                                                            </span>
                                                            {s.delay_reason && (
                                                                <span className="text-[10px] text-muted-foreground font-medium italic">({s.delay_reason})</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-xl transition-all">
                                                        <ExternalLink size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
