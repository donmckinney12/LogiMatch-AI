"use client"

import * as React from "react"
import { Send, X, MessageSquare, Sparkles, ChevronRight, Loader2, Bot, ShieldAlert, FileText, Zap, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    actions?: any[]
}

export function AISidekick() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [input, setInput] = React.useState("")
    const [messages, setMessages] = React.useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm Atlas, your LogiMatch AI assistant. I can help you navigate, summarize data, or draft communications. How can I assist you today?",
            timestamp: new Date()
        }
    ])
    const [isLoading, setIsLoading] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    const router = useRouter()

    // Auto-scroll to bottom
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const res = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    context: { page: pathname }
                })
            })

            const data = await res.json()

            if (data.error) throw new Error(data.error)

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message,
                timestamp: new Date(),
                actions: data.actions
            }

            setMessages(prev => [...prev, aiMsg])

            // Handle Auto-Actions with Toasts
            if (data.actions) {
                data.actions.forEach((action: any) => {
                    if (action.type === "NAVIGATE") {
                        toast.info(`Navigating to ${action.payload.replace('/', ' ').trim() || 'Dashboard'}...`, {
                            icon: <Loader2 size={16} className="animate-spin" />
                        })
                        setTimeout(() => router.push(action.payload), 1500)
                    }
                    if (action.type === "DRAFT_EMAIL") {
                        toast.success("Email draft generated!")
                    }
                })
            }

        } catch (err) {
            toast.error("Cloud link disrupted. Reconnecting...")
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: "assistant",
                content: "I'm having trouble connecting to the neural core. Please try again.",
                timestamp: new Date()
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

            {/* Hidden SVG Filter for Neon Glow */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <filter id="ai-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
            </svg>

            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="w-[400px] h-[600px] bg-[#0B0E14]/60 backdrop-blur-[32px] border border-white/10 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500 ring-1 ring-white/5">

                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary relative">
                                <Bot size={20} style={{ filter: 'url(#ai-glow)' }} className="animate-pulse" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#151921] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm tracking-tight text-white uppercase">Atlas</h3>
                                <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">Core v4.2 Active</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-white/5 text-muted-foreground/50 hover:text-white transition-all" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </Button>
                    </div>

                    {/* Chat Area */}
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className={cn(
                                    "flex gap-4 max-w-[85%]",
                                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                )}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500",
                                        msg.role === "user"
                                            ? "bg-white/5 border-white/10 text-white/50"
                                            : "bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                    )}>
                                        {msg.role === "user" ? <span className="text-[10px] font-black uppercase">You</span> : <Sparkles size={14} />}
                                    </div>

                                    <div className={cn(
                                        "p-4 text-sm font-medium leading-relaxed transition-all duration-500",
                                        msg.role === "user"
                                            ? "bg-primary text-white rounded-3xl rounded-tr-none shadow-xl shadow-primary/10"
                                            : "bg-white/[0.03] border border-white/10 text-white/90 rounded-3xl rounded-tl-none backdrop-blur-sm"
                                    )}>
                                        <p className="leading-relaxed">{msg.content}</p>

                                        {/* Operational Hooks for AI suggestions */}
                                        {msg.role === "assistant" && msg.content.toLowerCase().includes("overcharge") && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-red-500/20 transition-all">
                                                    <ShieldAlert size={12} /> Resolve Overcharge
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-blue-500/20 transition-all">
                                                    <FileText size={12} /> View Audit Trail
                                                </button>
                                            </div>
                                        )}

                                        {msg.role === "assistant" && (msg.content.toLowerCase().includes("lane") || msg.content.toLowerCase().includes("savings")) && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-emerald-500/20 transition-all">
                                                    <Zap size={12} /> Run Solver
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-indigo-500/20 transition-all">
                                                    <ArrowRight size={12} /> Update RFP
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                        <Sparkles size={14} className="text-primary animate-pulse" />
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/10 p-4 rounded-3xl rounded-tl-none flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:1s]" />
                                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                        <form
                            className="relative flex items-center"
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Sync with Atlas..."
                                className="h-14 pl-6 pr-14 bg-white/[0.03] border-white/10 rounded-2xl text-sm font-medium placeholder:text-white/20 focus-visible:ring-primary/30 focus-visible:bg-white/[0.06] transition-all"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                disabled={!input.trim() || isLoading}
                            >
                                <Send size={16} className="text-white" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* TOGGLE BUTTON - Sleek Minimalist Glassy Orb */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-16 w-16 rounded-[24px] flex items-center justify-center transition-all duration-500 relative group overflow-hidden",
                    isOpen
                        ? "bg-white/10 rotate-90 scale-90"
                        : "bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-primary/50 hover:scale-110 active:scale-95"
                )}
            >
                {/* Inner Glow Pulse */}
                {!isOpen && (
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                )}

                {/* Neon Ring Effect */}
                {!isOpen && (
                    <div className="absolute inset-0 rounded-[24px] ring-1 ring-white/20 group-hover:ring-primary/50 transition-all duration-500" />
                )}

                {/* Spotlight Cursor Effect (Simulated with Gradient) */}
                {!isOpen && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(59,130,246,0.4)_0%,transparent_70%)] transition-opacity duration-500" />
                )}

                {isOpen ? (
                    <X size={24} className="text-white/50" />
                ) : (
                    <div className="relative">
                        <Sparkles size={28} className="text-primary animate-pulse" style={{ filter: 'url(#ai-glow)' }} />
                        <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                )}
            </button>
        </div>
    )
}
