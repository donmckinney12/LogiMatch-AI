"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Terminal, Key, Shield, Zap, Globe, Copy, CheckCircle2 } from "lucide-react"

const endpoints = [
    {
        method: "POST",
        path: "/api/extract",
        title: "Intelligent Document Extraction",
        description: "Ingests raw PDF/Image manifests and extracts structured JSON using the Neural Core.",
        payload: `{
  "document": "base64_string",
  "document_type": "PDF_MANIFEST",
  "priority": "HIGH"
}`,
        response: `{
  "request_id": "EXT-123456",
  "status": "PROCESSED",
  "extraction_score": 0.99,
  "data": { "origin": "SHA", "dest": "LAX" }
}`
    },
    {
        method: "GET",
        path: "/api/quotes",
        title: "Retrieve Normalized Quotes",
        description: "Fetches a list of audited quotes with real-time market delta calculations.",
        params: "?organization_id=org_123&limit=50",
        response: `[
  {
    "id": 1,
    "carrier": "Maersk",
    "total_price_usd": 1580.0,
    "market_delta": -12.4
  }
]`
    }
]

export default function APIReferencePage() {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <AppLayout>
            <div className="max-w-[1200px] mx-auto space-y-16 py-12 px-6">
                {/* Header */}
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <Terminal size={14} /> Developer Portal
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground italic uppercase">
                        Enterprise <span className="text-primary">API Reference</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Integrate LogiMatch AI intelligence directly into your TMS, ERP, or internal financial dashboard.
                    </p>
                </div>

                {/* Getting Started */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="glass-card border-border/40 p-8 space-y-4">
                        <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                            <Key size={24} />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tight">Authentication</h3>
                        <p className="text-sm text-muted-foreground font-medium">All requests must include an <code className="bg-muted px-1.5 py-0.5 rounded text-primary">Authorization</code> header with your JWT token.</p>
                    </Card>
                    <Card className="glass-card border-border/40 p-8 space-y-4">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tight">Organization ID</h3>
                        <p className="text-sm text-muted-foreground font-medium">Provide the <code className="bg-muted px-1.5 py-0.5 rounded text-emerald-500">X-Organization-ID</code> header to scope data to your business unit.</p>
                    </Card>
                    <Card className="glass-card border-border/40 p-8 space-y-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tight">Rate Limits</h3>
                        <p className="text-sm text-muted-foreground font-medium">Enterprise Tier: 5,000 requests/minute. Burst capacity available upon request.</p>
                    </Card>
                </div>

                {/* API Documentation */}
                <div className="space-y-12">
                    <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic border-l-4 border-primary pl-6">Core Endpoints</h2>

                    {endpoints.map((endpoint, i) => (
                        <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-border/40 first:border-0 first:pt-0">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Badge className={`${endpoint.method === 'POST' ? 'bg-blue-600' : 'bg-emerald-600'} text-white font-black px-3 py-1`}>{endpoint.method}</Badge>
                                    <code className="text-lg font-bold text-foreground tracking-tight">{endpoint.path}</code>
                                </div>
                                <h3 className="text-2xl font-black text-foreground italic uppercase">{endpoint.title}</h3>
                                <p className="text-muted-foreground font-medium text-lg leading-relaxed">{endpoint.description}</p>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Key Headers</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                                            <CheckCircle2 size={16} className="text-primary" /> Content-Type: application/json
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                                            <CheckCircle2 size={16} className="text-primary" /> X-Organization-ID: [YOUR_ORG_ID]
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Tabs defaultValue="response" className="w-full">
                                    <div className="flex items-center justify-between mb-2">
                                        <TabsList className="bg-muted/50 border border-border/40 p-1 rounded-xl">
                                            <TabsTrigger value="request" className="text-[10px] font-black uppercase tracking-widest px-4">Request Body</TabsTrigger>
                                            <TabsTrigger value="response" className="text-[10px] font-black uppercase tracking-widest px-4">Response</TabsTrigger>
                                        </TabsList>
                                        <button
                                            onClick={() => copyToClipboard(endpoint.response)}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground group"
                                        >
                                            {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} className="group-hover:text-primary" />}
                                        </button>
                                    </div>
                                    <TabsContent value="request">
                                        <pre className="p-6 bg-[#0d1117] rounded-[24px] border border-border/40 text-[13px] font-mono text-blue-300 overflow-x-auto shadow-2xl">
                                            {endpoint.payload || "// No request body required"}
                                        </pre>
                                    </TabsContent>
                                    <TabsContent value="response">
                                        <pre className="p-6 bg-[#0d1117] rounded-[24px] border border-border/40 text-[13px] font-mono text-emerald-300 overflow-x-auto shadow-2xl">
                                            {endpoint.response}
                                        </pre>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SDK Section */}
                <section className="bg-card border border-border/40 rounded-[48px] p-12 text-center space-y-8 glass-card">
                    <div className="flex justify-center gap-8 opacity-40">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center font-black">JS</div>
                            <span className="text-[10px] font-black">Node.js</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center font-black">PY</div>
                            <span className="text-[10px] font-black">Python</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center font-black">RB</div>
                            <span className="text-[10px] font-black">Ruby</span>
                        </div>
                    </div>
                    <div className="max-w-xl mx-auto space-y-4">
                        <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic leading-none">Official SDKs Coming Soon</h2>
                        <p className="text-muted-foreground font-medium">
                            We're building native libraries to make integration even faster. Sign up for early access to the developer beta.
                        </p>
                    </div>
                </section>
            </div>
            <SiteFooter />
        </AppLayout>
    )
}
