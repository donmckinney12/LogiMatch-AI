"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Activity, FileText, Settings, Mail, ShieldAlert } from "lucide-react"

type AuditLog = {
    id: number
    action: string
    details: string
    timestamp: string
    user_id: string
}

export default function ActivityPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/audit-logs")
            if (res.ok) {
                setLogs(await res.json())
            }
        } catch (e) {
            console.error("Failed to fetch logs", e)
        } finally {
            setLoading(false)
        }
    }

    const getIcon = (action: string) => {
        if (action.includes("UPLOAD")) return <FileText size={18} className="text-blue-600" />
        if (action.includes("SURCHARGE") || action.includes("RATE")) return <Settings size={18} className="text-orange-600" />
        if (action.includes("BOOKING")) return <Mail size={18} className="text-purple-600" />
        return <Activity size={18} className="text-neutral-600" />
    }

    const formatAction = (action: string) => {
        return action.replace(/_/g, " ")
    }

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in pb-12">
                <div className="border-b border-neutral-200 dark:border-white/10 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Activity & Audit</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Live compliance log of all system actions.</p>
                </div>

                <div className="rounded-xl border border-neutral-200 dark:border-white/5 shadow-sm overflow-hidden glass-card">
                    <div className="p-6 border-b border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-white/5">
                        <h2 className="text-lg font-semibold text-foreground">System Timeline</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-neutral-400">Loading audit trail...</div>
                    ) : (
                        <div className="divide-y divide-neutral-100 dark:divide-white/5">
                            {logs.map(log => (
                                <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="mt-1 p-2 bg-neutral-100 rounded-full">
                                        {getIcon(log.action)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-foreground text-sm">{formatAction(log.action)}</p>
                                            <span className="text-xs text-neutral-400 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{log.details}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                                                System ID: {log.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="p-12 text-center text-neutral-400 italic">
                                    No activity recorded yet.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
