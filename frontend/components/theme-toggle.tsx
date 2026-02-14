"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <div className="p-2 h-9 w-9 rounded-xl border border-border opacity-50" />
    )

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-all active:scale-95 relative flex items-center justify-center"
            aria-label="Toggle theme"
        >
            {resolvedTheme === "light" ? (
                <Sun className="h-5 w-5 text-primary transition-all scale-100" />
            ) : (
                <Moon className="h-5 w-5 text-indigo-400 transition-all scale-100" />
            )}
        </button>
    )
}
