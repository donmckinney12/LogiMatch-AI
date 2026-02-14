"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import {
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    MoreVertical,
    Search,
    Filter,
    Trash2,
    MailOpen,
    Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Notification = {
    id: string
    title: string
    description: string
    type: "success" | "warning" | "info" | "system"
    timestamp: string
    isRead: boolean
}

const initialNotifications: Notification[] = [
    {
        id: "1",
        title: "Quote Matched!",
        description: "A new quote from Maersk matching your 'Asia-East Coast' lane has been ingested.",
        type: "success",
        timestamp: "5 mins ago",
        isRead: false
    },
    {
        id: "2",
        title: "System Update",
        description: "The AI Normalization engine has been updated to v2.4. New surcharge patterns detected.",
        type: "system",
        timestamp: "1 hour ago",
        isRead: false
    },
    {
        id: "3",
        title: "Large Surcharge Detected",
        description: "Quote #4920 contains a 'Peak Season' surcharge 40% above market average.",
        type: "warning",
        timestamp: "3 hours ago",
        isRead: true
    },
    {
        id: "4",
        title: "Report Ready",
        description: "Your Executive Q1 Savings report is ready for download.",
        type: "info",
        timestamp: "Yesterday",
        isRead: true
    }
]

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const [filter, setFilter] = useState<"all" | "unread">("all")

    const filteredNotifications = filter === "all"
        ? notifications
        : notifications.filter(n => !n.isRead)

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        toast.success("All notifications marked as read.")
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const toggleRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n))
    }

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-foreground">Notifications</h1>
                        <p className="text-muted-foreground">Stay updated on quote ingests, system alerts, and AI insights.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={markAllRead} className="rounded-xl h-9 text-xs font-bold uppercase tracking-widest">
                            Mark All Read
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex bg-card border border-border p-1 rounded-xl shadow-sm glass-card">
                        <button
                            onClick={() => setFilter("all")}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                filter === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                filter === "unread" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Unread ({notifications.filter(n => !n.isRead).length})
                        </button>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <Input placeholder="Search alerts..." className="pl-9 bg-card border-border rounded-xl h-9 text-sm" />
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={cn(
                                    "group relative bg-card border border-border p-5 rounded-2xl shadow-sm transition-all hover:border-primary/50 glass-card flex gap-5",
                                    !notif.isRead ? "border-l-4 border-l-primary" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                                    notif.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                        notif.type === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                            notif.type === "system" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                                "bg-muted border-border text-muted-foreground"
                                )}>
                                    {notif.type === "success" ? <CheckCircle2 size={24} /> :
                                        notif.type === "warning" ? <AlertTriangle size={24} /> :
                                            notif.type === "system" ? <Bell size={24} /> :
                                                <Info size={24} />}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={cn("text-base font-bold text-foreground", !notif.isRead ? "" : "text-foreground/80")}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                            <Clock size={12} /> {notif.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">
                                        {notif.description}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 self-center md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => toggleRead(notif.id)}>
                                        <MailOpen size={16} className="text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-destructive" onClick={() => deleteNotification(notif.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-card w-full p-20 border border-border border-dashed rounded-[32px] flex flex-col items-center justify-center text-center space-y-4 glass-card">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground/30">
                                <Bell size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-foreground">All Clear</h3>
                                <p className="text-sm text-muted-foreground max-w-xs">You're up to date! There are no new notifications to display right now.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* System Stats / Insight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                    <div className="p-6 bg-card border border-border rounded-3xl shadow-sm glass-card space-y-3">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="p-2 bg-primary/10 rounded-lg"><Bell size={18} /></div>
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Alert Volume</span>
                        </div>
                        <div className="text-3xl font-black text-foreground">12/wk</div>
                        <p className="text-[10px] text-muted-foreground font-bold">Stable against 30-day baseline.</p>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-3xl shadow-sm glass-card space-y-3">
                        <div className="flex items-center gap-3 text-emerald-500">
                            <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 size={18} /></div>
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Critical Response</span>
                        </div>
                        <div className="text-3xl font-black text-foreground">14m</div>
                        <p className="text-[10px] text-muted-foreground font-bold">Avg time to acknowledge warnings.</p>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-3xl shadow-sm glass-card space-y-3">
                        <div className="flex items-center gap-3 text-blue-500">
                            <div className="p-2 bg-blue-500/10 rounded-lg"><Info size={18} /></div>
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Subscribed Channels</span>
                        </div>
                        <div className="text-3xl font-black text-foreground">4 Hubs</div>
                        <p className="text-[10px] text-muted-foreground font-bold">Trading, Logistics, Risk, and AI Ops.</p>
                    </div>
                </div>

            </div>
        </AppLayout>
    )
}
