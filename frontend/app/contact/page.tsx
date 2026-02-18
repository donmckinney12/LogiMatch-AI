"use client"

import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useUser } from '@clerk/nextjs'
import { Loader2, CheckCircle2, AlertCircle, Mail, MessageSquare, Bug, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

import { apiRequest } from '@/lib/api-client'

export default function ContactPage() {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Form State
    const [category, setCategory] = useState("GENERAL")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!subject.trim() || !message.trim()) return

        setLoading(true)
        try {
            // Reusing the existing feedback endpoint, mimicking a "ticket" creation
            await apiRequest('/api/feedback', {
                method: 'POST',
                body: JSON.stringify({
                    user_id: user?.id || 'Anonymous',
                    category,
                    message: `[SUBJECT: ${subject}] ${message}`,
                    page_url: "CONTACT_PAGE"
                })
            })

            setSuccess(true)
            toast.success("Support ticket created successfully!")
            setSubject("")
            setMessage("")
            setCategory("GENERAL")
        } catch (err) {
            console.error(err)
            toast.error("Failed to submit ticket. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Contact & Support</h1>
                    <p className="text-muted-foreground">
                        Need help? Found a bug? Have a feature idea? Let our team know.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Contact Form */}
                    <Card className="md:col-span-2 border-primary/10 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                Submit a Ticket
                            </CardTitle>
                            <CardDescription>
                                We typically respond within 24 hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {success ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold">Ticket Received!</h3>
                                    <p className="text-muted-foreground max-w-xs">
                                        Thank you for reaching out. A confirmation email has been sent to your inbox.
                                    </p>
                                    <Button variant="outline" onClick={() => setSuccess(false)}>
                                        Submit Another
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={category} onValueChange={setCategory}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="GENERAL">
                                                    <div className="flex items-center gap-2">
                                                        <MessageSquare size={14} /> General Inquiry
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="BUG">
                                                    <div className="flex items-center gap-2">
                                                        <Bug size={14} /> Report a Bug
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="FEATURE">
                                                    <div className="flex items-center gap-2">
                                                        <Lightbulb size={14} /> Feature Request
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Input
                                            placeholder="Brief summary of the issue..."
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Message</Label>
                                        <Textarea
                                            placeholder="Describe the issue in detail..."
                                            className="min-h-[150px] resize-none"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={loading} className="w-full md:w-auto">
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Submit Ticket
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* Support Info */}
                    <div className="space-y-6">
                        <Card className="bg-muted/30 border-none shadow-inner">
                            <CardHeader>
                                <CardTitle className="text-base">Quick Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="link" className="px-0 h-auto text-muted-foreground hover:text-primary justify-start">
                                    View Documentation
                                </Button>
                                <Button variant="link" className="px-0 h-auto text-muted-foreground hover:text-primary justify-start">
                                    API Reference
                                </Button>
                                <Button variant="link" className="px-0 h-auto text-muted-foreground hover:text-primary justify-start">
                                    System Status
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Enterprise Support</h4>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                            For urgent issues, please call your dedicated account manager or use the emergency hotline: <br />
                                            <span className="font-mono font-bold">+1 (888) LOGI-AI</span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
