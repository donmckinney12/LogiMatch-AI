"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Loader2, TrendingUp, DollarSign, Package } from "lucide-react"

type Quote = {
    id: number
    carrier: string
    total_price: number
    normalized_total_price_usd: number | null
}

export default function AnalysisPage() {
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQuotes()
    }, [])

    const fetchQuotes = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/quotes")
            if (res.ok) {
                setQuotes(await res.json())
            }
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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

    return (
        <AppLayout>
            <div className="space-y-8 animate-in">
                <div className="border-b border-border pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Analysis & Insights</h1>
                    <p className="text-muted-foreground">Visualize your logistics spend and carrier performance.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-xl border border-border shadow-sm glass-card">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                                        <DollarSign size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Analyzed Spend</p>
                                        <p className="text-2xl font-bold text-foreground">${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-xl border border-border shadow-sm glass-card">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Quotes Processed</p>
                                        <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/5 shadow-sm glass-card">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Avg. Quote Value</p>
                                        <p className="text-2xl font-bold text-foreground">${averageQuote.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Spend by Carrier Bar Chart */}
                            <div className="p-6 rounded-xl border border-border shadow-sm min-h-[400px] glass-card">
                                <h3 className="text-lg font-semibold text-foreground mb-6">Spend Volume by Carrier</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={spendByCarrier}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                            labelStyle={{ color: 'var(--foreground)' }}
                                            formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Spend']}
                                        />
                                        <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Spend Distribution Pie Chart */}
                            <div className="p-6 rounded-xl border border-border shadow-sm min-h-[400px] glass-card">
                                <h3 className="text-lg font-semibold text-foreground mb-6">Carrier Market Share</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={spendByCarrier}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {spendByCarrier.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                            formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Spend']}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    )
}
