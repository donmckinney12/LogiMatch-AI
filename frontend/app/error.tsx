"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an analytics service or backend if needed
        console.error("Global Error Captured:", error)
    }, [error])

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-neutral-200 max-w-md w-full space-y-6">
                <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <AlertTriangle size={32} />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
                    <p className="text-neutral-500">
                        We encountered an unexpected error. Don't worry, your data is safe.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-neutral-400 font-mono mt-2">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Button
                        onClick={() => reset()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                    >
                        <RefreshCcw className="mr-2 h-5 w-5" />
                        Try Again
                    </Button>

                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full py-6 text-lg border-neutral-300">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-sm text-neutral-400">
                If this persists, please use the feedback widget to let us know.
            </p>
        </div>
    )
}
