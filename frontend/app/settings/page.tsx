"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AppLayout } from "@/components/app-layout"
import { Plus, Trash2, Check, X, Mail, Zap, Shield, Lock, Scale, FileText, AlertCircle, CreditCard, ArrowRight, Sun, Moon, Monitor } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { apiRequest } from "@/lib/api-client"
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
    const { theme, setTheme } = useTheme()
    const [surcharges, setSurcharges] = useState<Surcharge[]>([])
    const [rates, setRates] = useState<ExchangeRate[]>([])
    const [activeTab, setActiveTab] = useState<'surcharges' | 'rates' | 'email' | 'governance' | 'billing' | 'appearance'>('surcharges')
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
            const data = await apiRequest("/api/surcharges")
            setSurcharges(data)
        } catch (e) {
            console.error("Failed to fetch surcharges", e)
        }
    }

    const fetchRates = async () => {
        try {
            const data = await apiRequest("/api/rates")
            setRates(data)
        } catch (e) {
            console.error("Failed to fetch rates", e)
        }
    }

    const handleAddSurcharge = async () => {
        try {
            await apiRequest("/api/surcharges", {
                method: "POST",
                body: JSON.stringify(newSurcharge)
            })
            await fetchSurcharges()
            setIsAddingSurcharge(false)
            setNewSurcharge({ raw_name: "", normalized_name: "", category: "General", is_approved: true })
        } catch (e) {
            console.error("Failed to add surcharge", e)
        }
    }

    const handleAddRate = async () => {
        try {
            await apiRequest("/api/rates", {
                method: "POST",
                body: JSON.stringify(newRate)
            })
            await fetchRates()
            setIsAddingRate(false)
            setNewRate({ currency_code: "", rate_to_usd: "" })
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
                        onClick={() => setActiveTab('billing')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'billing' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Billing & Usage
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
                        onClick={() => setActiveTab('appearance')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'appearance' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Appearance
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
                ) : activeTab === 'billing' ? (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden glass-card">
                        <div className="p-12 text-center space-y-6">
                            <div className="mx-auto w-20 h-20 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center shadow-inner">
                                <CreditCard size={40} />
                            </div>
                            <div className="max-w-md mx-auto space-y-2">
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight italic">Subscription & Usage</h2>
                                <p className="text-muted-foreground font-medium">
                                    Manage your enterprise normalization credits, view invoices, and scale your neural capacity.
                                </p>
                            </div>
                            <Button
                                className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 mx-auto"
                                onClick={() => window.location.href = '/settings/billing'}
                            >
                                Manage Credits & Billing <ArrowRight size={16} />
                            </Button>
                        </div>
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
                                            await apiRequest("/api/inbound/email-webhook", {
                                                method: "POST",
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
                                            alert("Mock Email Ingested! Check your Dashboard.")
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
                ) : activeTab === 'appearance' ? (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden glass-card">
                        <div className="p-8 space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-foreground italic uppercase tracking-tight">Appearance</h2>
                                <p className="text-sm text-muted-foreground">Customize how LogiMatch AI looks on your screen.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'light', name: 'Light Mode', icon: Sun, desc: 'Clean and bright' },
                                    { id: 'dark', name: 'Dark Mode', icon: Moon, desc: 'Kind to your eyes' },
                                    { id: 'system', name: 'System', icon: Monitor, desc: 'Dynamic matching' },
                                ].map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setTheme(mode.id)}
                                        className={cn(
                                            "p-6 rounded-2xl border transition-all text-left flex flex-col gap-4 group",
                                            theme === mode.id
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "border-border hover:border-primary/40 hover:bg-muted"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 rounded-xl w-fit transition-colors",
                                            theme === mode.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"
                                        )}>
                                            <mode.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground uppercase tracking-tight text-xs">{mode.name}</h3>
                                            <p className="text-[10px] text-muted-foreground font-medium">{mode.desc}</p>
                                        </div>
                                        {theme === mode.id && (
                                            <div className="ml-auto mt-auto">
                                                <div className="bg-primary text-primary-foreground p-1 rounded-full">
                                                    <Check size={12} />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 rounded-2xl bg-muted/30 border border-border/40">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                        <AlertCircle size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-foreground">Pro-Tip: Glassmorphism</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            LogiMatch AI uses dynamic glassmorphism. Dark mode highlights the depth of neural layers, while Light mode emphasizes the clarity of your supply chain manifesting data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Default or fallback content if none of the above match
                    // This case should ideally not be reached if all tabs are handled
                    <div className="p-12 text-center text-muted-foreground italic">
                        Select a tab to view settings.
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
