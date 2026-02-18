"use client"

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
    Line,
    LineChart
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SavingsTrendsChart({ data }: { data: any[] }) {
    return (
        <Card className="border-border glass-card shadow-lg hover:shadow-primary/5 transition-all">
            <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Monthly ROI Realization</CardTitle>
                <CardDescription>Tracked savings from procurement optimizations</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/20" />
                        <XAxis
                            dataKey="month"
                            fontSize={11}
                            fontWeight="bold"
                            tickLine={false}
                            axisLine={false}
                            stroke="currentColor"
                            className="text-muted-foreground"
                        />
                        <YAxis
                            fontSize={11}
                            fontWeight="bold"
                            tickLine={false}
                            axisLine={false}
                            stroke="currentColor"
                            className="text-muted-foreground"
                            tickFormatter={(val) => `$${val / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="savings"
                            stroke="#2563eb"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorSavings)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export function CarrierPerformanceChart({ data }: { data: any[] }) {
    return (
        <Card className="border-border glass-card shadow-lg hover:shadow-primary/5 transition-all">
            <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Carrier Reliability Snapshot</CardTitle>
                <CardDescription>On-time delivery performance vs Volume</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/20" />
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
                            fontSize={11}
                            fontWeight="bold"
                            tickLine={false}
                            axisLine={false}
                            stroke="currentColor"
                            className="text-muted-foreground"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '12px',
                                border: '1px solid var(--border)'
                            }}
                        />
                        <Bar dataKey="reliability" radius={[6, 6, 0, 0]} barSize={40}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.reliability > 95 ? '#10b981' : entry.reliability > 90 ? '#3b82f6' : '#f59e0b'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
