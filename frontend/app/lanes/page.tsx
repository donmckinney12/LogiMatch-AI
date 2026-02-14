"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ReferenceLine
} from "recharts"
import {
    Globe,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    ArrowRight,
    MapPin,
    Zap,
    Ship,
    Search,
    ChevronRight,
    Info
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function LaneIntelligencePage() {
    const [lanes, setLanes] = useState<any[]>([])
    const [selectedLane, setSelectedLane] = useState<string>("")
    const [forecastData, setForecastData] = useState<any>(null)
    const [dominanceData, setDominanceData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLanes()
    }, [])

    useEffect(() => {
        if (selectedLane) {
            const [origin, destination] = selectedLane.split(" to ")
            fetchForecast(origin, destination)
            fetchDominance(origin, destination)
        }
    }, [selectedLane])

    const fetchLanes = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/analytics/lanes')
            const data = await res.json()
            setLanes(data)
            if (data.length > 0) {
                setSelectedLane(`${data[0].origin} to ${data[0].destination}`)
            }
        } catch (err) {
            console.error("Failed to fetch lanes", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchForecast = async (origin: string, destination: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/analytics/forecast?origin=${origin}&destination=${destination}`)
            const data = await res.json()
            setForecastData(data)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchDominance = async (origin: string, destination: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/analytics/dominance?origin=${origin}&destination=${destination}`)
            const data = await res.json()
            setDominanceData(data)
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Zap className="animate-pulse text-blue-600 mr-2" />
                    <span className="text-neutral-500 font-medium">Calibrating Lane Intelligence...</span>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl border border-border shadow-sm glass-card">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
                            <Globe size={14} /> Predictive Network
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight leading-none">
                            Lane <span className="text-blue-600 dark:text-blue-400">Intelligence</span> Command
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Real-time market rate forecasting and carrier dominance mapping for global logistics corridors.
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {lanes.map((lane) => (
                                <button
                                    key={`${lane.origin}-${lane.destination}`}
                                    onClick={() => setSelectedLane(`${lane.origin} to ${lane.destination}`)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                                        selectedLane === `${lane.origin} to ${lane.destination}`
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-blue-500/20"
                                            : "bg-muted text-muted-foreground hover:bg-neutral-200 dark:hover:bg-white/10"
                                    )}
                                >
                                    <MapPin size={12} />
                                    {lane.origin} → {lane.destination}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-muted p-6 rounded-2xl border border-border min-w-[300px]">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={16} className="text-primary" />
                            <span className="text-xs font-black text-primary/80 uppercase">Savings Advisor</span>
                        </div>
                        <p className="text-sm font-bold text-foreground leading-snug">
                            {forecastData?.advisory || "Analyzing market trends..."}
                        </p>
                        <button className="mt-4 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase hover:gap-3 transition-all">
                            Review Negotiation Strategy <ArrowRight size={12} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Forecast Chart */}
                    <div className="lg:col-span-2 p-8 rounded-3xl border border-border shadow-sm space-y-6 glass-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Rate Forecast</h3>
                                <p className="text-sm text-muted-foreground">8-Week Price Trajectory (Actual vs predicted)</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                                    <div className="w-2 h-2 rounded-full bg-blue-600" /> Actual
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                                    <div className="w-2 h-2 rounded-full bg-blue-200" /> AI Forecast
                                </div>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData?.forecast_data || []}>
                                    <defs>
                                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/20 dark:text-white/5" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                                        className="text-muted-foreground"
                                        dy={10}
                                        tickFormatter={(val: any) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                                        className="text-muted-foreground"
                                        domain={['auto', 'auto']}
                                        tickFormatter={(val: any) => `$${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        labelStyle={{ fontWeight: 800, color: 'var(--foreground)' }}
                                    />
                                    <ReferenceLine x={new Date().toISOString().split('T')[0]} stroke="#2563eb" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#2563eb', fontSize: 10, fontWeight: 800 }} />
                                    <Area
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRate)"
                                        animationDuration={2000}
                                        isAnimationActive={false} // Avoid issues with hydration/re-render in dark mode
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Carrier Dominance Heatmap */}
                    <div className="bg-card p-8 rounded-3xl text-foreground space-y-6 relative overflow-hidden border border-border">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <Ship size={200} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold">Carrier Dominance</h3>
                            <p className="text-sm text-muted-foreground">Market share for selected corridor</p>
                        </div>

                        <div className="relative z-10 space-y-4 pt-4">
                            {dominanceData.map((carrier, idx) => (
                                <div key={carrier.carrier_name} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-neutral-500 italic pr-1">#{idx + 1}</span>
                                            <span className="font-bold">{carrier.carrier_name}</span>
                                            {carrier.is_preferred && <Zap size={10} className="text-blue-400 fill-blue-400" />}
                                        </div>
                                        <span className="text-xs font-black text-blue-500">{carrier.market_share}% SHARE</span>
                                    </div>
                                    <div className="h-2 bg-muted dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full group-hover:opacity-80 transition-all shadow-[0_0_8px_rgba(37,99,235,0.3)]"
                                            style={{ width: `${carrier.market_share}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-muted-foreground">
                                        <span className="flex items-center gap-1"><Ship size={10} /> {carrier.avg_transit_days}D TRANSIT</span>
                                        <span className="flex items-center gap-1"><TrendingUp size={10} /> {carrier.reliability_score}% RELIABLE</span>
                                    </div>
                                </div>
                            ))}

                            {dominanceData.length === 0 && (
                                <div className="text-center py-12 text-neutral-500">
                                    <Search size={32} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">No historical data for this lane</p>
                                </div>
                            )}
                        </div>

                        <button className="relative z-10 w-full mt-8 p-4 bg-muted border border-border rounded-2xl flex items-center justify-between hover:bg-muted/80 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg text-white">
                                    <TrendingDown size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-black uppercase tracking-tight">Challenge Rates</p>
                                    <p className="text-[10px] text-muted-foreground">Carrier pricing is 12% above index</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Additional Insights Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 glass-card">
                        <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl">
                            <TrendingDown size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Seasonality Bonus</p>
                            <p className="text-lg font-black text-foreground">-4.2%</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 glass-card">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Ship size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Port Congestion</p>
                            <p className="text-lg font-black text-foreground">LOW</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 glass-card">
                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Volatility Risk</p>
                            <p className="text-lg font-black text-foreground">MEDIUM</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 glass-card">
                        <div className="p-3 bg-neutral-50 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 rounded-xl">
                            <Info size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Data Confidence</p>
                            <p className="text-lg font-black text-foreground">92%</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
