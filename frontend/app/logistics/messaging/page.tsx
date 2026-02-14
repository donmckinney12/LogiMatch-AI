"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { AppLayout } from "@/components/app-layout"
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
import {
    MessageSquare,
    Send,
    User,
    Search,
    Filter,
    Paperclip,
    Zap,
    Clock,
    Truck,
    Info,
    ExternalLink,
    ChevronRight,
    Loader2,
    FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function MessagingPage() {
    const { orgId } = useOrg()
    const [threads, setThreads] = useState<any[]>([])
    const [activeThread, setActiveThread] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const fetchThreads = useCallback(async () => {
        try {
            const data = await apiRequest('/api/messaging/threads', {}, orgId)
            setThreads(data)
            if (data.length > 0 && !activeThread) {
                setActiveThread(data[0])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [orgId, activeThread])

    const fetchMessages = useCallback(async (threadId: number) => {
        try {
            const [msgData, suggestData] = await Promise.all([
                apiRequest(`/api/messaging/threads/${threadId}/messages`, {}, orgId),
                apiRequest(`/api/messaging/threads/${threadId}/suggest`, {}, orgId)
            ])
            setMessages(msgData)
            setSuggestions(suggestData)
        } catch (err) {
            console.error(err)
        }
    }, [orgId])

    useEffect(() => {
        fetchThreads()
    }, [fetchThreads])

    useEffect(() => {
        if (activeThread) {
            fetchMessages(activeThread.id)
            const interval = setInterval(() => fetchMessages(activeThread.id), 5000)
            return () => clearInterval(interval)
        }
    }, [activeThread, fetchMessages])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async (e?: React.FormEvent, textOverride?: string) => {
        e?.preventDefault()
        const textToSubmit = textOverride || newMessage
        if (!textToSubmit.trim() || !activeThread) return

        setSending(true)
        try {
            const msg = await apiRequest(`/api/messaging/threads/${activeThread.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToSubmit, sender_name: 'You (Admin)' })
            }, orgId)
            setMessages(prev => [...prev, msg])
            setNewMessage("")
            fetchMessages(activeThread.id)
        } catch (err) {
            console.error(err)
        } finally {
            setSending(false)
        }
    }

    if (loading) return <AppLayout><div className="p-8">Loading collaboration hub...</div></AppLayout>

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto h-[calc(100vh-180px)] min-h-[600px] flex flex-col animate-in">
                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">
                            <MessageSquare size={14} /> Multi-Carrier Collaboration
                        </div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">
                            Messaging <span className="text-indigo-600 dark:text-indigo-400">Hub</span>
                        </h1>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg active:scale-95">
                        <Zap size={16} /> New Conversation
                    </button>
                </header>

                {/* Main Content Pane */}
                <div className="flex-1 bg-card rounded-[40px] border border-border shadow-2xl overflow-hidden flex glass-card">
                    {/* Sidebar: Thread List */}
                    <div className="w-80 border-r border-neutral-100 dark:border-white/5 flex flex-col">
                        <div className="p-6 border-b border-neutral-100 dark:border-white/5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search threads..."
                                    className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-xs font-medium outline-none text-foreground"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {threads.length > 0 ? threads.map((thread) => (
                                <button
                                    key={thread.id}
                                    onClick={() => setActiveThread(thread)}
                                    className={cn(
                                        "w-full p-6 text-left border-b border-border transition-all hover:bg-muted/50 dark:hover:bg-white/5",
                                        activeThread?.id === thread.id ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-l-primary" : ""
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-sm text-foreground">Carrier #{thread.carrier_id}</p>
                                        <span className="text-[10px] font-medium text-muted-foreground">2m</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1 italic">
                                        {thread.last_message || "No messages yet..."}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        {thread.shipment_id && (
                                            <span className="text-[8px] font-black bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase">
                                                SHP-{thread.shipment_id}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            )) : (
                                <div className="p-8 text-center text-muted-foreground space-y-2">
                                    <Clock size={32} className="mx-auto opacity-10" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No Active Threads</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content: Chat window */}
                    <div className="flex-1 flex flex-col relative bg-muted/30 dark:bg-neutral-950/20">
                        {activeThread ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-6 border-b border-border flex items-center justify-between bg-card">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Carrier Support</h3>
                                            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-muted rounded-xl transition-all">
                                            <Info size={20} className="text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>

                                {/* Message List */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                    {messages.map((msg, idx) => {
                                        const isOrg = msg.sender_id.includes('org')
                                        return (
                                            <div key={idx} className={cn(
                                                "flex flex-col max-w-[80%]",
                                                isOrg ? "ml-auto items-end" : "items-start"
                                            )}>
                                                <div className={cn(
                                                    "px-5 py-3 rounded-2xl text-sm font-medium shadow-sm",
                                                    isOrg
                                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                                        : "bg-background text-foreground border border-border rounded-bl-none"
                                                )}>
                                                    {msg.text}
                                                </div>
                                                <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">
                                                    {msg.sender_name} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Suggestions & Input */}
                                <div className="p-8 space-y-4 bg-card border-t border-border">
                                    {suggestions.length > 0 && (
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                                            {suggestions.map((s, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSendMessage(undefined, s)}
                                                    className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-500/30 whitespace-nowrap hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all active:scale-95"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <form onSubmit={handleSendMessage} className="relative">
                                        <input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type message to carrier..."
                                            className="w-full pl-6 pr-14 py-4 bg-muted border border-border rounded-2xl font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm text-foreground"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !newMessage.trim()}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-90 transition-all"
                                        >
                                            {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                                <div className="p-6 bg-blue-50 dark:bg-neutral-900 rounded-[32px] shadow-lg border border-blue-100 dark:border-border">
                                    <MessageSquare size={48} className="text-blue-400 dark:text-muted-foreground/50" />
                                </div>
                                <div>
                                    <h4 className="font-black text-foreground uppercase tracking-widest text-xs">Direct Collaboration Hub</h4>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">Select a thread to start communicating with your carriers in real-time.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Context Sidebar: Shipment Details */}
                    {activeThread && (
                        <div className="w-72 bg-neutral-50 dark:bg-neutral-950/50 p-6 border-l border-border space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Chat Context</h4>
                                <div className="p-4 bg-card rounded-2xl border border-border shadow-sm space-y-4 glass-card">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
                                            <Truck size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-foreground">SHP-{activeThread.shipment_id || "4921"}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground italic">Ocean Freight</p>
                                        </div>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-muted-foreground font-bold uppercase">Status</span>
                                            <span className="font-black text-green-500 uppercase tracking-widest">In Transit</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-neutral-400 font-bold uppercase">ETA Drift</span>
                                            <span className="font-black text-rose-500">+12.5h</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Shared Artifacts</h4>
                                <button className="w-full p-4 border border-dashed border-neutral-200 dark:border-white/10 rounded-2xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Paperclip size={14} /> Attach BOL / PL
                                </button>
                                <div className="space-y-2">
                                    <div className="p-3 bg-card border border-border rounded-xl flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-neutral-400" />
                                            <span className="text-[10px] font-bold dark:text-neutral-300">Commercial_Invoice.pdf</span>
                                        </div>
                                        <ExternalLink size={12} className="text-neutral-300 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
                                    View Full Ledger
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
