"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorFallbackProps {
    error: Error
    resetErrorBoundary: () => void
    title?: string
}

export function ErrorFallback({
    error,
    resetErrorBoundary,
    title = "This section failed to load"
}: ErrorFallbackProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-50 border border-neutral-200 rounded-xl text-center space-y-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <AlertCircle size={24} />
            </div>

            <div className="space-y-1">
                <h3 className="font-semibold text-neutral-900">{title}</h3>
                <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                    {error.message || "An unexpected error occurred in this component."}
                </p>
            </div>

            <Button
                onClick={resetErrorBoundary}
                variant="outline"
                size="sm"
                className="mt-2 border-neutral-300 hover:bg-white"
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Section
            </Button>
        </div>
    )
}
