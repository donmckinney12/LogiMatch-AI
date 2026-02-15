"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Plus, Trash2, Check, X, Mail, Zap, Shield, Lock, Scale, FileText, AlertCircle } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

type Surcharge = {
    id: number
    raw_name: string
    normalized_name: string
    category: string
    is_approved: boolean
}

type ExchangeRate = {
    id: number
    currency_code: string
    rate_to_usd: number
    last_updated: string
}

export default function SettingsPage() {
    const { user } = useUser()
    const [surcharges, setSurcharges] = useState<Surcharge[]>([])
    const [rates, setRates] = useState<ExchangeRate[]>([])
    const [activeTab, setActiveTab] = useState<'surcharges' | 'rates' | 'email' | 'governance'>('surcharges')
    const [isTestingInbound, setIsTestingInbound] = useState(false)

    const [isAddingSurcharge, setIsAddingSurcharge] = useState(false)
    const [newSurcharge, setNewSurcharge] = useState({ raw_name: "", normalized_name: "", category: "General", is_approved: true })

    const [isAddingRate, setIsAddingRate] = useState(false)
    const [newRate, setNewRate] = useState({ currency_code: "", rate_to_usd: "" })

    useEffect(() => {
        fetchSurcharges()
        fetchRates()
    }, [])

    const fetchSurcharges = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/surcharges")
            if (res.ok) {
                setSurcharges(await res.json())
            }
        } catch (e) {
            console.error("Failed to fetch surcharges", e)
        }
    }

    const fetchRates = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/rates")
            if (res.ok) setRates(await res.json())
        } catch (e) {
            console.error("Failed to fetch rates", e)
        }
    }

    const handleAddSurcharge = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/surcharges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSurcharge)
            })
            if (res.ok) {
                await fetchSurcharges()
                setIsAddingSurcharge(false)
                setNewSurcharge({ raw_name: "", normalized_name: "", category: "General", is_approved: true })
            }
        } catch (e) {
            console.error("Failed to add surcharge", e)
        }
    }

    const handleAddRate = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/rates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRate)
            })
            if (res.ok) {
                await fetchRates()
                setIsAddingRate(false)
                setNewRate({ currency_code: "", rate_to_usd: "" })
            }
        } catch (e) {
            console.error("Failed to add rate", e)
        }
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="border-b border-neutral-200 dark:border-white/10 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                    <p className="text-muted-foreground">Configure system preferences, normalization rules, and exchange rates.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-neutral-200 dark:border-white/10">
                    <button
                        onClick={() => setActiveTab('surcharges')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'surcharges' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Surcharge Library
                    </button>
                    <button
                        onClick={() => setActiveTab('rates')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'rates' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Currency & Forex
                    </button>
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Inbound Email
                    </button>
                    <button
                        onClick={() => setActiveTab('governance')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'governance' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Governance
                    </button>
                </div>

                {activeTab === 'surcharges' ? (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden glass-card">
                        <div className="p-6 border-b border-neutral-200 dark:border-white/10 flex justify-between items-center bg-neutral-50 dark:bg-white/5">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Surcharge Library</h2>
                                <p className="text-sm text-muted-foreground">Define how the AI normalizes fees. Pre-approved fees are auto-cleaned.</p>
                            </div>
                            <button
                                onClick={() => setIsAddingSurcharge(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <Plus size={16} />
                                Add Rule
                            </button>
                        </div>

                        {isAddingSurcharge && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border-b border-blue-100 dark:border-blue-500/20 flex flex-wrap gap-4 items-end">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-blue-800 uppercase">Raw Name (Quote)</label>
                                    <input
                                        className="block w-full px-3 py-2 border border-border bg-background rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground"
                                        placeholder="e.g. BAF"
                                        value={newSurcharge.raw_name}
                                        onChange={e => setNewSurcharge({ ...newSurcharge, raw_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase">Normalized Name</label>
                                    <input
                                        className="block w-full px-3 py-2 border border-border bg-background rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground"
                                        placeholder="e.g. Bunker Adjustment Factor"
                                        value={newSurcharge.normalized_name}
                                        onChange={e => setNewSurcharge({ ...newSurcharge, normalized_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-blue-800 uppercase">Category</label>
                                    <select
                                        className="block w-full px-3 py-2 border border-border bg-background rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground"
                                        value={newSurcharge.category}
                                        onChange={e => setNewSurcharge({ ...newSurcharge, category: e.target.value })}
                                    >
                                        <option>Fuel</option>
                                        <option>Security</option>
                                        <option>Handling</option>
                                        <option>Documentation</option>
                                        <option>General</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleAddSurcharge} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Save</button>
                                    <button onClick={() => setIsAddingSurcharge(false)} className="px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-medium hover:bg-muted">Cancel</button>
                                </div>
                            </div>
                        )}

                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted font-medium text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3">Raw Name</th>
                                    <th className="px-6 py-3">Normalized Name</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {surcharges.map(s => (
                                    <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-3 font-mono text-muted-foreground">{s.raw_name}</td>
                                        <td className="px-6 py-3 font-semibold text-foreground">{s.normalized_name}</td>
                                        <td className="px-6 py-3">
                                            <span className="px-2 py-1 rounded bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 text-xs font-medium">
                                                {s.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            {s.is_approved ? (
                                                <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                                                    <Check size={14} /> Approved
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-red-600 text-xs font-medium">
                                                    <X size={14} /> Flagged
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {surcharges.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-neutral-400 italic">
                                            No custom rules defined. The AI is using base defaults.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'rates' ? (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden glass-card">
                        <div className="p-12 text-center text-muted-foreground italic">
                            Exchange rate telemetry is synchronized with global central banks every 4 hours.
                        </div>
                    </div>
                ) : activeTab === 'email' ? (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden glass-card">
                        <div className="p-8 text-center space-y-6">
                            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <Mail size={32} />
                            </div>
                            <div className="max-w-md mx-auto space-y-2">
                                <h2 className="text-xl font-bold text-foreground">Automate Your Inbox</h2>
                                <p className="text-muted-foreground">
                                    Forward your freight quotes to this address to automatically ingest them into your dashboard.
                                </p>
                            </div>

                            <div className="bg-neutral-100 dark:bg-white/5 p-4 rounded-lg inline-flex items-center gap-4 border border-neutral-200 dark:border-white/10">
                                <code className="text-blue-700 dark:text-blue-400 font-bold font-mono">
                                    quotes+{user?.username || 'user'}@logimatch.ai
                                </code>
                                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(`quotes+${user?.username || 'user'}@logimatch.ai`)}>
                                    Copy
                                </Button>
                            </div>

                            <div className="border-t border-neutral-100 dark:border-white/10 pt-8 mt-4">
                                <h3 className="text-sm font-semibold text-foreground mb-4">Demo: Test the Automation</h3>
                                <p className="text-xs text-muted-foreground mb-6">
                                    This will trigger a mock email webhook with a sample PDF attachment.
                                </p>
                                <Button
                                    className="bg-blue-600"
                                    disabled={isTestingInbound}
                                    onClick={async () => {
                                        setIsTestingInbound(true)
                                        try {
                                            const res = await fetch("http://localhost:5000/api/inbound/email-webhook", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    from: user?.primaryEmailAddress?.emailAddress || "pilot@logistics.com",
                                                    subject: "Fwd: Freight Quote - MSC",
                                                    attachments: [
                                                        {
                                                            filename: "quote_msc_sample.pdf",
                                                            type: "application/pdf",
                                                            content: "JVBERi0xLjQKJ...(Base64 Mock Data)..."
                                                        }
                                                    ]
                                                })
                                            })
                                            if (res.ok) alert("Mock Email Ingested! Check your Dashboard.")
                                            else alert("Test failed.")
                                        } catch (e) {
                                            console.error(e)
                                        } finally {
                                            setIsTestingInbound(false)
                                        }
                                    }}
                                >
                                    <Zap className="mr-2 h-4 w-4" />
                                    {isTestingInbound ? "Processing..." : "Trigger Mock Inbound Email"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden glass-card">
                        <div className="p-8 space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 rounded-[32px] bg-primary/5 border border-primary/10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Shield size={24} />
                                        <h2 className="text-xl font-bold tracking-tight">Legal & Governance Hub</h2>
                                    </div>
                                    <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                                        Review our commitment to data security, privacy, and the terms governing the use of the LogiMatch AI neural core.
                                        Enterprise users are subject to additional Master Service Agreements (MSA).
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {['GDPR Compliant', 'SOC2 Type II', 'CCPA Support', 'ISO 27001'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-background border border-border rounded-full text-[10px] font-black uppercase text-muted-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Button
                                    className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20"
                                    onClick={() => window.location.href = '/settings/legal'}
                                >
                                    Access Full Legal Center
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "Privacy Policy", desc: "How we secure your sensitive logistics telemetry.", icon: Lock, link: "/settings/legal" },
                                    { title: "Terms of Service", desc: "Agreement on platform usage and limitations.", icon: Scale, link: "/settings/legal" },
                                    { title: "Refund Policy", desc: "Clarification on custom-quoted 'Elite' billing.", icon: FileText, link: "/settings/legal" },
                                    { title: "AI Accuracy Disclaimer", desc: "Neural model probability and limit of liability.", icon: AlertCircle, link: "/settings/legal" },
                                ].map((doc, i) => (
                                    <div key={i} className="p-6 rounded-2xl border border-border hover:border-primary/40 transition-all group flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <doc.icon size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{doc.title}</h3>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{doc.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
