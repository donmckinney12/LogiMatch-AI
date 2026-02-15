"use client"

import { useState, useEffect } from "react"
import { TopNavbar } from "@/components/top-navbar"
import { GlobalSearch } from "@/components/global-search"
import { AISidekick } from "@/components/ai-sidekick"

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground transition-colors">
            {/* Top Navbar */}
            <TopNavbar />

            {/* Main Content */}
            <main className="flex-1 pt-16 transition-all">
                <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>

                {/* Global Features */}
                {hasMounted && (
                    <>
                        <GlobalSearch />
                        <AISidekick />
                    </>
                )}
            </main>
        </div>
    )
}
