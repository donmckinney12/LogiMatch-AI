"use client"

import { useState } from 'react'
import { CheckCircle, Loader2, Truck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/app-layout'

import { apiRequest } from '@/lib/api-client'

export default function VendorOnboardingPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        company_name: '',
        email: '',
        tax_id: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await apiRequest('/api/vendors/onboarding', {
                method: 'POST',
                body: JSON.stringify(formData)
            })

            setSubmitted(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center bg-card dark:border-white/10 glass-card">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 dark:bg-green-500/10 p-3 rounded-full mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl dark:text-white">Application Received!</CardTitle>
                        <CardDescription className="dark:text-neutral-400">
                            Thank you for registering. Our compliance team will review your details and contact you at {formData.email}.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Truck className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-foreground">LogiMatch Supply Network</span>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400">Join our preferred carrier network</p>
            </div>

            <Card className="w-full max-w-md bg-card dark:border-white/10 glass-card">
                <CardHeader>
                    <CardTitle className="dark:text-white">Carrier Registration</CardTitle>
                    <CardDescription className="dark:text-neutral-400">Enter your company details to verify eligibility.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-neutral-300">Company Name</label>
                            <input
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.company_name}
                                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                placeholder="e.g. Maersk Data Inc."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-neutral-300">Business Email</label>
                            <input
                                required
                                type="email"
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="partners@maersk.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-neutral-300">Tax ID / EIN</label>
                            <input
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.tax_id}
                                onChange={e => setFormData({ ...formData, tax_id: e.target.value })}
                                placeholder="XX-XXXXXXX"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:brightness-110 disabled:opacity-50 flex items-center justify-center transition-colors"
                        >
                            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                            Submit Application
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
