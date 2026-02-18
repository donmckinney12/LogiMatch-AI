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

import { apiRequest } from '@/lib/api-client'

function CheckoutContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user } = useUser()

    const tier = searchParams.get('tier') || 'BASE'
    const price = parseFloat(searchParams.get('price') || '99')
    const interval = searchParams.get('interval') || 'month'

    const [isProcessing, setIsProcessing] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            const data = await apiRequest('/api/create-checkout-session', {
                method: 'POST',
                body: JSON.stringify({
                    tier,
                    price,
                    interval,
                    user_id: user?.id
                }),
            })

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url
            } else {
                throw new Error(data.error || 'Failed to create checkout session')
            }
        } catch (error: any) {
            console.error('Checkout error:', error)
            toast.error(error.message || 'Payment service is currently unavailable')
            setIsProcessing(false)
        }
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

                    {/* Payment Confirmation */}
                    <div className="md:col-span-2">
                        <Card className="border-border bg-card glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Lock size={20} />
                                    </div>
                                    Secure Payment
                                </CardTitle>
                                <CardDescription>
                                    You will be redirected to Stripe to securely complete your payment.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="text-primary mt-1" size={18} />
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-foreground">Secure & Encrypted</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Your payment details are never stored on our servers. LogiMatch AI uses Stripe for industry-leading security and compliance.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full h-14 text-base font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="animate-spin mr-2" size={20} />
                                                    Redirecting to Stripe...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="mr-2" size={20} />
                                                    Proceed to Secure Payment — ${price.toFixed(2)}
                                                </>
                                            )}
                                        </Button>
                                        <p className="mt-4 text-[10px] text-center text-muted-foreground/60 uppercase tracking-widest font-bold">
                                            Trusted by 500+ global logistics companies
                                        </p>
                                    </form>
                                </div>
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
