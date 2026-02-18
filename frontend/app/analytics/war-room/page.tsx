"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import {
    ShieldAlert,
    Zap,
    TrendingUp,
    DollarSign,
    Activity,
    Globe,
    Briefcase,
    ChevronRight,
    Crosshair,
    Radio,
    AlertCircle,
    Trophy,
    ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts"
import { toast } from "sonner"

const healthData = [
    { time: '00:00', health: 98 },
    { time: '04:00', health: 95 },
    { time: '08:00', health: 99 },
    { time: '12:00', health: 82 },
    { time: '16:00', health: 94 },
    { time: '20:00', health: 97 },
    { time: '23:59', health: 98 },
]

export default function WarRoomPage() {
    const [mounted, setMounted] = useState(false)
    const [status, setStatus] = useState("OPTIMAL")

    useEffect(() => {
        setMounted(true)
        // Simulate a status change
        const timer = setTimeout(() => setStatus("VOLATILE"), 5000)
        return () => clearTimeout(timer)
    }, [])

    if (!mounted) return null

    return (
        <AppLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* HUD Header */}
                <div className="relative overflow-hidden p-8 rounded-[40px] border border-primary/20 bg-card/50 backdrop-blur-3xl shadow-2xl shadow-primary/5">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Crosshair size={300} className="text-primary animate-pulse" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                                    <Radio size={14} className="text-primary animate-pulse" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live System Feed</span>
                                </div>
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1 border rounded-full transition-all duration-500",
                                    status === "OPTIMAL"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                        : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                )}>
                                    <Activity size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
                                </div>
                            </div>
                            <h1 className="text-5xl font-black text-foreground tracking-tighter leading-none">
                                EXECUTIVE <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">WAR ROOM</span>
                            </h1>
                            <p className="max-w-xl text-muted-foreground font-medium text-lg leading-relaxed">
                                Mission critical oversight. Synchronizing global risk telemetry with procurement ROI and financial audit leakage.
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Estimated Quarterly Savings</div>
                            <div className="text-5xl font-black text-foreground tracking-tighter neon-text">
                                $12.4M
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                                <TrendingUp size={16} /> +18.2% vs Last Quarter
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Intelligence Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* System Health Pulse */}
                    <div className="lg:col-span-2 p-8 rounded-[40px] border border-border bg-card/30 backdrop-blur-xl shadow-xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity size={100} className="text-primary" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Supply Chain Resilience Velocity</h3>
                                <p className="text-sm text-muted-foreground">Aggregated network health across all lanes & vendors.</p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-primary">94.2%</span>
                                <p className="text-[10px] font-black text-emerald-500 uppercase">Above Baseline</p>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={healthData}>
                                    <defs>
                                        <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="white" strokeOpacity={0.05} />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 10 }}
                                    />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'black', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        labelStyle={{ color: 'white', fontWeight: 800 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="health"
                                        stroke="#2563eb"
                                        strokeWidth={4}
                                        fill="url(#colorHealth)"
                                        className="neon-glow"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Threat Assessment Vertical */}
                    <div className="space-y-8">
                        <div className="p-8 rounded-[40px] border border-red-500/20 bg-red-500/5 backdrop-blur-xl shadow-xl shadow-red-500/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2 text-red-500 uppercase text-xs tracking-widest">
                                    <ShieldAlert size={16} /> Exposure Matrix
                                </h3>
                                <button className="text-xs font-bold text-muted-foreground hover:text-foreground">View Map</button>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: "Port Strike Exposure", value: "$4.1M", risk: "HIGH", color: "text-red-500" },
                                    { label: "Transit Volatility", value: "$1.8M", risk: "MID", color: "text-amber-500" },
                                    { label: "Audit Leakage", value: "$640K", risk: "LOW", color: "text-emerald-500" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase">{item.label}</p>
                                            <p className="text-lg font-black text-foreground">{item.value}</p>
                                        </div>
                                        <div className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>
                                            {item.risk} RISK
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[40px] border border-primary/20 bg-primary/5 backdrop-blur-xl shadow-xl space-y-6">
                            <h3 className="font-bold flex items-center gap-2 text-primary uppercase text-xs tracking-widest">
                                <Zap size={16} /> Strategic Opportunities
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                AI has identified a lane reconfiguration that could yield **$142K/mo** in savings across the LATAM corridor.
                            </p>
                            <button
                                onClick={() => {
                                    const promise = new Promise((resolve) => setTimeout(() => resolve({ name: 'LATAM Optimization' }), 2000));
                                    toast.promise(promise, {
                                        loading: 'Analyzing carrier networks and lane variance...',
                                        success: (data: any) => {
                                            return `Success: ${data.name} active. $142K/mo in savings identified.`;
                                        },
                                        error: 'Optimization engine timed out.',
                                    });
                                }}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase hover:opacity-90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                Launch Optimization Solver <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secondary Ticker Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Network Reliability", value: "98.2%", icon: Trophy, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Carrier Compliance", value: "84.5%", icon: ShieldAlert, color: "text-purple-500", bg: "bg-purple-500/10" },
                        { label: "Global Presence", value: "142 Cities", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { label: "Active Tenders", value: "12 Events", icon: Briefcase, color: "text-amber-500", bg: "bg-amber-500/10" },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-[32px] border border-border bg-card/30 backdrop-blur-md flex items-center justify-between group hover:border-primary/40 transition-all cursor-default">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{stat.value}</p>
                            </div>
                            <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tactical Action Board */}
                <div className="p-10 rounded-[48px] border border-border bg-card/20 backdrop-blur-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <DollarSign size={200} />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-6 max-w-2xl">
                            <h3 className="text-3xl font-black text-foreground">
                                High-Priority <span className="text-primary">Financial Disruptions</span>
                            </h3>
                            <p className="text-muted-foreground font-medium text-lg">
                                Carrier **Apex Global** has submitted 14 invoices with a variance 12% above quoted rates. Total potential overcharge: **$84,200**.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => {
                                        const promise = new Promise((resolve) => setTimeout(() => resolve({ caseId: 'V-882' }), 2500));
                                        toast.promise(promise, {
                                            loading: 'Filing variance dispute with Apex Global...',
                                            success: (data: any) => {
                                                return `Case ${data.caseId} Created. Carrier notified for rate reconciliation.`;
                                            },
                                            error: 'Failed to initiate conflict resolution.',
                                        });
                                    }}
                                    className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase hover:opacity-90 shadow-xl shadow-primary/30 transition-all active:scale-95"
                                >
                                    Initiate Conflict Resolution
                                </button>
                                <button
                                    onClick={() => {
                                        toast.info("Preparing audit trail...", {
                                            description: "Compiling variance logs and rate references."
                                        })
                                        setTimeout(() => toast.success("Download ready"), 2000)
                                    }}
                                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase hover:bg-white/10 transition-all"
                                >
                                    Download Audit Trail
                                </button>
                            </div>
                        </div>

                        <div className="w-full md:w-auto mt-4 md:mt-0">
                            <div className="p-8 rounded-[40px] bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 min-w-[280px]">
                                <Trophy className="mx-auto text-emerald-500 mb-4" size={48} />
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Total Resolved Leakage</div>
                                <div className="text-4xl font-black text-foreground tracking-tighter">$4.2M</div>
                                <p className="text-xs font-bold text-muted-foreground">This Fiscal Year</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .neon-text {
                    text-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
                }
                .neon-glow {
                    filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.4));
                }
            `}</style>
        </AppLayout>
    )
}
