"use client"

import { useState, useEffect } from "react"
import {
    X,
    Send,
    MessageSquare,
    User,
    Clock,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Comment {
    id: number
    user_id: string
    content: string
    timestamp: string
}

interface CommentThreadProps {
    quoteId: number
    filename: string
    onClose: () => void
    isOpen: boolean
}

export function CommentThread({ quoteId, filename, onClose, isOpen }: CommentThreadProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen && quoteId) {
            fetchComments()
        }
    }, [isOpen, quoteId])

    const fetchComments = async () => {
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:5000/api/quotes/${quoteId}/comments`, {
                headers: {
                    'X-Organization-ID': 'org_demo_123' // Mock for Phase 12
                }
            })
            const data = await res.json()
            setComments(data)
        } catch (err) {
            console.error("Failed to fetch comments", err)
        } finally {
            setLoading(false)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setSubmitting(true)
        try {
            const res = await fetch(`http://localhost:5000/api/quotes/${quoteId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Organization-ID': 'org_demo_123'
                },
                body: JSON.stringify({
                    content: newComment,
                    user_id: 'PilotUser_01' // Mock
                })
            })
            if (res.ok) {
                const added = await res.json()
                setComments([...comments, added])
                setNewComment("")
            }
        } catch (err) {
            console.error("Failed to post comment", err)
        } finally {
            setSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col border-l border-neutral-200 dark:border-white/10 animate-in slide-in-from-right duration-300 glass-card rounded-none">
            <header className="p-4 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between bg-neutral-50/50 dark:bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <MessageSquare size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Team Discussion</h3>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate w-48 font-medium uppercase tracking-tighter">
                            {filename}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full transition-colors text-neutral-400">
                    <X size={20} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-neutral-50/20 dark:bg-black/20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-2">
                        <Loader2 className="animate-spin" size={24} />
                        <span className="text-xs font-semibold uppercase tracking-widest">Syncing Thread...</span>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400 dark:text-neutral-500 gap-3 grayscale opacity-50">
                        <MessageSquare size={48} strokeWidth={1} />
                        <p className="text-xs font-bold uppercase tracking-widest">No internal notes yet</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="group">
                            <div className="flex items-center justify-between mb-1.5 px-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-[10px] text-white font-bold">
                                        {comment.user_id.charAt(0)}
                                    </div>
                                    <span className="text-[11px] font-black text-neutral-900 dark:text-white">{comment.user_id}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase">
                                    <Clock size={10} />
                                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 p-3 rounded-2xl rounded-tl-none shadow-sm group-hover:shadow-md dark:shadow-none transition-shadow">
                                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <footer className="p-4 border-t border-neutral-100 dark:border-white/5 bg-white dark:bg-neutral-900 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
                <form onSubmit={handleSend} className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Discuss this quote with your team..."
                        className="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl p-4 pr-12 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 resize-none min-h-[100px] transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className={cn(
                            "absolute bottom-3 right-3 p-2 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale",
                            "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-neutral-300"
                        )}
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </form>
                <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-black uppercase tracking-widest">Team Workspace Active</span>
                </div>
            </footer>
        </div>
    )
}
