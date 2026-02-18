"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    ShieldCheck,
    Clock,
    Filter,
    Search,
    User,
    Activity,
    Lock,
    FileText,
    Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AuditLog {
    id: number
    action: string
    category: string
    details: string
    user_id: string
    timestamp: string
}

import { apiRequest } from "@/lib/api-client"

export default function AuditExplorerPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const [currentCategory, setCurrentCategory] = useState<string>("ALL")

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true)
            try {
                const endpoint = currentCategory === "ALL"
                    ? '/api/audit-logs'
                    : `/api/audit-logs?category=${currentCategory}`
                const data = await apiRequest(endpoint)
                setLogs(data)
            } catch (err) {
                console.error("Failed to fetch audit logs", err)
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [currentCategory])

    const categories = [
        { label: "All Logs", value: "ALL", icon: Activity },
        { label: "Quote Actions", value: "QUOTE", icon: FileText },
        { label: "System Events", value: "SYSTEM", icon: Settings },
        { label: "Security/Auth", value: "AUTH", icon: Lock },
    ]

    return (
        <AppLayout>
            <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border/40">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                            Governance Explorer
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                            A transparent ledger of all <span className="text-primary font-bold underline decoration-primary/30">agentic and human</span> actions for SOC 2 compliance.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat) => {
                        const Icon = cat.icon
                        const isActive = currentCategory === cat.value
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setCurrentCategory(cat.value)}
                                className={cn(
                                    "p-6 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group",
                                    isActive
                                        ? "bg-primary/5 border-primary shadow-xl shadow-primary/10"
                                        : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/30 glass-card"
                                )}
                            >
                                {isActive && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />}
                                <Icon className={cn("h-6 w-6 mb-3 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                <div className="font-black text-xs uppercase tracking-widest">{cat.label}</div>
                            </button>
                        )
                    })}
                </div>

                <div className="bg-card rounded-[40px] border border-border shadow-2xl glass-card overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-primary" />

                    <div className="p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 bg-muted/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-foreground uppercase tracking-wide">Audit Immutable Ledger</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                    Cryptographically Signed Chain of Custody
                                </p>
                            </div>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                                placeholder="Filter ledger entries..."
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Verifying Node Integrity...</span>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border/50">
                                    <tr>
                                        <th className="px-8 py-5">Timestamp</th>
                                        <th className="px-8 py-5">Event</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Details</th>
                                        <th className="px-8 py-5 text-right">Actor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors group">
                                            <td className="px-8 py-6 whitespace-nowrap text-[11px] font-mono text-muted-foreground">
                                                {new Date(log.timestamp).toLocaleString().toUpperCase()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                                                        {log.action}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                                        Entry #{log.id.toString().padStart(6, '0')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={cn(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset",
                                                    log.category === "QUOTE" ? "bg-blue-500/10 text-blue-500 ring-blue-500/20" :
                                                        log.category === "SYSTEM" ? "bg-purple-500/10 text-purple-500 ring-purple-500/20" :
                                                            log.category === "AUTH" ? "bg-rose-500/10 text-rose-500 ring-rose-500/20" :
                                                                "bg-neutral-500/10 text-neutral-500 ring-neutral-500/20"
                                                )}>
                                                    {log.category}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 max-w-md">
                                                <p className="text-sm text-muted-foreground font-medium line-clamp-2 italic">
                                                    {log.details || "No metadata attached."}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs font-black text-foreground">{log.user_id || "SYSTEM AI"}</span>
                                                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Verified</span>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-inner">
                                                        <User size={16} className="text-muted-foreground" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {!loading && logs.length === 0 && (
                            <div className="p-20 text-center space-y-4">
                                <div className="p-4 bg-muted rounded-full w-fit mx-auto text-muted-foreground/30">
                                    <Activity size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-foreground uppercase tracking-wide">No Node Activity</h3>
                                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">No governance records match the selected filter criteria.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

