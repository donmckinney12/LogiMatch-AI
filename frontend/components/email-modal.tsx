"use client"

import { useState, useEffect } from 'react'
import { Copy, Check, Loader2, Mail } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface EmailModalProps {
    isOpen: boolean
    onClose: () => void
    data: any
}

import { apiRequest, getApiUrl } from '@/lib/api-client'

export function EmailModal({ isOpen, onClose, data }: EmailModalProps) {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState<{ subject: string; body: string } | null>(null)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Generate email when modal opens if not already generated
    useEffect(() => {
        if (isOpen && data && !email) {
            generateEmail()
        }
        if (!isOpen) {
            setEmail(null) // Reset on close
            setCopied(false)
            setError(null)
        }
    }, [isOpen, data])

    const generateEmail = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await apiRequest('/api/generate-email', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            setEmail(result)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadPDF = async () => {
        if (!data) return
        try {
            const baseUrl = getApiUrl()
            const res = await fetch(`${baseUrl}/api/generate-booking-pdf`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Organization-ID": "org_demo_123" },
                body: JSON.stringify(data)
            })
            if (res.ok) {
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `Booking_${data.carrier}.pdf`
                document.body.appendChild(a)
                a.click()
                a.remove()
            }
        } catch (e) {
            console.error("Failed to download PDF", e)
        }
    }

    const handleCopy = () => {
        if (!email) return
        const text = `Subject: ${email.subject}\n\n${email.body}`
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        Booking Confirmation Draft
                    </DialogTitle>
                    <DialogDescription>
                        AI-generated email for {data?.carrier || 'Carrier'}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                            <Loader2 className="h-8 w-8 animate-spin mb-2 text-blue-600" />
                            <p>Drafting email...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm">
                            Error: {error}
                            <button onClick={generateEmail} className="block mt-2 font-medium underline">Try Again</button>
                        </div>
                    ) : email ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Subject</label>
                                <div className="p-2 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded text-sm font-medium text-neutral-900 dark:text-white mt-1">
                                    {email.subject}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Body</label>
                                <div className="p-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded text-sm text-neutral-700 dark:text-neutral-300 mt-1 whitespace-pre-wrap h-48 overflow-y-auto">
                                    {email.body}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <DialogFooter className="sm:justify-between gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                    {email && (
                        <button
                            onClick={handleDownloadPDF}
                            disabled={loading}
                            className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-white/5"
                        >
                            Download PDF Order
                        </button>
                    )}
                    {email && (
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "px-4 py-2 text-sm font-medium text-white rounded-lg transition-all flex items-center gap-2",
                                copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                            )}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? "Copied!" : "Copy to Clipboard"}
                        </button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
