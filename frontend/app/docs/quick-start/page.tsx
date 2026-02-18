"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Terminal,
    Cpu,
    Zap,
    ShieldCheck,
    Globe,
    Copy,
    CheckCircle2,
    Code,
    Layers,
    ArrowRight,
    Search,
    Database,
    Network
} from "lucide-react"

const codeSnippets = {
    python: `import requests
import base64

def extract_manifest(file_path):
    with open(file_path, "rb") as f:
        doc_b64 = base64.b64encode(f.read()).decode()

    payload = {
        "document": doc_b64,
        "document_type": "FREIGHT_MANIFEST",
        "priority": "HIGH"
    }
    
    response = requests.post(
        "https://api.logimatch.online/v1/extract", 
        json=payload,
        headers={"X-API-Key": "YOUR_SECRET_KEY"}
    )
    return response.json()`,
    javascript: `const axios = require('axios');
const fs = require('fs');

async function extractManifest(filePath) {
    const docB64 = fs.readFileSync(filePath, { encoding: 'base64' });

    const payload = {
        document: docB64,
        document_type: "FREIGHT_MANIFEST",
        priority: "HIGH"
    };

    const response = await axios.post(
        'https://api.logimatch.online/v1/extract',
        payload,
        { headers: { 'X-API-Key': 'YOUR_SECRET_KEY' } }
    );
    return response.data;
}`
}

export default function QuickStartPage() {
    const [activeTab, setActiveTab] = useState("python")
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeSnippets[activeTab as keyof typeof codeSnippets])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const steps = [
        {
            title: "Connect Your ERP/TMS",
            description: "Interface with SAP, Oracle, or custom systems via our secure REST API or dedicated webhooks.",
            icon: Network,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            title: "Neural Core Ingestion",
            description: "Docs are processed by our transformer-based NLP engine, reaching 99.9% field accuracy in milliseconds.",
            icon: Cpu,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        },
        {
            title: "Market Benchmarking",
            description: "Real-time comparison against DAT, Xeneta, and historical lanes to identify cost variances.",
            icon: Globe,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10"
        },
        {
            title: "Automated Allocation",
            description: "Winning carriers are notified, and EDI/API booking confirms the shipment instantly.",
            icon: Zap,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
        }
    ]

    return (
        <AppLayout>
            <div className="max-w-[1200px] mx-auto space-y-20 py-12 px-6">

                {/* Technical Hero */}
                <header className="space-y-6 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <Terminal size={14} /> Engineering Resource
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground italic uppercase">
                        Quick Start <br />
                        <span className="text-primary">Integration Guide</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                        Deploy LogiMatch AI into your production stack in under 15 minutes.
                        Engineered for high-throughput logistics intelligence.
                    </p>
                </header>

                {/* Integration Architecture */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-1 bg-primary rounded-full" />
                        <h2 className="text-2xl font-black tracking-tight uppercase italic">The Neural Pipeline</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="relative group p-8 bg-card border border-border rounded-[32px] hover:border-primary/50 transition-all duration-500 glass-card">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${step.bgColor} ${step.color} group-hover:scale-110`}>
                                    <step.icon size={28} />
                                </div>
                                <h3 className="text-lg font-black mb-2 text-foreground">{step.title}</h3>
                                <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Interactive Code Section */}
                <section className="space-y-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-primary rounded-full" />
                            <h2 className="text-2xl font-black tracking-tight uppercase italic">API Implementation</h2>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
                            v4.2 Production Ready
                        </Badge>
                    </div>

                    <Card className="glass-card border-border/40 overflow-hidden shadow-2xl">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 flex-row justify-between items-center space-y-0">
                            <div className="flex items-center gap-6">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                                </div>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-9">
                                    <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                                        <TabsTrigger value="python" className="rounded-lg px-4 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary">Python</TabsTrigger>
                                        <TabsTrigger value="javascript" className="rounded-lg px-4 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary">JavaScript</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 rounded-xl border border-white/10 hover:bg-white/5 gap-2 text-[10px] font-black uppercase tracking-widest"
                                onClick={copyToClipboard}
                            >
                                {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                {copied ? "Copied" : "Copy Code"}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 bg-black/40">
                            <pre className="p-8 text-sm font-mono leading-relaxed text-blue-200 overflow-x-auto">
                                <code>{codeSnippets[activeTab as keyof typeof codeSnippets]}</code>
                            </pre>
                        </CardContent>
                    </Card>
                </section>

                {/* Architecture Deep Dive */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-primary rounded-full" />
                            <h2 className="text-2xl font-black tracking-tight uppercase italic">Secure by Design</h2>
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: "SOC 2 Type II Certified", desc: "Enterprise-grade security controls at every layer.", icon: ShieldCheck },
                                { title: "Global CDN Backing", desc: "Sub-100ms latency from 200+ edge locations.", icon: Globe },
                                { title: "Neural Core Redundancy", desc: "Triple-redundant clusters ensure zero downtime.", icon: Layers }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white/5 rounded-[32px] border border-white/5 hover:border-primary/20 transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <feature.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-foreground mb-1">{feature.title}</h4>
                                        <p className="text-sm text-muted-foreground font-medium">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="glass-card bg-indigo-950/20 border-indigo-500/20 p-12 aspect-square flex flex-col justify-center items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent)]" />
                        <Network size={120} className="text-primary/20 mb-8 animate-pulse" />
                        <div className="relative z-10 text-center space-y-6">
                            <h3 className="text-3xl font-black tracking-tighter italic uppercase text-white">Full API Reference</h3>
                            <p className="text-blue-200/60 font-medium">Explore all endpoints, schemas, and authentication methods.</p>
                            <Button className="h-14 px-10 rounded-2xl bg-primary font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/20 group-hover:scale-105 transition-all">
                                Go to API Reference <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </div>
                    </Card> section
                </section>

                {/* Bottom Support */}
                <div className="bg-primary/5 border border-primary/10 rounded-[48px] p-12 flex flex-col md:flex-row items-center justify-between gap-10 glass-card">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight text-foreground italic uppercase leading-none">Need a Dedicated Engineer?</h3>
                        <p className="text-muted-foreground font-medium">Our integration team is available for live architecture reviews.</p>
                    </div>
                    <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 border-primary/20 hover:border-primary font-black uppercase tracking-widest text-xs">
                        Schedule Sync
                    </Button>
                </div>
            </div>
            <SiteFooter />
        </AppLayout>
    )
}
