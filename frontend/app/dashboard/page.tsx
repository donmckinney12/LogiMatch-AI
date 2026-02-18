"use client"
// v5.0_DEPLOY_SIG_771

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useDropzone } from 'react-dropzone'
import {
    Upload,
    Loader2,
    TrendingUp,
    Globe,
    Zap,
    LayoutGrid,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComparisonTable } from '@/components/comparison-table'
import { AppLayout } from '@/components/app-layout'
import { UsageWidget } from '@/components/usage-widget'
import { AtlasAdvice } from "@/components/atlas-advice"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import { toast } from "sonner"
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data for Hero Chart
const activityData = [
    { time: '08:00', quotes: 12, volume: 4500 },
    { time: '10:00', quotes: 18, volume: 6200 },
    { time: '12:00', quotes: 15, volume: 5100 },
    { time: '14:00', quotes: 25, volume: 8900 },
    { time: '16:00', quotes: 30, volume: 9200 },
    { time: '18:00', quotes: 22, volume: 7400 },
];

export default function DashboardPage() {
    const { user } = useUser()
    const { orgId } = useOrg()
    const [loading, setLoading] = useState(false)
    const [quotes, setQuotes] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)
    const [normalizationEnabled, setNormalizationEnabled] = useState(false)

    // Fetch initial quotes from DB
    useEffect(() => {
        fetchQuotes()
    }, [orgId])

    const fetchQuotes = async () => {
        try {
            const data = await apiRequest('/api/quotes', {}, orgId)
            setQuotes(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch history", err)
            setQuotes([])
        }
    }

    const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
        setLoading(true)
        setError(null)

        if (fileRejections.length > 0) {
            toast.error("File rejected", {
                description: "LogiMatch AI currently only supports PDF freight quotes. Please check your file format."
            })
            setLoading(false)
            return
        }

        if (acceptedFiles.length === 0) {
            setLoading(false)
            return
        }

        for (const file of acceptedFiles) {
            const toastId = toast.loading(`Analyzing ${file.name}...`, {
                description: "Our enterprise engine is extracting rate data."
            })

            const formData = new FormData()
            formData.append('file', file)
            if (user?.id) {
                formData.append('user_id', user.id)
            }

            try {
                await apiRequest('/api/extract', {
                    method: 'POST',
                    body: formData,
                }, orgId)

                toast.success(`Success: ${file.name}`, {
                    id: toastId,
                    description: "Extraction complete. Quote matrix updated."
                })

                await fetchQuotes()
            } catch (err: any) {
                console.error("Upload Error:", err)
                toast.error(`Analysis Failed: ${file.name}`, {
                    id: toastId,
                    description: err.message || "The AI encountered an issue processing this document."
                })
                setError(`Failed to process ${file.name}: ${err.message}`)
            }
        }
        setLoading(false)
    }, [user, orgId])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/x-pdf': ['.pdf']
        },
        multiple: true
    })

    return (
        <AppLayout>
            <div className="relative min-h-screen">
                <div className="bg-mesh opacity-50" aria-hidden="true" />
                <div className="bg-grid opacity-20" aria-hidden="true" />

                <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em] animate-in slide-in-from-left-4">
                                <Zap size={12} fill="currentColor" />
                                <span>Mission Control Beta v5.0</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground italic uppercase italic leading-none animate-in slide-in-from-left-4 [animation-delay:100ms]">
                                Mission <span className="text-primary">Control.</span>
                            </h1>
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground animate-in slide-in-from-left-4 [animation-delay:200ms]">
                                <Link href="/portal" className="hover:text-primary transition-colors">Portal</Link>
                                <ChevronRight size={14} className="opacity-50" />
                                <span className="text-foreground font-black uppercase tracking-widest text-[10px]">Active Session</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-right-4">
                            <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full shadow-sm glass-card w-full md:w-auto">
                                <button
                                    onClick={() => setNormalizationEnabled(false)}
                                    className={cn(
                                        "flex-1 md:flex-none px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all",
                                        !normalizationEnabled ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    Original
                                </button>
                                <button
                                    onClick={() => setNormalizationEnabled(true)}
                                    className={cn(
                                        "flex-1 md:flex-none px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all",
                                        normalizationEnabled ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    Normalized USD
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                        <div className="md:col-span-12">
                            <AtlasAdvice quotes={quotes} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {/* Main Intelligence Panel */}
                        <div className="lg:col-span-8 p-6 md:p-10 rounded-[40px] border border-white/10 shadow-3xl glass-card relative overflow-hidden group min-h-[400px]">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-primary/20 rounded-[20px] text-primary shadow-xl ring-1 ring-primary/30">
                                            <Globe size={24} className="animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-foreground uppercase tracking-wide">Savings Audit Matrix</h3>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Neural Leak Detection: ACTIVE</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Real-time
                                    </div>
                                </div>

                                <div className="flex-1 w-full min-h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={activityData}>
                                            <defs>
                                                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip
                                                cursor={{ stroke: 'rgba(59, 130, 246, 0.4)', strokeWidth: 2, strokeDasharray: '6 6' }}
                                                contentStyle={{ backgroundColor: 'rgba(21, 25, 33, 0.9)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}
                                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="volume"
                                                stroke="#3b82f6"
                                                strokeWidth={6}
                                                fillOpacity={1}
                                                fill="url(#colorActivity)"
                                                strokeLinecap="round"
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Usage & Quick Stats */}
                        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
                            <div className="rounded-[40px] border border-white/10 shadow-2xl glass-card overflow-hidden relative p-2">
                                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-purple-600 neon-glow" />
                                <div className="px-2 py-6">
                                    <UsageWidget />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 lg:gap-6">
                                <div className="p-6 md:p-8 rounded-[32px] border border-white/5 glass-card shadow-xl flex flex-col justify-center items-center text-center hover:border-primary/40 hover:scale-[1.05] transition-all relative group">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                                    <span className="text-4xl md:text-5xl font-black text-foreground mb-1 drop-shadow-lg">{quotes.length}</span>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Active Quotes</span>
                                </div>
                                <div className="p-6 md:p-8 rounded-[32px] border border-white/5 glass-card shadow-xl flex flex-col justify-center items-center text-center hover:border-emerald-500/40 hover:scale-[1.05] transition-all relative group">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                                    <div className="flex items-center gap-1 text-emerald-500 mb-1">
                                        <TrendingUp size={24} />
                                        <span className="text-2xl md:text-3xl font-black">12%</span>
                                    </div>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Procurement ROI</span>
                                </div>
                            </div>
                        </div>

                        {/* Upload Zone */}
                        <div className="lg:col-span-12">
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "relative border-2 border-dashed rounded-[48px] p-12 md:p-20 text-center cursor-pointer transition-all duration-500 group overflow-hidden bg-white/5 hover:bg-white/10",
                                    isDragActive
                                        ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_80px_rgba(59,130,246,0.3)]"
                                        : "border-white/10 hover:border-primary/50"
                                )}
                            >
                                <div className="absolute bg-grid opacity-10" />
                                <input {...getInputProps()} />
                                <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
                                    <div className={cn(
                                        "p-6 md:p-10 rounded-[32px] bg-background border border-white/10 shadow-3xl transform transition-all duration-700",
                                        isDragActive ? "scale-125 rotate-12 shadow-primary/40" : "group-hover:scale-110 group-hover:-rotate-3"
                                    )}>
                                        {loading ? <Loader2 size={40} className="animate-spin text-primary" /> : <Upload size={40} className="text-primary" />}
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tighter italic">
                                            {isDragActive ? "Release to Analyze" : "Ingest Manifest Data"}
                                        </h3>
                                        <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto opacity-70">
                                            Drop PDF freight quotes here to activate neural extraction. LogiMatch AI will instantly <span className="text-primary font-bold">normalize</span> and benchmark your rates.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="lg:col-span-12">
                            <div className="bg-card rounded-[48px] border border-white/10 shadow-4xl glass-card overflow-hidden mb-20 animate-in slide-in-from-bottom-8">
                                <div className="p-8 md:p-10 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center bg-white/5 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/20 rounded-2xl text-primary shadow-lg">
                                            <LayoutGrid size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-foreground uppercase tracking-wide">Carrier Quote Matrix</h3>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Global Synchronization: ON</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-4 py-2 bg-background/50 backdrop-blur-xl rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                                            Production Environment
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <ComparisonTable data={quotes} normalizationEnabled={normalizationEnabled} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
