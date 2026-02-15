"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    User,
    Mail,
    Camera,
    Bell,
    Shield,
    Globe,
    Moon,
    CheckCircle,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
    const { user, isLoaded } = useUser()
    const { theme, setTheme } = useTheme()
    const [isSaving, setIsSaving] = useState(false)
    const [preferences, setPreferences] = useState({
        marketingEmails: true,
        securityAlerts: true,
        language: "English (US)",
        timezone: "UTC-6 (Central Time)"
    })

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        toast.success("Profile preferences updated successfully.")
    }

    if (!isLoaded) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="border-b border-border pb-6">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">User Profile</h1>
                    <p className="text-muted-foreground">Manage your identity, security, and global preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Left Column: Avatar and Identity */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-card rounded-3xl border border-border shadow-sm p-6 flex flex-col items-center text-center space-y-4 glass-card relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted">
                                    <img
                                        src={user?.imageUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={14} />
                                </button>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-foreground">{user?.fullName || "Logistics Specialist"}</h2>
                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{user?.username || "pilot_user_01"}</p>
                            </div>

                            <div className="w-full pt-4 border-t border-border mt-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Account Status</span>
                                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                                        <CheckCircle size={12} /> Verified
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Role</span>
                                    <span className="font-bold text-foreground">Operations Manager</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-3xl border border-border shadow-sm p-6 space-y-4 glass-card">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Security</h3>
                            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-dashed">
                                <Shield size={16} className="text-blue-500" />
                                <span>Change Password</span>
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-dashed">
                                <Bell size={16} className="text-orange-500" />
                                <span>Managed Sessions</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Settings Form */}
                    <div className="md:col-span-8 space-y-6">
                        <section className="bg-card rounded-3xl border border-border shadow-sm p-8 glass-card space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <User size={20} />
                                </div>
                                <h3 className="text-lg font-bold">Identity Details</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input defaultValue={user?.firstName || ""} placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input defaultValue={user?.lastName || ""} placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <Input
                                        className="pl-10"
                                        readOnly
                                        defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">Your primary email is used for mission-critical alerts.</p>
                            </div>
                        </section>

                        <section className="bg-card rounded-3xl border border-border shadow-sm p-8 glass-card space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                    <Globe size={20} />
                                </div>
                                <h3 className="text-lg font-bold">Localization & Preferences</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                                    <div className="space-y-0.5">
                                        <div className="font-bold text-sm">Security Notifications</div>
                                        <div className="text-xs text-muted-foreground">Trigger toasts for important AI actions.</div>
                                    </div>
                                    <button
                                        onClick={() => setPreferences({ ...preferences, securityAlerts: !preferences.securityAlerts })}
                                        className={cn(
                                            "w-12 h-6 rounded-full transition-colors relative",
                                            preferences.securityAlerts ? "bg-primary" : "bg-muted-foreground/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                            preferences.securityAlerts ? "right-1" : "left-1"
                                        )} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                                    <div className="space-y-0.5">
                                        <div className="font-bold text-sm">Dark Mode</div>
                                        <div className="text-xs text-muted-foreground">Optimize the interface for low-light environments.</div>
                                    </div>
                                    <button
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className={cn(
                                            "w-12 h-6 rounded-full transition-colors relative",
                                            theme === 'dark' ? "bg-primary" : "bg-muted-foreground/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                            theme === 'dark' ? "right-1" : "left-1"
                                        )} />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border flex justify-end gap-3">
                                <Button variant="ghost" className="rounded-xl">Discard</Button>
                                <Button onClick={handleSave} disabled={isSaving} className="rounded-xl bg-primary px-8">
                                    {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
