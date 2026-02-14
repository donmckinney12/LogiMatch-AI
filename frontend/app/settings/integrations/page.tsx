"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import {
    Key,
    Link as LinkIcon,
    Plus,
    Copy,
    Trash2,
    RefreshCw,
    Shield,
    Globe,
    ExternalLink,
    CheckCircle2,
    Database,
    Cloud,
    Cpu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type APIKey = {
    id: string
    name: string
    key: string
    created: string
    lastUsed: string
}

type Connector = {
    id: string
    name: string
    type: string
    status: "connected" | "disconnected"
    icon: any
    description: string
}

export default function IntegrationsPage() {
    const [keys, setKeys] = useState<APIKey[]>([
        { id: "1", name: "Production ERP Sync", key: "sk_live_••••••••••••4k2l", created: "2024-01-15", lastUsed: "2 mins ago" },
        { id: "2", name: "Development Webhook", key: "sk_test_••••••••••••9p1z", created: "2024-02-10", lastUsed: "3 hours ago" }
    ])

    const connectors: Connector[] = [
        { id: "sap", name: "SAP S/4HANA", type: "ERP", status: "disconnected", icon: Database, description: "Direct OData integration for enterprise resource planning." },
        { id: "oracle", name: "Oracle NetSuite", type: "TMS", status: "disconnected", icon: Cloud, description: "Synchronize shipment data and financial records." },
        { id: "carrier", name: "Carrier EDI Hub", type: "EDI", status: "connected", icon: Cpu, description: "Standardized electronic data interchange for carrier tenders." }
    ]

    const copyKey = (key: string) => {
        navigator.clipboard.writeText(key)
        toast.success("API Key copied to clipboard.")
    }

    const deleteKey = (id: string) => {
        setKeys(prev => prev.filter(k => k.id !== id))
        toast.error("API Key revoked.")
    }

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="border-b border-border pb-8">
                    <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <LinkIcon className="text-primary" size={32} />
                        Integrations & Keys
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Connect your existing tech stack and manage mission-critical API access.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* API Keys Section */}
                    <div className="lg:col-span-12 space-y-6">
                        <section className="bg-card rounded-[40px] border border-border shadow-2xl glass-card overflow-hidden">
                            <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                        <Key size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-foreground">API Credentials</h3>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Secure programmatic access</p>
                                    </div>
                                </div>
                                <Button className="rounded-2xl gap-2 h-11 px-6 font-bold shadow-lg shadow-primary/20">
                                    <Plus size={18} />
                                    Generate New Key
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-muted/50 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border/50">
                                        <tr>
                                            <th className="px-8 py-5">Name / Label</th>
                                            <th className="px-8 py-5">API Key</th>
                                            <th className="px-8 py-5">Created</th>
                                            <th className="px-8 py-5">Last Used</th>
                                            <th className="px-8 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {keys.map((k) => (
                                            <tr key={k.id} className="hover:bg-primary/[0.02] transition-colors">
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-black text-foreground">{k.name}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <code className="text-xs bg-muted p-2 rounded-lg border border-border font-mono text-muted-foreground">
                                                        {k.key}
                                                    </code>
                                                </td>
                                                <td className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    {k.created}
                                                </td>
                                                <td className="px-8 py-6 text-xs font-bold text-muted-foreground flex items-center gap-2">
                                                    <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                                                    {k.lastUsed}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary" onClick={() => copyKey(k.key)}>
                                                            <Copy size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteKey(k.id)}>
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Connectors Section */}
                    <div className="lg:col-span-12 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-foreground">Enterprise Connectors</h2>
                            <Button variant="ghost" className="text-primary font-bold gap-2 rounded-xl">
                                View Marketplace <ExternalLink size={14} />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {connectors.map((c) => (
                                <div key={c.id} className="group bg-card border border-border p-8 rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500 glass-card flex flex-col justify-between space-y-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6">
                                        {c.status === "connected" ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-500/20">
                                                <CheckCircle2 size={12} /> Live
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-border">
                                                Inactive
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500",
                                            c.status === "connected" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}>
                                            <c.icon size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-foreground">{c.name}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{c.type} Integration</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                            {c.description}
                                        </p>
                                    </div>

                                    <Button
                                        variant={c.status === "connected" ? "outline" : "default"}
                                        className={cn(
                                            "w-full rounded-2xl h-11 font-bold transition-all",
                                            c.status === "connected" ? "border-2 border-primary/20 hover:border-primary hover:bg-primary/5" : "bg-primary hover:bg-primary/90"
                                        )}
                                    >
                                        {c.status === "connected" ? "Manage Connection" : "Connect Integration"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Developer Docs Promo */}
                    <div className="lg:col-span-12">
                        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                <div className="space-y-4 max-w-xl">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest">
                                        <Globe size={14} /> Global Developer API
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight leading-tight">
                                        Build the future of <span className="text-blue-400 underline underline-offset-8 decoration-blue-400/30">logistics automation</span>.
                                    </h2>
                                    <p className="text-blue-100/70 text-lg font-medium">
                                        Access our full technical documentation, SDKs, and webhook guides to scale your operations programmatically.
                                    </p>
                                </div>
                                <Button className="bg-white text-blue-900 hover:bg-blue-50 rounded-3xl px-10 h-14 font-black text-lg gap-3 shrink-0 shadow-2xl shadow-blue-500/20">
                                    Documentation <ExternalLink size={20} />
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    )
}
