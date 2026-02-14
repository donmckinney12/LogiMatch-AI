"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import {
    Shield,
    Lock,
    Smartphone,
    Globe,
    History,
    LogOut,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Key,
    UserCircle,
    Mail,
    Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function SecurityPage() {
    const [mfaEnabled, setMfaEnabled] = useState(true)

    const activeSessions = [
        { device: "MacBook Pro 16\"", location: "Austin, TX", ip: "192.168.1.45", current: true, time: "Current" },
        { device: "iPhone 15 Pro", location: "New York, NY", ip: "172.16.0.21", current: false, time: "2 hours ago" }
    ]

    const handlePasswordChange = () => {
        toast.info("Redirecting to secure password reset portal...")
    }

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="border-b border-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                            <Shield className="text-primary" size={32} />
                            Security Vault
                        </h1>
                        <p className="text-muted-foreground font-medium">Protect your data and manage enterprise-grade access controls.</p>
                    </div>
                    <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-primary py-1.5 px-4 font-black text-[10px] uppercase tracking-widest">
                        SOC 2 Type II Compliant
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Security Overview Cards */}
                    <div className="md:col-span-8 space-y-8">

                        {/* 2FA Section */}
                        <section className="bg-card rounded-[40px] border border-border shadow-xl glass-card overflow-hidden">
                            <div className="p-10 flex items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                                            <Smartphone size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold">Two-Factor Authentication</h3>
                                    </div>
                                    <p className="text-muted-foreground font-medium">
                                        Add an extra layer of security to your account by requiring more than just a password to log in.
                                    </p>
                                    <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                                        <CheckCircle2 size={16} /> Status: Fully Protected
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={() => setMfaEnabled(!mfaEnabled)}
                                        className={cn(
                                            "w-16 h-8 rounded-full transition-all relative p-1",
                                            mfaEnabled ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 bg-white rounded-full transition-transform shadow-sm",
                                            mfaEnabled ? "translate-x-8" : "translate-x-0"
                                        )} />
                                    </button>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{mfaEnabled ? "Enabled" : "Disabled"}</span>
                                </div>
                            </div>
                        </section>

                        {/* Password Section */}
                        <section className="bg-card rounded-[40px] border border-border shadow-xl glass-card p-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                    <Lock size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Password & Credentials</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" className="rounded-2xl h-16 justify-between px-6 border-dashed hover:border-primary hover:bg-primary/5 group" onClick={handlePasswordChange}>
                                    <div className="text-left">
                                        <div className="font-bold text-sm">Rotate Password</div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Last changed 4 months ago</div>
                                    </div>
                                    <ChevronRight className="text-muted-foreground group-hover:text-primary transition-all" size={18} />
                                </Button>

                                <Button variant="outline" className="rounded-2xl h-16 justify-between px-6 border-dashed hover:border-blue-500 hover:bg-blue-500/5 group">
                                    <div className="text-left">
                                        <div className="font-bold text-sm">Passkey (Biometrics)</div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Recommended for speed</div>
                                    </div>
                                    <Plus className="text-muted-foreground group-hover:text-blue-500 transition-all" size={18} />
                                </Button>
                            </div>
                        </section>

                        {/* Recent Activity Section */}
                        <section className="bg-card rounded-[40px] border border-border shadow-xl glass-card overflow-hidden">
                            <div className="p-8 border-b border-border/50 bg-muted/20">
                                <div className="flex items-center gap-3">
                                    <History size={20} className="text-primary" />
                                    <h3 className="font-black text-lg uppercase tracking-tight">Active Login Sessions</h3>
                                </div>
                            </div>
                            <div className="divide-y divide-border/50">
                                {activeSessions.map((session, i) => (
                                    <div key={i} className="p-8 flex items-center justify-between group hover:bg-muted/10 transition-colors">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-muted rounded-2xl border border-border flex items-center justify-center text-muted-foreground shadow-inner">
                                                {session.device.includes("iPhone") ? <Smartphone size={24} /> : <Globe size={24} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-foreground">{session.device}</span>
                                                    {session.current && (
                                                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">Active Now</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    {session.location} • <span className="font-mono">{session.ip}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{session.time}</span>
                                            {!session.current && (
                                                <Button variant="ghost" size="sm" className="rounded-xl text-destructive hover:bg-destructive/10">
                                                    Sign Out
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Tips & Identity */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-gradient-to-br from-indigo-950 to-blue-950 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                            <div className="relative z-10 space-y-6">
                                <div className="p-4 bg-white/10 rounded-3xl w-fit">
                                    <Key size={32} className="text-blue-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black">Security Score</h4>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-[92%] bg-gradient-to-r from-blue-400 to-indigo-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                                    </div>
                                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Master Level 92/100</p>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="text-emerald-400 shrink-0" size={16} />
                                        <p className="text-xs font-medium text-blue-100/70">MFA is enabled on all primary devices.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="text-amber-400 shrink-0" size={16} />
                                        <p className="text-xs font-medium text-blue-100/70">Consider adding a physical security key.</p>
                                    </div>
                                </div>
                                <Button className="w-full bg-white text-indigo-950 hover:bg-blue-50 rounded-2xl h-12 font-black transition-all shadow-xl shadow-black/20">
                                    Security Audit Log
                                </Button>
                            </div>
                        </div>

                        <div className="bg-card border border-border p-8 rounded-[40px] shadow-sm glass-card space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">Identity Verification</h4>
                            <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-3xl border border-border/50">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                    <UserCircle size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-black">Primary Owner</div>
                                    <div className="text-[10px] text-muted-foreground font-medium">Verified ID Card #••••4921</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-3xl border border-border/50">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-black">Verified Email</div>
                                    <div className="text-[10px] text-muted-foreground font-medium text-clip max-w-[120px]">pilot@logimatch.ai</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-10 flex border-t border-border/50 justify-between items-center text-muted-foreground">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <Shield size={14} className="text-primary" /> LogiMatch Neural Shield Activated
                    </div>
                    <Button variant="ghost" className="rounded-xl gap-2 font-bold text-destructive hover:bg-destructive/10">
                        <LogOut size={18} /> Sign Out of All Devices
                    </Button>
                </div>

            </div>
        </AppLayout>
    )
}
