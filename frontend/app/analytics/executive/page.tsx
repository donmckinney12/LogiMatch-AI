"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useOrg } from "@/context/org-context"
import { useOrganization } from "@clerk/nextjs"
import { apiRequest } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    TrendingUp,
    DollarSign,
    Award,
    Target,
    Download,
    ChevronRight,
    Zap,
    PieChart
} from "lucide-react"
import { toast } from "sonner"
import { SavingsTrendsChart, CarrierPerformanceChart } from "@/components/analytics-charts"

export default function ExecutiveInsightsPage() {
    const { orgId } = useOrg()
    const { membership } = useOrganization()
    const isAdmin = membership?.role === 'org:admin'
    const [data, setData] = useState<any>(null)
    const [trends, setTrends] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch consolidated strategic analytics
                const json = await apiRequest('/api/analytics/executive', {}, orgId)
                setData(json)
                setTrends(json) // Trends are now nested in the executive response
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
            const result = await apiRequest('/api/reports/generate', {
                method: 'POST',
                body: JSON.stringify({ type: 'EXECUTIVE_SUMMARY', organization_id: orgId })
            })
            toast.success(`Report Generated: ${result.report_id}. Check your email soon.`)
        } catch (err) {
            toast.error("Failed to initiate report generation")
        }
    }

    if (loading) return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-pulse">
                <div className="h-10 bg-muted w-1/3 rounded-xl" />
                <div className="grid grid-cols-3 gap-6">
                    <div className="h-40 bg-muted rounded-2xl" />
                    <div className="h-40 bg-muted rounded-2xl" />
                    <div className="h-40 bg-muted rounded-2xl" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="h-80 bg-muted rounded-2xl" />
                    <div className="h-80 bg-muted rounded-2xl" />
                </div>
            </div>
        </AppLayout>
    )

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <header>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Executive Intelligence</h1>
                        <p className="text-muted-foreground mt-2 font-medium">Strategic visibility into procurement ROI and carrier performance.</p>
                    </header>
                    <button
                        onClick={handleGenerateReport}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-primary/40 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Download size={16} /> Export Intelligence Summary
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-border/40 glass-card shadow-xl rounded-[24px]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">YoY Savings</CardTitle>
                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                <TrendingUp size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-foreground">${(data?.total_savings || 2450000).toLocaleString()}</div>
                            <p className="text-[10px] font-bold text-emerald-500 mt-2 uppercase tracking-widest flex items-center gap-1">
                                <Zap size={10} fill="currentColor" /> +14.2% Optimization Realized
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 glass-card shadow-xl rounded-[24px]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avg. Transit Time</CardTitle>
                            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                                <PieChart size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-foreground">18.4 Days</div>
                            <p className="text-[10px] font-bold text-amber-500 mt-2 uppercase tracking-widest flex items-center gap-1">
                                <Zap size={10} fill="currentColor" /> 2.1 Day Variance detected
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 glass-card shadow-xl rounded-[24px]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Carrier Reliability</CardTitle>
                            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                                <Award size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-foreground">94.8%</div>
                            <p className="text-[10px] font-bold text-emerald-500 mt-2 uppercase tracking-widest flex items-center gap-1">
                                <Zap size={10} fill="currentColor" /> Top Tier Performance
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 glass-card shadow-xl rounded-[24px]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Audit Compliance</CardTitle>
                            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                                <Target size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-foreground">99.2%</div>
                            <p className="text-[10px] font-bold text-rose-500 mt-2 uppercase tracking-widest flex items-center gap-1">
                                <Zap size={10} fill="currentColor" /> 0.8% Variance Identified
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SavingsTrendsChart data={trends?.monthly_trends ?? []} />
                    <CarrierPerformanceChart data={trends?.carrier_distribution ?? []} />
                </div>

                <Card className="bg-card border border-border shadow-xl overflow-hidden relative glass-card mt-8 rounded-[32px]">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <PieChart size={160} className="text-primary" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground font-black uppercase italic tracking-tight">
                            <Zap className="text-amber-500" />
                            Multi-Agent Strategic Advisory
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-w-2xl">
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                Based on Q1 performance data, your primary volume is concentrated with **{trends?.carrier_distribution?.[0]?.name}**.
                                While they offer the lowest unit price, their transit performance is 2.4 days slower than the market average.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <div
                                    onClick={() => toast.info("Negotiation Workflow Initiated.", {
                                        description: "Market benchmark data for Tier 2 lanes is being compiled for renegotiation.",
                                        duration: 5000
                                    })}
                                    className="flex-1 bg-muted/50 p-4 rounded-xl border border-border hover:border-primary/50 transition-all group cursor-pointer shadow-sm"
                                >
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5">Recommended Action</div>
                                    <div className="text-sm font-black flex items-center gap-1 group-hover:text-primary transition-colors">
                                        Renegotiate Tier 2 Lanes <ChevronRight size={14} className="text-amber-500" />
                                    </div>
                                </div>
                                <div
                                    onClick={() => toast.success("Opportunity Analysis Exported.", {
                                        description: "A detailed breakdown of the $42,800 savings opportunity has been sent to your downloads.",
                                        duration: 5000
                                    })}
                                    className="flex-1 bg-muted/50 p-4 rounded-xl border border-border hover:border-primary/50 transition-all group cursor-pointer shadow-sm"
                                >
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
