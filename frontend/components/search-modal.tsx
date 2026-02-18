"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search,
    FileText,
    BarChart3,
    Settings,
    Truck,
    Package,
    Globe,
    X,
    Command
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const searchableItems = [
    { title: 'Dashboard', href: '/', icon: BarChart3, category: 'Pages' },
    { title: 'Quotes', href: '/quotes', icon: FileText, category: 'Pages' },
    { title: 'Analytics', href: '/analytics', icon: BarChart3, category: 'Pages' },
    { title: 'Carriers', href: '/carriers', icon: Truck, category: 'Pages' },
    { title: 'Inventory Monitor', href: '/inventory', icon: Package, category: 'Pages' },
    { title: 'Live Telematics', href: '/tracking', icon: Globe, category: 'Pages' },
    { title: 'Settings', href: '/settings', icon: Settings, category: 'Settings' },
    { title: 'Profile', href: '/settings/profile', icon: Settings, category: 'Settings' },
    { title: 'Billing', href: '/settings/billing', icon: Settings, category: 'Settings' },
    { title: 'Security', href: '/settings/security', icon: Settings, category: 'Settings' },
]

export function SearchModal() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const router = useRouter()

    // Keyboard shortcut: Cmd+K or Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const filteredItems = query === ''
        ? searchableItems
        : searchableItems.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        )

    const handleSelect = (href: string) => {
        setOpen(false)
        setQuery('')
        router.push(href)
    }

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95 group relative"
            >
                <Search size={20} className="group-hover:scale-110 transition-transform" />
                <span className="sr-only">Search (Cmd+K)</span>
                {/* Subtle Indicator */}
                <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
            </button>

            {/* Mobile Search Button */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
                <Search size={20} />
            </button>

            {/* Search Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl p-0 gap-0">
                    <DialogHeader className="px-4 pt-4 pb-0">
                        <DialogTitle className="sr-only">Search</DialogTitle>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <Input
                                placeholder="Search pages, features, settings..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 pr-10 h-14 text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <div className="px-4 pb-3 flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Discovery:</span>
                            <div className="flex gap-2">
                                {['Check Compliance', 'View Quote Matrix', 'Audit Invoices'].map((hint) => (
                                    <button
                                        key={hint}
                                        onClick={() => setQuery(hint)}
                                        className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
                                    >
                                        "{hint}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {filteredItems.length === 0 ? (
                            <div className="py-12 text-center text-sm text-muted-foreground">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredItems.map((item, index) => {
                                    const Icon = item.icon
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleSelect(item.href)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-all text-left group"
                                        >
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                <Icon size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm text-foreground">{item.title}</div>
                                                <div className="text-xs text-muted-foreground">{item.category}</div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">↑↓</kbd>
                            <span>Navigate</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">Enter</kbd>
                            <span>Select</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">Esc</kbd>
                            <span>Close</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
