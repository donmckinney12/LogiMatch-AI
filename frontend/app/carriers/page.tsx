"use client"
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function CarriersPage() {
    const router = useRouter()
    const [carriers, setCarriers] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<'directory' | 'pending'>('directory')

    useEffect(() => {
        fetch('http://localhost:5000/api/carriers')
            .then(res => res.json())
            .then(setCarriers)
            .catch(err => console.error("Failed to load carriers", err))
    }, [])

    const pendingCarriers = carriers.filter(c => c.onboarding_status === 'PENDING')
    const activeCarriers = carriers.filter(c => !c.onboarding_status || c.onboarding_status === 'APPROVED')

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">Carrier <span className="text-primary">Ecosystem</span></h1>
                        <p className="text-muted-foreground font-medium">Global vendor directory and compliance telemetry.</p>
                    </div>
                    <div className="flex bg-muted/50 p-1 rounded-2xl border border-border">
                        <button
                            onClick={() => setActiveTab('directory')}
                            className={cn(
                                "px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                                activeTab === 'directory' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Active Directory
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={cn(
                                "px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2",
                                activeTab === 'pending' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Pending
                            {pendingCarriers.length > 0 && (
                                <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">
                                    {pendingCarriers.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {activeTab === 'directory' ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {activeCarriers.map((carrier) => (
                            <div
                                key={carrier.id}
                                className="group relative p-8 rounded-[32px] border border-border bg-card/30 backdrop-blur-xl hover:border-primary/50 transition-all cursor-pointer shadow-xl shadow-black/5"
                                onClick={() => router.push(`/carriers/${carrier.id}`)}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <CheckCircle size={80} className="text-primary" />
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{carrier.name}</h3>
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Reliability</p>
                                            <div className="text-3xl font-black text-foreground">{carrier.reliability_score}%</div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Compliance</p>
                                            <p className="font-bold text-foreground">Verified</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">ID: {carrier.id}</span>
                                        <button className="text-[10px] font-black text-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform">View Profile →</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pendingCarriers.length === 0 ? (
                            <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-border border-dashed">
                                <Clock size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                                <p className="font-bold text-muted-foreground">Queue clear. No pending applications.</p>
                            </div>
                        ) : (
                            pendingCarriers.map(carrier => (
                                <div key={carrier.id} className="p-8 rounded-[32px] border border-border bg-card/20 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-amber-500/30 transition-all">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-foreground">{carrier.name}</h3>
                                            <span className="text-[9px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-500 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock size={12} /> Pending Neural Review
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium">Tax ID: {carrier.tax_id || 'N/A'} • Contact: {carrier.contact_info}</p>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Risk Assessment</p>
                                            <div className={cn(
                                                "text-2xl font-black tracking-tighter",
                                                carrier.compliance_score > 80 ? "text-emerald-500" : "text-amber-500"
                                            )}>
                                                {carrier.compliance_score}/100
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => router.push(`/carriers/${carrier.id}`)}
                                            className="px-8 py-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-105 transition-all"
                                        >
                                            Begin Audit
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
