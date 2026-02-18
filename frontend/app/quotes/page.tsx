"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Loader2, TrendingUp, DollarSign, Package } from "lucide-react"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import { AtlasAdvice } from "@/components/atlas-advice"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Quote = {
    id: number
    carrier: string
    total_price: number
    normalized_total_price_usd: number | null
}

export default function AnalysisPage() {
    const { orgId } = useOrg()
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQuotes()
    }, [orgId])

    const fetchQuotes = async () => {
        try {
            const data = await apiRequest('/api/quotes', {}, orgId)
            setQuotes(data)
        } catch (e) {
            console.error("Failed to fetch quotes", e)
        } finally {
            setLoading(false)
        }
    }

    // Aggregations
    const totalSpend = quotes.reduce((sum, q) => sum + (q.normalized_total_price_usd || q.total_price || 0), 0)
    const averageQuote = quotes.length > 0 ? totalSpend / quotes.length : 0

    // Spend by Carrier
    const spendByCarrier = Object.values(quotes.reduce((acc: any, q) => {
        const carrier = q.carrier || "Unknown"
        const amount = q.normalized_total_price_usd || q.total_price || 0
        if (!acc[carrier]) acc[carrier] = { name: carrier, value: 0 }
        acc[carrier].value += amount
        return acc
    }, {}))

    const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a']

    return (
        <AppLayout>
            <div className="space-y-8 animate-in p-2 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Analysis & Insights
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Strategic visibility into your global logistics supply chain.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Synthesizing Logistics Intelligence...</p>
                    </div>
                ) : (
                    <>
                        {/* Atlas Proactive Advice - Highlighted Feature */}
                        <div className="animate-in slide-in-from-bottom-4 duration-700">
                            <AtlasAdvice quotes={quotes} />
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-border bg-card glass-card shadow-lg hover:shadow-primary/5 transition-all group overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Leaked Revenue (Opportunities)</CardTitle>
                                        <DollarSign className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" size={20} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-foreground">${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                    <p className="text-[10px] font-bold text-green-600 mt-2 uppercase tracking-widest">Total Audited Volume</p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card glass-card shadow-lg hover:shadow-primary/5 transition-all group overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Invoices Processed</CardTitle>
                                        <Package className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" size={20} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-foreground">{quotes.length}</div>
                                    <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest">Audit Coverage</p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card glass-card shadow-lg hover:shadow-primary/5 transition-all group overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Carrier Overcharge Risk</CardTitle>
                                        <TrendingUp className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" size={20} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-foreground">${averageQuote.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                    <p className="text-[10px] font-bold text-amber-600 mt-2 uppercase tracking-widest">Average Invoice Value</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="border-border bg-card glass-card shadow-xl overflow-hidden pt-6">
                                <CardHeader className="px-6 pb-2">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest"> Spend Volume by Carrier</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[400px] p-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={spendByCarrier}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }} />
                                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                labelStyle={{ fontWeight: 900, color: 'var(--foreground)' }}
                                                formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Spend']}
                                            />
                                            <Bar dataKey="value" fill="url(#colorBarSpend)" radius={[6, 6, 0, 0]} barSize={40}>
                                                <defs>
                                                    <linearGradient id="colorBarSpend" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                                                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                                                    </linearGradient>
                                                </defs>
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card glass-card shadow-xl overflow-hidden pt-6">
                                <CardHeader className="px-6 pb-2">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest">Carrier Market Share</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[400px] p-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={spendByCarrier}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={110}
                                                fill="#8884d8"
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {spendByCarrier.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                                formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Spend']}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    )
}
