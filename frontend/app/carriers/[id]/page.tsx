"use client"

import { AppLayout } from '@/components/app-layout'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, ShieldCheck, MapPin, Phone, Mail, Award, TrendingUp, AlertTriangle } from 'lucide-react'
import { cn } from "@/lib/utils"

import { apiRequest } from '@/lib/api-client'

export default function CarrierDetailsPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id

    // Mock data fetching - in real app this would fetch by ID
    const [carrier, setCarrier] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await apiRequest('/api/carriers')
                const found = data.find((c: any) => c.id.toString() === id)
                setCarrier(found)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [id])

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AppLayout>
        )
    }

    if (!carrier) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                    <div className="text-muted-foreground">Carrier not found</div>
                    <button onClick={() => router.back()} className="text-primary hover:underline">Go Back</button>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Directory
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl">
                            {carrier.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-foreground tracking-tight">{carrier.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",
                                    carrier.onboarding_status === 'APPROVED'
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                        : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                )}>
                                    {carrier.onboarding_status}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin size={14} /> HQ: {carrier.region || "Global"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 rounded-3xl bg-card border border-border shadow-sm glass-card">
                        <div className="flex items-center gap-3 text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
                            <Award size={14} /> Reliability
                        </div>
                        <div className="text-4xl font-black text-foreground">{carrier.reliability_score}%</div>
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">Top 5% in Region</div>
                    </div>
                    <div className="p-6 rounded-3xl bg-card border border-border shadow-sm glass-card">
                        <div className="flex items-center gap-3 text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
                            <ShieldCheck size={14} /> Compliance
                        </div>
                        <div className="text-4xl font-black text-foreground">{carrier.compliance_score}%</div>
                        <div className="mt-2 text-xs text-muted-foreground">Updated 2 days ago</div>
                    </div>
                    <div className="p-6 rounded-3xl bg-card border border-border shadow-sm glass-card">
                        <div className="flex items-center gap-3 text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
                            <TrendingUp size={14} /> Volume
                        </div>
                        <div className="text-4xl font-black text-foreground">1.2K</div>
                        <div className="mt-2 text-xs text-muted-foreground">Loads this month</div>
                    </div>
                    <div className="p-6 rounded-3xl bg-card border border-border shadow-sm glass-card">
                        <div className="flex items-center gap-3 text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
                            <AlertTriangle size={14} /> Claims
                        </div>
                        <div className="text-4xl font-black text-foreground">0</div>
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">Claim-free streak</div>
                    </div>
                </div>

                {/* Contact Info Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-card border border-border glass-card space-y-6">
                        <h3 className="text-xl font-bold">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                                <Mail className="text-muted-foreground" />
                                <div>
                                    <div className="text-xs font-bold text-muted-foreground uppercase">Email</div>
                                    <div className="font-medium">{carrier.contact_info || "contact@carrier.com"}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                                <Phone className="text-muted-foreground" />
                                <div>
                                    <div className="text-xs font-bold text-muted-foreground uppercase">Phone</div>
                                    <div className="font-medium">+1 (555) 000-0000</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-card border border-border glass-card flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-xl font-bold">Deep Analysis</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Detailed performance analytics, lane history, and projected capacity availability are available in the full report.
                        </p>
                        <button className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">
                            Download Full Report
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
