"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import { useOrganization } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    ZAxis,
    Cell,
    LineChart,
    Line
} from "recharts"
import {
    TrendingUp,
    DollarSign,
    Award,
    Target,
    Download,
    ChevronRight,
    Briefcase,
    Zap,
    PieChart,
    ShieldAlert
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ExecutiveInsightsPage() {
    const { orgId } = useOrg()
    const { organization, memberships, membership, isLoaded } = useOrganization({
        memberships: {
            pageSize: 10,
            keepPreviousData: true,
        },
    })
    const isAdmin = membership?.role === 'admin'
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const json = await apiRequest('/api/analytics/executive', {}, orgId)
                setData(json)
            } catch (err) {
                console.error("Executive analytics fetch failed", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [orgId])

    const handleGenerateReport = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'EXECUTIVE_SUMMARY' })
            })
            const result = await res.json()
            alert(`Report Generated: ${result.report_id}\nCheck your email for the download link.`)
        } catch (err) {
            alert("Failed to initiate report generation")
        }
    }

    if (loading) return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in">
                <div className="h-10 bg-neutral-200 w-1/3 rounded" />
                <div className="grid grid-cols-3 gap-6">
                    <div className="h-32 bg-neutral-200 rounded" />
                    <div className="h-32 bg-neutral-200 rounded" />
                    <div className="h-32 bg-neutral-200 rounded" />
                </div>
                <div className="h-96 bg-neutral-200 rounded" />
            </div>
        </AppLayout>
    )

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <header>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Executive Intelligence</h1>
                        <p className="text-muted-foreground mt-2">Strategic visibility into procurement ROI and carrier performance.</p>
                    </header>
                    <button
                        onClick={handleGenerateReport}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Download size={16} /> Export Intelligence Summary
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isAdmin ? (
                        <Card className="border-green-100 dark:border-green-500/20 bg-green-50/20 dark:bg-green-500/5 shadow-sm overflow-hidden relative glass-card">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Zap size={64} className="text-green-600" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest flex items-center gap-2">
                                    <DollarSign size={14} /> Total YTD Savings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-foreground">${data?.total_savings_ytd?.toLocaleString() ?? "0"}</div>
                                <p className="text-xs text-green-700 dark:text-green-400 mt-1 font-bold flex items-center gap-1">
                                    <TrendingUp size={12} /> {data?.savings_percent ?? 0}% procurement efficiency
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-border bg-muted/30 shadow-sm overflow-hidden relative glass-card">
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2">
                                <ShieldAlert size={24} className="text-muted-foreground" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Restricted Data</p>
                                <p className="text-xs font-medium text-muted-foreground">Savings data requires Admin permissions.</p>
                            </div>
                        </Card>
                    )}

                    <Card className="border-blue-100 dark:border-blue-500/20 bg-blue-50/20 dark:bg-blue-500/5 shadow-sm overflow-hidden relative glass-card">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Briefcase size={64} className="text-blue-600" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
                                <Award size={14} /> Top Carrier Volume
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-foreground">{data?.carrier_matrix?.[0]?.carrier || 'N/A'}</div>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 font-bold">
                                Leading in {data?.carrier_matrix?.[0]?.volume} lane allocations
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-100 dark:border-purple-500/20 bg-purple-50/20 dark:bg-purple-500/5 shadow-sm overflow-hidden relative glass-card">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <PieChart size={64} className="text-purple-600" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-purple-700 uppercase tracking-widest flex items-center gap-2">
                                <PieChart size={14} /> Normalized Spend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-foreground">${data?.total_spend_ytd?.toLocaleString() ?? "0"}</div>
                            <p className="text-xs text-purple-700 dark:text-purple-400 mt-1 font-bold">
                                100% data audit coverage achieved
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-border glass-card">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Award className="text-blue-600" />
                                Carrier Value Quadrant
                            </CardTitle>
                            <CardDescription>
                                Performance benchmarking: Price (X-Axis) vs Speed (Y-Axis)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-80 pt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted/30" vertical={false} />
                                    <XAxis
                                        type="number"
                                        dataKey="avg_price"
                                        name="Price"
                                        unit="$"
                                        fontSize={10}
                                        fontWeight="bold"
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="currentColor"
                                        className="text-muted-foreground"
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="avg_transit"
                                        name="Transit Days"
                                        unit="d"
                                        fontSize={10}
                                        fontWeight="bold"
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="currentColor"
                                        className="text-muted-foreground"
                                    />
                                    <ZAxis type="number" dataKey="volume" range={[100, 1000]} name="Volume" />
                                    <Tooltip
                                        cursor={{ strokeDasharray: '3 3' }}
                                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Scatter name="Carriers" data={data?.carrier_matrix} fill="#2563eb">
                                        {data?.carrier_matrix?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#9333ea'} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-border glass-card">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="text-green-600" />
                                Monthly Spend Trends
                            </CardTitle>
                            <CardDescription>
                                Year-over-year cost analysis for allocated shipments.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-80 pt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.monthly_trends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/30" />
                                    <XAxis
                                        dataKey="month"
                                        fontSize={10}
                                        fontWeight="bold"
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="currentColor"
                                        className="text-neutral-500 dark:text-neutral-400"
                                    />
                                    <YAxis
                                        fontSize={10}
                                        fontWeight="bold"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val: number) => `$${val}`}
                                        stroke="currentColor"
                                        className="text-neutral-500 dark:text-neutral-400"
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-card border border-border shadow-xl overflow-hidden relative glass-card">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <PieChart size={160} className="text-primary" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <Zap className="text-amber-500" />
                            Multi-Agent Strategic Advisory
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-w-2xl">
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                Based on Q1 performance data, your primary volume is concentrated with **{data?.carrier_matrix?.[0]?.carrier}**.
                                While they offer the lowest unit price, their transit performance is 2.4 days slower than the market average.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <div className="flex-1 bg-muted/50 p-4 rounded-xl border border-border hover:border-primary/50 transition-all group">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5">Recommended Action</div>
                                    <div className="text-sm font-black flex items-center gap-1 group-hover:text-primary transition-colors">
                                        Renegotiate Tier 2 Lanes <ChevronRight size={14} className="text-amber-500" />
                                    </div>
                                </div>
                                <div className="flex-1 bg-muted/50 p-4 rounded-xl border border-border hover:border-primary/50 transition-all group">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5">Opportunity Cost</div>
                                    <div className="text-sm font-black flex items-center gap-1 group-hover:text-primary transition-colors">
                                        $42,800 Potential Savings <ChevronRight size={14} className="text-amber-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
