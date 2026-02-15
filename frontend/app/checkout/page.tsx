"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Lock, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

function CheckoutContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user } = useUser()

    const tier = searchParams.get('tier') || 'BASE'
    const price = parseFloat(searchParams.get('price') || '99')
    const interval = searchParams.get('interval') || 'month'

    const [isProcessing, setIsProcessing] = useState(false)
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')
    const [name, setName] = useState('')

    useEffect(() => {
        if (user?.fullName) {
            setName(user.fullName)
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        // In production, this would call Stripe API
        toast.success(`Successfully subscribed to ${tier} plan!`)

        // Redirect to billing page
        setTimeout(() => {
            router.push('/settings/billing')
        }, 1500)
    }

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ''
        const parts = []

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4)
        }
        return v
    }

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in pb-12">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-muted rounded-xl transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Secure Checkout</h1>
                        <p className="text-muted-foreground">Complete your subscription to LogiMatch AI</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <Card className="border-border bg-card glass-card sticky top-8">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="text-2xl font-black text-foreground">{tier} Plan</div>
                                    <div className="text-sm text-muted-foreground font-medium">
                                        Billed {interval === 'month' ? 'monthly' : 'annually'}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-border">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-bold text-foreground">${price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span className="font-bold text-foreground">$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-lg pt-3 border-t border-border">
                                        <span className="font-black text-foreground">Total</span>
                                        <span className="font-black text-primary">${price.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Lock size={12} />
                                        <span>Secured by Stripe</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Form */}
                    <div className="md:col-span-2">
                        <Card className="border-border bg-card glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <CreditCard size={20} />
                                    </div>
                                    Payment Information
                                </CardTitle>
                                <CardDescription>Enter your payment details to complete your subscription</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Cardholder Name</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Card Number</Label>
                                        <Input
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            placeholder="4242 4242 4242 4242"
                                            maxLength={19}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">Use test card: 4242 4242 4242 4242</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Expiry Date</Label>
                                            <Input
                                                value={expiry}
                                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CVC</Label>
                                            <Input
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                placeholder="123"
                                                maxLength={3}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 space-y-4">
                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full h-12 text-sm font-black uppercase tracking-widest"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="animate-spin mr-2" size={16} />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="mr-2" size={16} />
                                                    Complete Payment - ${price.toFixed(2)}
                                                </>
                                            )}
                                        </Button>

                                        <p className="text-xs text-center text-muted-foreground">
                                            By confirming your subscription, you agree to our Terms of Service and Privacy Policy.
                                        </p>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <AppLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            </AppLayout>
        }>
            <CheckoutContent />
        </Suspense>
    )
}
