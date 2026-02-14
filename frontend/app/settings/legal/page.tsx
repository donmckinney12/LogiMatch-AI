"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import {
    Shield,
    FileText,
    Scale,
    AlertCircle,
    Printer,
    ChevronRight,
    Lock,
    ExternalLink,
    BadgeCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

const SECTIONS = [
    { id: "tos", label: "Terms of Service", icon: Scale },
    { id: "privacy", label: "Privacy Policy", icon: Lock },
    { id: "refund", label: "Refund Policy", icon: FileText },
    { id: "disclaimer", label: "AI & Liability Disclaimer", icon: AlertCircle },
]

export default function LegalCenterPage() {
    const [activeSection, setActiveSection] = useState("tos")

    return (
        <AppLayout>
            <div className="max-w-[1200px] mx-auto space-y-8 animate-in pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                            <Shield size={14} /> Governance & Compliance
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            Legal <span className="text-primary">Center</span>
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-2xl text-lg">
                            Professional agreements and regulatory compliance documentation for LogiMatch AI enterprise partners.
                        </p>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                        <Printer size={16} /> Print/Save PDF
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                                    activeSection === section.id
                                        ? "bg-primary/10 border border-primary/20 text-primary shadow-sm"
                                        : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <section.icon size={18} className={cn(
                                        "transition-colors",
                                        activeSection === section.id ? "text-primary" : "group-hover:text-foreground"
                                    )} />
                                    <span className="text-sm font-bold">{section.label}</span>
                                </div>
                                <ChevronRight size={14} className={cn(
                                    "transition-transform",
                                    activeSection === section.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                )} />
                            </button>
                        ))}

                        <div className="mt-8 p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                            <div className="flex items-center gap-2 text-emerald-500">
                                <BadgeCheck size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Compliant v2.4</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                                Our platform adheres to GDPR, SOC2 Type II, and CCPA standards for high-security enterprise data handling.
                            </p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 bg-card/10 backdrop-blur-xl border border-border p-10 rounded-[40px] shadow-2xl glass-card">
                        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                            {activeSection === "tos" && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                    <h2 className="text-3xl font-black tracking-tight mb-8">Terms of Service</h2>
                                    <p className="text-muted-foreground leading-relaxed">Last Updated: February 13, 2026</p>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h3>
                                        <p className="text-muted-foreground">By accessing or using LogiMatch AI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you are prohibited from using the service.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">2. Service Description</h3>
                                        <p className="text-muted-foreground">LogiMatch AI provides an AI-driven logistics procurement and risk management platform. We reserve the right to modify, suspend, or terminate service at any time without prior notice.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">3. User Obligations</h3>
                                        <p className="text-muted-foreground">You represent and warrant that all information provided is accurate and that you have the legal right to upload sensitive supply chain data to our servers.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">4. Intellectual Property</h3>
                                        <p className="text-muted-foreground">The "LogiMatch AI" brand, codebase, and proprietary AI models remain the sole property of Antigravity AI Inc.</p>
                                    </div>
                                </div>
                            )}

                            {activeSection === "privacy" && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                    <h2 className="text-3xl font-black tracking-tight mb-8">Privacy Policy</h2>
                                    <p className="text-muted-foreground leading-relaxed">Your data security is our highest priority.</p>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">1. Data Collection</h3>
                                        <p className="text-muted-foreground">We collect metadata, shipment records, and carrier performance indices to train localized models specifically for your organization. We do not sell this data to third parties.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">2. Encryption Standards</h3>
                                        <p className="text-muted-foreground">All data is encrypted at rest using AES-256 and in transit via TLS 1.3 protocol. Our neural computing environment is siloed per tenant.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">3. Third-Party Access</h3>
                                        <p className="text-muted-foreground">Access is only granted to integrated partners (e.g., Stripe, Clerk) where necessary for service delivery, following strict OAuth2 protocols.</p>
                                    </div>
                                </div>
                            )}

                            {activeSection === "refund" && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                    <h2 className="text-3xl font-black tracking-tight mb-8">Refund & Billing Policy</h2>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">1. Subscription Tiers</h3>
                                        <p className="text-muted-foreground">LogiMatch offers Pilot, Accelerator, and Elite tiers. "Elite" pricing is custom-quoted via our sales team and governed by a separate Master Service Agreement (MSA).</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">2. Refund Terms</h3>
                                        <p className="text-muted-foreground">Subscriptions are non-refundable once the billing cycle begins. Mid-month cancellations will retain access until the end of the current cycle but will not be prorated.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">3. Credit System</h3>
                                        <p className="text-muted-foreground">"Neural Credits" purchased for AI-accelerated tasks do not expire while an account is active. They are non-transferable and have no cash value.</p>
                                    </div>
                                </div>
                            )}

                            {activeSection === "disclaimer" && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                    <h2 className="text-3xl font-black tracking-tight mb-8">AI Accuracy & Liability Disclaimer</h2>

                                    <div className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/10 space-y-4">
                                        <div className="flex items-center gap-3 text-red-500">
                                            <AlertCircle size={24} />
                                            <h3 className="text-lg font-black uppercase tracking-widest leading-none">Critical Limitation of Liability</h3>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-red-900/80 dark:text-red-200/80">
                                            LogiMatch AI utilizes Large Language Models and predictive neural networks to generate insights. While we strive for absolute accuracy, these outputs are "recommendations" and should not be used as the sole basis for multi-million dollar logistics decisions without human verification.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">1. No Professional Advice</h3>
                                        <p className="text-muted-foreground">Recommendations provided by the "Neural Copilot" do not constitute legal, financial, or certified supply-chain auditing advice.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground">2. "As-Is" Status</h3>
                                        <p className="text-muted-foreground">The service is provided on an "as-is" and "as-available" basis. We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
