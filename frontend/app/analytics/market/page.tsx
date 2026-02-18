"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, Info, AlertTriangle, Lightbulb, ArrowUpRight, Gauge } from "lucide-react"

export default function MarketIntelligencePage() {
    const { orgId } = useOrg()
    const [marketData, setMarketData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await apiRequest('/api/analytics/market', {}, orgId)
                setMarketData(data)
            } catch (err) {
                console.error("Market fetch failed", err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [orgId])

    if (loading) return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in">
                <div className="h-12 bg-neutral-200 dark:bg-neutral-800 w-1/4 rounded mb-8" />
                <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
        </AppLayout>
    )

    return (
        <AppLayout>
            <div className="space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Market Intelligence</h1>
                    <p className="text-muted-foreground mt-2">Real-time freight indices and predictive rate forecasting.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-blue-100 dark:border-blue-500/20 bg-blue-50/30 dark:bg-blue-500/5 glass-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                <Gauge size={14} /> Global Freight Index
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">${marketData?.current_market_avg}</div>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 font-medium flex items-center gap-1">
                                <TrendingUp size={12} /> +12.4% vs last quarter
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 border-amber-100 dark:border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5 glass-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                <Lightbulb size={14} /> Smart Booking Advisory
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-start gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-700 dark:text-amber-400">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-amber-900 dark:text-amber-100">{marketData?.forecast} TREND DETECTED</p>
                                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed mt-1">
                                    {marketData?.advisory}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <TrendingUp className="text-blue-600" />
                            6-Month Rate Projection (USD)
                        </CardTitle>
                        <CardDescription>
                            Historical averages (solid) vs predictive range (shaded)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketData?.trends}>
                                <defs>
                                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/30" />
                                <XAxis
                                    dataKey="month"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    stroke="currentColor"
                                    className="text-neutral-400 dark:text-neutral-500"
                                />
                                <YAxis
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val: number) => `$${val}`}
                                    stroke="currentColor"
                                    className="text-neutral-400 dark:text-neutral-500"
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="market_avg"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAvg)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="high_estimate"
                                    stroke="transparent"
                                    fill="#2563eb"
                                    fillOpacity={0.05}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                                <Info size={16} className="text-muted-foreground/60" /> Market Volatility Alert
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Port congestion in West Coast hubs is causing a temporary decoupling of spot vs contract rates.
                                <strong className="text-blue-600 dark:text-blue-400">LogiMatch Suggestion</strong>: Prefer contract rates for February/March cycles.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2 dark:text-white">
                                <ArrowUpRight size={16} className="text-green-600" /> Lane Efficiency
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Intra-Asia rates remain stable below $800. Shanghai-to-Vancouver lanes show the highest variability (+18%).
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
