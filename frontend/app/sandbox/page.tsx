"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import {
    LayoutDashboard,
    Zap,
    Play,
    BarChart3,
    ArrowRight,
    Search,
    Filter,
    Activity,
    Ship,
    TrendingUp,
    TrendingDown,
    Map,
    Settings,
    ShieldAlert,
    Info,
    RefreshCw,
    Download,
    Share2,
    CheckCircle2,
    Database,
    LineChart,
    DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts'

import { apiRequest } from "@/lib/api-client"

export default function SandboxPage() {
    const [baseline, setBaseline] = useState<any>(null)
    const [simulation, setSimulation] = useState<any>(null)
    const [optimizations, setOptimizations] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [running, setRunning] = useState(false)
    const [activeScenario, setActiveScenario] = useState('cost_hike')

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        try {
            const data = await apiRequest('/api/simulation/baseline')
            setBaseline(data)

            // Auto-run default scenario
            handleRunSimulation('fuel_hike')
            fetchOptimizations()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleRunSimulation = async (scenario: string) => {
        setRunning(true)
        setActiveScenario(scenario)
        try {
            const data = await apiRequest('/api/simulation/run', {
                method: 'POST',
                body: JSON.stringify({ scenario, variable: 0.2 }) // 20% adjustment
            })
            setSimulation(data)
        } catch (err) {
            console.error(err)
        } finally {
            setRunning(false)
        }
    }

    const fetchOptimizations = async () => {
        try {
            const data = await apiRequest('/api/simulation/scenario', {
                method: 'POST',
                body: JSON.stringify({ priority: 'COST' })
            })
            setOptimizations(data)
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="relative">
                        <RefreshCw size={48} className="text-blue-500 animate-spin" />
                    </div>
                    <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs">Cloning Supply Chain Digital Twin...</span>
                </div>
            </AppLayout>
        )
    }

    const chartData = [
        { name: 'Baseline', cost: simulation?.baseline?.cost || 0, transit: simulation?.baseline?.transit || 0 },
        { name: 'Simulated', cost: simulation?.projected?.cost || 0, transit: simulation?.projected?.transit || 0 },
    ]

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                            <Database size={14} /> Supply Chain Digital Twin
                        </div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Scenario Sandbox</h1>
                        <p className="text-muted-foreground mt-2">Simulate freight market shocks and optimize lane allocation ROI.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-card border border-border text-muted-foreground rounded-2xl font-bold text-sm hover:border-primary hover:text-primary transition-all glass-card">
                            <Share2 size={16} /> Share Strategic Brief
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card rounded-3xl border border-border shadow-sm p-6 space-y-6 glass-card">
                            <h3 className="font-bold text-foreground flex items-center gap-2 uppercase text-xs tracking-wider">
                                <Settings size={16} className="text-muted-foreground" /> Modeling Controls
                            </h3>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-neutral-400 uppercase">Select Scenario</p>
                                {[
                                    { id: 'fuel_hike', label: 'Fuel Surcharge Spike (+20%)', icon: TrendingUp },
                                    { id: 'port_closure', label: 'US West Coast Port Closure', icon: ShieldAlert },
                                    { id: 'mode_shift', label: 'Ocean to Air Conversion', icon: Map },
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleRunSimulation(s.id)}
                                        className={cn(
                                            "w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3",
                                            activeScenario === s.id
                                                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "bg-muted/50 border-border text-muted-foreground hover:border-primary/50"
                                        )}
                                    >
                                        <s.icon size={18} className={cn(activeScenario === s.id ? "text-white" : "text-blue-500")} />
                                        <span className="text-xs font-bold">{s.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-border">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Solver Precision</p>
                                    <span className="text-xs font-bold text-blue-600 uppercase">High</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                                    <div className="h-full w-[94%] bg-primary rounded-full shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 italic font-medium">Using historical quote data from past 12 months.</p>
                            </div>
                        </div>

                        {/* Constraints */}
                        <div className="bg-card border border-border rounded-3xl p-6 text-foreground space-y-4 glass-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Filter size={80} className="text-primary" />
                            </div>
                            <h3 className="font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest text-muted-foreground relative z-10">
                                <Filter size={14} /> Optimization Constraints
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase">
                                        <span>Cost Priority</span>
                                        <span className="text-foreground">Aggressive</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full">
                                        <div className="h-full w-[80%] bg-primary rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase">
                                        <span>Max Lead Time</span>
                                        <span className="text-foreground">21 Days</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full">
                                        <div className="h-full w-[40%] bg-primary/50 dark:bg-blue-400 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results / Charts */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cost Chart */}
                            <div className="bg-card rounded-[32px] border border-border p-8 shadow-sm glass-card">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-bold text-foreground uppercase text-xs tracking-widest flex items-center gap-2">
                                        <DollarSign size={16} className="text-emerald-500" /> Projected Cost Delta
                                    </h3>
                                    {simulation?.delta?.cost_percent > 0 ? (
                                        <span className="flex items-center gap-1 text-[10px] font-black bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase">
                                            <TrendingUp size={10} /> +{simulation.delta.cost_percent}%
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full uppercase">
                                            <TrendingDown size={10} /> {simulation?.delta?.cost_percent}%
                                        </span>
                                    )}
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                                            <XAxis
                                                dataKey="name"
                                                fontSize={10}
                                                fontWeight="bold"
                                                tickLine={false}
                                                axisLine={false}
                                                stroke="currentColor"
                                                className="text-muted-foreground"
                                            />
                                            <YAxis
                                                fontSize={10}
                                                fontWeight="bold"
                                                tickLine={false}
                                                axisLine={false}
                                                stroke="currentColor"
                                                className="text-muted-foreground"
                                                tickFormatter={(value: number) => `$${value}`}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="cost" radius={[8, 8, 8, 8]} barSize={40}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--foreground)' : 'var(--primary)'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Transit Chart */}
                            <div className="bg-card rounded-[32px] border border-border p-8 shadow-sm glass-card">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-bold text-foreground uppercase text-xs tracking-widest flex items-center gap-2">
                                        <Activity size={16} className="text-blue-500" /> Transit Impact (Days)
                                    </h3>
                                    <span className={cn(
                                        "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase",
                                        simulation?.delta?.transit_days > 0 ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                                    )}>
                                        {simulation?.delta?.transit_days > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                        {simulation?.delta?.transit_days > 0 ? `+${simulation.delta.transit_days}` : simulation?.delta?.transit_days} Days
                                    </span>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f5" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                            <Bar dataKey="transit" radius={[0, 8, 8, 0]} barSize={30}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--foreground)' : 'var(--muted-foreground)'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Optimization Suggestions */}
                        <div className="bg-card rounded-[32px] border border-border p-8 shadow-sm overflow-hidden relative glass-card">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Zap size={100} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                <Activity className="text-primary" /> Multi-Agent Optimization Engine
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {(optimizations?.all_strategies ?? []).map((strat: any, i: number) => (
                                    <div key={i} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-3 group hover:border-blue-500 transition-all cursor-default relative overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-black text-foreground uppercase text-xs tracking-tight">{strat.strategy}</h4>
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                        </div>
                                        <p className="text-xs text-neutral-600 font-medium leading-relaxed">{strat.details}</p>
                                        <div className="pt-3 border-t border-neutral-200">
                                            <span className="text-[10px] font-black text-blue-600 uppercase italic">{strat.impact}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-8 p-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                Apply Scenario Parameters to Live Network <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
