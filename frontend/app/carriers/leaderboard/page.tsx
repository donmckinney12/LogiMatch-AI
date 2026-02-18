"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import {
    Trophy,
    Star,
    TrendingUp,
    ShieldCheck,
    AlertTriangle,
    Search,
    Filter,
    ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

import { apiRequest } from "@/lib/api-client"

interface Carrier {
    id: number
    name: string
    reliability_score: number
    compliance_score: number
    onboarding_status: string
    is_verified: boolean
}

export default function CarrierLeaderboard() {
    const router = useRouter()
    const [carriers, setCarriers] = useState<Carrier[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchCarriers()
    }, [])

    const fetchCarriers = async () => {
        try {
            const data = await apiRequest('/api/carriers')
            setCarriers(data.sort((a: Carrier, b: Carrier) => b.reliability_score - a.reliability_score))
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const filtered = carriers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
                            <Trophy size={14} /> Team IQ
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            Carrier <span className="text-blue-600">Leaderboard</span>
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-lg mt-2">
                            Organization-wide performance rankings based on historical reliability,
                            on-time delivery, and cost competitive success.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search carriers..."
                                className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none w-64 text-foreground glass-card"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-2 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </header>

                {/* Top 3 Podium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filtered.slice(0, 3).map((carrier, idx) => (
                        <div key={carrier.id} className={cn(
                            "relative p-8 rounded-3xl border border-border overflow-hidden shadow-xl group hover:-translate-y-1 transition-all duration-300 bg-card text-foreground glass-card",
                            idx === 0 && "border-yellow-500/50 shadow-yellow-500/10 dark:shadow-yellow-500/5"
                        )}>
                            <div className={cn("absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform", idx === 0 ? "text-yellow-500" : "text-primary")}>
                                <Trophy size={80} strokeWidth={1} />
                            </div>

                            <div className="relative z-10 flex flex-col gap-4">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit",
                                    idx === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400" : "bg-primary/10 text-primary"
                                )}>
                                    RANK #{idx + 1}
                                </span>

                                <h3 className="text-2xl font-black truncate">{carrier.name}</h3>

                                <div className="flex items-center gap-4 py-4 border-y border-border/50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400">Reliability</span>
                                        <span className="text-xl font-black">{carrier.reliability_score}%</span>
                                    </div>
                                    <div className="h-8 w-px bg-border/50" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400">Compliance</span>
                                        <span className="text-xl font-black">{carrier.compliance_score}%</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push(`/carriers/${carrier.id}`)}
                                    className="flex items-center justify-between w-full p-3 rounded-xl font-bold text-xs transition-all bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
                                >
                                    VIEW DEEP ANALYSIS <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* List View */}
                <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden glass-card">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Rank</th>
                                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Carrier</th>
                                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Reliability</th>
                                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Compliance</th>
                                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filtered.slice(3).map((carrier, idx) => (
                                <tr
                                    key={carrier.id}
                                    className="group hover:bg-blue-50/20 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/carriers/${carrier.id}`)}
                                >
                                    <td className="px-8 py-6">
                                        <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-black text-neutral-600 dark:text-neutral-400 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            {idx + 4}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-foreground">{carrier.name}</td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-1.5 font-black text-foreground">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            {carrier.reliability_score}%
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${carrier.compliance_score}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 w-8">{carrier.compliance_score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-lg w-fit ${carrier.onboarding_status === 'APPROVED' ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                            }`}>
                                            {carrier.onboarding_status === 'APPROVED' ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                                            {carrier.onboarding_status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => router.push(`/carriers/${carrier.id}`)}
                                            className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 placeholder:opacity-100"
                                        >
                                            <TrendingUp size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    )
}
