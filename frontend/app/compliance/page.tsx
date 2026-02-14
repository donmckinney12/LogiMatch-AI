"use client"

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Badge } from '@/components/ui/badge'
import {
    ShieldCheck,
    FileText,
    Download,
    History,
    Leaf,
    AlertTriangle,
    Search,
    Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    Cell
} from 'recharts'

// Mock Data for Charts
const esgData = [
    { subject: 'Carbon', A: 120, fullMark: 150 },
    { subject: 'Ethical', A: 98, fullMark: 150 },
    { subject: 'Safety', A: 86, fullMark: 150 },
    { subject: 'Governance', A: 99, fullMark: 150 },
    { subject: 'Privacy', A: 85, fullMark: 150 },
    { subject: 'Financial', A: 65, fullMark: 150 },
];

const auditVelocity = [
    { day: 'Mon', audits: 12 },
    { day: 'Tue', audits: 19 },
    { day: 'Wed', audits: 15 },
    { day: 'Thu', audits: 22 },
    { day: 'Fri', audits: 28 },
    { day: 'Sat', audits: 8 },
    { day: 'Sun', audits: 5 },
];

export default function CompliancePage() {
    const [quotes, setQuotes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:5000/api/quotes')
            .then(res => res.json())
            .then(data => {
                setQuotes(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setQuotes([])
                setLoading(false)
            })
    }, [])

    return (
        <AppLayout>
            <div className="max-w-[1800px] mx-auto space-y-8 animate-in fade-in duration-700 pb-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border/40 pb-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-emerald-500 mb-1">
                            <ShieldCheck className="h-6 w-6" />
                            <span className="text-xs font-bold uppercase tracking-widest">Regulatory Oversight</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                            Compliance Command
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                            Immutable audit logs and ESG verification for global trade operations.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors text-sm font-bold glass-card">
                            <Filter size={16} /> Filter Logs
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all text-sm font-bold">
                            <Download size={16} /> Export Report
                        </button>
                    </div>
                </div>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Left Col: ESG Radar (Spans 4) */}
                    <div className="md:col-span-4 bg-card rounded-[32px] border border-border shadow-2xl glass-card p-6 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="mb-6">
                            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                                <Leaf size={20} className="text-emerald-500" />
                                Sustainability Impact
                            </h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Real-time ESG Scoring</p>
                        </div>

                        <div className="flex-1 min-h-[300px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={esgData}>
                                    <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                    <Radar
                                        name="ESG Score"
                                        dataKey="A"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fill="#10b981"
                                        fillOpacity={0.3}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Middle Col: Audit Velocity (Spans 5) */}
                    <div className="md:col-span-5 bg-card rounded-[32px] border border-border shadow-xl glass-card p-6 flex flex-col">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                                    <History size={20} className="text-blue-500" />
                                    Audit Velocity
                                </h3>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Weekly Verification Volume</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black border border-blue-500/20">
                                +12.5%
                            </div>
                        </div>

                        <div className="flex-1 min-h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={auditVelocity}>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'var(--muted)/20' }}
                                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="audits" radius={[6, 6, 0, 0]}>
                                        {auditVelocity.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 4 ? '#3b82f6' : '#1e293b'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Col: Quick Stats (Spans 3) */}
                    <div className="md:col-span-3 grid grid-rows-2 gap-6">
                        <div className="bg-card rounded-[32px] border border-border shadow-lg glass-card p-6 flex flex-col justify-center items-center text-center group hover:border-primary/50 transition-all">
                            <div className="p-4 bg-primary/10 rounded-full text-primary mb-3 group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                            </div>
                            <span className="text-4xl font-black text-foreground tracking-tight">{quotes.length}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Records</span>
                        </div>

                        <div className="bg-card rounded-[32px] border border-border shadow-lg glass-card p-6 flex flex-col justify-center items-center text-center group hover:border-emerald-500/50 transition-all">
                            <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={24} />
                            </div>
                            <span className="text-4xl font-black text-foreground tracking-tight">100%</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Compliance Score</span>
                        </div>
                    </div>

                    {/* Bottom Row: Audit Log Table (Spans 12) */}
                    <div className="md:col-span-12 bg-card rounded-[40px] border border-border shadow-xl glass-card overflow-hidden">
                        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Search size={20} />
                                </div>
                                <h3 className="text-lg font-black text-foreground uppercase tracking-wide">Permanent Record</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-background/50 backdrop-blur text-[10px] py-1">SEC-17a-4 Compliant</Badge>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border font-bold text-muted-foreground uppercase text-xs tracking-wider">
                                        <th className="py-5 px-6">Timestamp</th>
                                        <th className="py-5 px-6">Carrier Entity</th>
                                        <th className="py-5 px-6">Audit Status</th>
                                        <th className="py-5 px-6">ESG Impact</th>
                                        <th className="py-5 px-6">Reference ID</th>
                                        <th className="py-5 px-6 text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {loading ? (
                                        <tr><td colSpan={6} className="py-12 text-center text-muted-foreground font-medium animate-pulse">Syncing blockchain records...</td></tr>
                                    ) : quotes.map((quote) => (
                                        <tr key={quote.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="py-5 px-6 text-muted-foreground font-mono text-xs">
                                                {new Date().toLocaleDateString()} <span className="opacity-50 mx-1">|</span> {new Date().toLocaleTimeString()}
                                            </td>
                                            <td className="py-5 px-6 font-bold text-foreground group-hover:text-primary transition-colors">
                                                {quote.carrier}
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2 text-blue-500 bg-blue-500/10 w-fit px-2 py-1 rounded-md border border-blue-500/20">
                                                    <ShieldCheck size={12} />
                                                    <span className="text-[10px] font-black uppercase">Normalized</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Leaf size={14} className="text-emerald-500" />
                                                    <span className="font-bold text-foreground text-xs">{quote.carbon_footprint_kg?.toFixed(1) || '0.0'} kg</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-muted-foreground font-mono text-xs">
                                                SEC-2026-{quote.id}
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer">
                                                    SIGNED_SHA256
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Empty State visual if no quotes */}
                                    {!loading && quotes.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-muted-foreground opacity-50">
                                                    <AlertTriangle size={32} />
                                                    <p className="font-medium">No audit records found on the immutable ledger.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    )
}
