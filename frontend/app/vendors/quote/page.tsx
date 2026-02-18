"use client"

import { useState } from 'react'
import { Plus, Trash2, Send, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/app-layout'

import { apiRequest } from '@/lib/api-client'

export default function DirectQuotePage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        carrier: '',
        origin: '',
        destination: '',
        total_price: '',
        currency: 'USD',
        validity_date: '',
        surcharges: [] as { raw_name: string, amount: string }[]
    })

    const addSurcharge = () => {
        setFormData({
            ...formData,
            surcharges: [...formData.surcharges, { raw_name: '', amount: '' }]
        })
    }

    const removeSurcharge = (index: number) => {
        const newSurcharges = [...formData.surcharges]
        newSurcharges.splice(index, 1)
        setFormData({ ...formData, surcharges: newSurcharges })
    }

    const updateSurcharge = (index: number, field: 'raw_name' | 'amount', value: string) => {
        const newSurcharges = [...formData.surcharges]
        newSurcharges[index][field] = value
        setFormData({ ...formData, surcharges: newSurcharges })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Transform for API
            const payload = {
                ...formData,
                total_price: parseFloat(formData.total_price),
                surcharges: formData.surcharges.map(s => ({
                    raw_name: s.raw_name,
                    amount: parseFloat(s.amount),
                    currency: formData.currency
                }))
            }

            await apiRequest('/api/quotes/direct', {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            setSubmitted(true)
        } catch (err) {
            alert("Failed to submit quote")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl text-green-600">Quote Received</CardTitle>
                        <CardDescription>
                            Your quote has been processed and added to our system.
                            <br />
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 text-blue-600 underline font-medium"
                            >
                                Submit Another
                            </button>
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-foreground animate-in">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground">Direct Quote Submission</h1>
                    <p className="text-muted-foreground">Submit freight rates directly to LogiMatch.</p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Route Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Carrier Name</label>
                                    <input
                                        required
                                        className="w-full px-3 py-2 border border-border bg-card rounded-md text-foreground"
                                        value={formData.carrier}
                                        onChange={e => setFormData({ ...formData, carrier: e.target.value })}
                                        placeholder="e.g. MSC"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Validity Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 border border-border bg-card rounded-md text-foreground"
                                        value={formData.validity_date}
                                        onChange={e => setFormData({ ...formData, validity_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Origin (POL)</label>
                                    <input
                                        required
                                        className="w-full px-3 py-2 border border-border bg-card rounded-md text-foreground"
                                        value={formData.origin}
                                        onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Destination (POD)</label>
                                    <input
                                        required
                                        className="w-full px-3 py-2 border border-border bg-card rounded-md text-foreground"
                                        value={formData.destination}
                                        onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold">Surcharges / Line Items</label>
                                    <button
                                        type="button"
                                        onClick={addSurcharge}
                                        className="text-xs flex items-center gap-1 text-blue-600 font-medium"
                                    >
                                        <Plus size={14} /> Add Item
                                    </button>
                                </div>

                                {formData.surcharges.map((s, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            placeholder="Item Name (e.g. BAF)"
                                            className="flex-1 px-3 py-2 border rounded-md text-sm"
                                            value={s.raw_name}
                                            onChange={e => updateSurcharge(i, 'raw_name', e.target.value)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            className="w-24 px-3 py-2 border rounded-md text-sm"
                                            value={s.amount}
                                            onChange={e => updateSurcharge(i, 'amount', e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSurcharge(i)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="pt-4 border-t flex gap-4">
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-semibold">Total All-In Price</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border border-border bg-card rounded-md font-mono font-bold text-foreground"
                                        value={formData.total_price}
                                        onChange={e => setFormData({ ...formData, total_price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 w-24">
                                    <label className="text-sm font-semibold">Currency</label>
                                    <select
                                        className="w-full px-3 py-2 border border-border bg-card rounded-md text-foreground"
                                        value={formData.currency}
                                        onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        <option>USD</option>
                                        <option>EUR</option>
                                        <option>GBP</option>
                                        <option>CNY</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/10"
                            >
                                {loading && <Loader2 className="animate-spin" />}
                                Submit Quote
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
