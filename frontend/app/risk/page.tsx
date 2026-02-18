"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { apiRequest } from "@/lib/api-client"
import {
    ShieldAlert,
    AlertTriangle,
    Map,
    Zap,
    Ship,
    ArrowRight,
    Search,
    Filter,
    Activity,
    CloudLightning,
    Anchor,
    Timer,
    CheckCircle,
    XCircle,
    Info,
    Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useOrg } from "@/context/org-context"
import { Globe3D } from "@/components/globe-3d"
import { toast } from "sonner"

export default function RiskIntelligencePage() {
    const { orgId } = useOrg()
    const [disruptions, setDisruptions] = useState<any[]>([])
    const [impactAnalysis, setImpactAnalysis] = useState<any>(null)
    const [selectedDisruption, setSelectedDisruption] = useState<any>(null)
    const [mitigation, setMitigation] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRiskData()
    }, [])

    useEffect(() => {
        if (selectedDisruption) {
            fetchMitigation(selectedDisruption.type, selectedDisruption.location)
        }
    }, [selectedDisruption])

    const fetchRiskData = async () => {
        try {
            const [dData, iData] = await Promise.all([
                apiRequest('/api/risk/disruptions', {}, orgId),
                apiRequest('/api/risk/impact-analysis', {
                    method: 'POST',
                    body: JSON.stringify({ org_id: orgId })
                }, orgId)
            ])

            setDisruptions(dData)
            setImpactAnalysis(iData)
            if (dData.length > 0) setSelectedDisruption(dData[0])
        } catch (err) {
            console.error("Risk Fetch Error:", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchMitigation = async (type: string, location: string) => {
        try {
            const data = await apiRequest(`/api/risk/mitigation?type=${type}&location=${location}`, {}, orgId)
            setMitigation(data)
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="relative">
                        <ShieldAlert size={48} className="text-red-500 animate-pulse" />
                        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full scale-150 animate-pulse" />
                    </div>
                    <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs">Scanning Global Logistics Grid...</span>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest">
                            <Activity size={14} className="animate-pulse" /> Live Resilience Monitor
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            Risk <span className="text-red-600 dark:text-red-500">Intelligence</span> Center
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-2xl">
                            Real-time detection of geopolitical, environmental, and infrastructure disruptions affecting your supply chain.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 p-2 rounded-2xl border border-border shadow-sm glass-card">
                        <div className="px-4 py-2 text-center border-r border-border">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Exposure</p>
                            <p className="text-xl font-black text-red-600 dark:text-red-500">${impactAnalysis?.financial_exposure_usd?.toLocaleString()}</p>
                        </div>
                        <div className="px-4 py-2 text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Quotes at Risk</p>
                            <p className="text-xl font-black text-foreground">{impactAnalysis?.total_at_risk}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Disruption Feed */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-3xl border border-border shadow-sm overflow-hidden glass-card">
                            <div className="p-6 border-b border-border bg-muted/50 flex justify-between items-center">
                                <h3 className="font-bold text-foreground flex items-center gap-2">
                                    <Zap size={18} className="text-amber-500" /> Active Events
                                </h3>
                                <span className="text-[10px] font-black bg-muted text-muted-foreground px-2 py-1 rounded-md">{disruptions.length} LIVE</span>
                            </div>
                            <div className="divide-y divide-neutral-50 max-h-[600px] overflow-y-auto">
                                {disruptions.map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => setSelectedDisruption(d)}
                                        className={cn(
                                            "w-full p-6 text-left transition-all hover:bg-muted group",
                                            selectedDisruption?.id === d.id ? "bg-red-500/10 border-l-4 border-red-500" : ""
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-0.5 rounded uppercase",
                                                d.severity === 'CRITICAL' ? "bg-red-500/10 text-red-700 dark:text-red-400" :
                                                    d.severity === 'HIGH' ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                            )}>
                                                {d.severity}
                                            </span>
                                            <span className="text-[10px] font-bold text-muted-foreground italic">#{d.id}</span>
                                        </div>
                                        <h4 className="font-bold text-foreground group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors uppercase tracking-tight">{d.type}: {d.location}</h4>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{d.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mitigation Strategy */}
                        <div className="bg-card border border-border rounded-3xl p-8 text-foreground space-y-6 relative overflow-hidden glass-card">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <ShieldAlert size={120} className="text-primary dark:text-red-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap size={16} className="text-primary dark:text-blue-400" />
                                    <span className="text-xs font-black text-primary dark:text-blue-400 uppercase">AI Mitigation Engine</span>
                                </div>
                                <h3 className="text-xl font-bold">Recommended Actions</h3>
                                <p className="text-xs text-muted-foreground">Confidence: {mitigation?.confidence_level}</p>
                            </div>

                            <ul className="relative z-10 space-y-4 pt-2">
                                {(mitigation?.recommendations ?? []).map((rec: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed group text-muted-foreground hover:text-foreground transition-colors">
                                        <div className="mt-1 h-5 w-5 rounded-full bg-muted dark:bg-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            {i + 1}
                                        </div>
                                        {rec}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => toast.success("Recovery Protocol Initiated. AI Agents are rerouting impacted shipments.", {
                                    description: "New routes will be visible in the Impact Radar shortly.",
                                    duration: 5000
                                })}
                                className="relative z-10 w-full p-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary/20"
                            >
                                Execute Recovery Protocol <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Impact Radar */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-3xl border border-border shadow-sm p-8 glass-card">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Shipment Impact Radar</h3>
                                    <p className="text-sm text-muted-foreground">Quotes and Allocated POs intersecting with active disruption zones.</p>
                                </div>
                                <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-500 rounded-2xl">
                                    <Map size={24} />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Quote ID</th>
                                            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Carrier</th>
                                            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lane / Corridor</th>
                                            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Threat</th>
                                            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Impact Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                                        {(impactAnalysis?.impact_assessment ?? []).map((q: any) => (
                                            <tr key={q.quote_id} className="group hover:bg-neutral-50/50 transition-colors">
                                                <td className="py-5 font-bold text-foreground">Q-{q.quote_id}</td>
                                                <td className="py-5">
                                                    <span className="text-sm font-medium px-3 py-1 bg-muted rounded-lg text-foreground uppercase tracking-tighter text-[10px] font-black">
                                                        {q.carrier}
                                                    </span>
                                                </td>
                                                <td className="py-5 text-sm text-neutral-600 dark:text-neutral-300 font-medium">{q.lane}</td>
                                                <td className="py-5">
                                                    <div className="flex items-center gap-2">
                                                        {q.threat_type === 'PORT_STRIKE' ? <Anchor size={14} className="text-red-500" /> : <CloudLightning size={14} className="text-amber-500" />}
                                                        <span className="text-[10px] font-black text-foreground uppercase">{q.threat_type.replace('_', ' ')}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 text-center">
                                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                                                        <span className="text-sm font-black text-red-600 dark:text-red-500">{q.impact_score}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {(!impactAnalysis?.impact_assessment || impactAnalysis.impact_assessment.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center">
                                                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4 opacity-20" />
                                                    <p className="font-bold text-neutral-500">No shipments currently intersect with known disruption zones.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Regional Status Grid -> Replaced by 3D Globe Radar */}
                        <div className="rounded-3xl border border-border shadow-sm p-8 glass-card bg-black/20 overflow-hidden relative group">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">Global Risk Radar</h3>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">Scrutiny Mode Active</span>
                                </div>
                            </div>

                            <div className="h-[400px] w-full relative z-0">
                                <Globe3D className="opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 relative z-10">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Active Collisions</p>
                                    <p className="text-xl font-black text-foreground">12</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Reroutes Found</p>
                                    <p className="text-xl font-black text-emerald-500">4 Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </AppLayout>
    )
}
