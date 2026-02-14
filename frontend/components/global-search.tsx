"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Ship,
    Users,
    AlertTriangle,
    FileText,
    BarChart3,
    Truck,
    CreditCard,
    Package,
    FileCheck,
    Settings,
    User,
    History,
    Search,
    Loader2
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

// Icons mapping for dynamic results
const Icons: any = {
    Quote: FileText,
    Carrier: Truck,
    Lane: Ship,
    BarChart: BarChart3,
    Plus: FileText,
    User: User,
    Settings: Settings
}

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        if (!open) {
            setQuery("")
            setResults([])
            return
        }

        const timeoutId = setTimeout(() => {
            if (query.length > 2) {
                setLoading(true)
                fetch(`http://localhost:5000/api/search/global?query=${query}`)
                    .then(res => res.json())
                    .then(data => {
                        setResults(data)
                        setLoading(false)
                    })
                    .catch(err => {
                        console.error(err)
                        setLoading(false)
                    })
            } else {
                setResults([])
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query, open])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
            className="bg-background/95 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/10"
        >
            <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput
                    placeholder="Type to search Quotes, Carriers, or Actions..."
                    className="flex h-12 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    value={query}
                    onValueChange={setQuery}
                />
                {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>

            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {/* DYNAMIC RESULTS */}
                {results.length > 0 && (
                    <CommandGroup heading="Search Results">
                        {results.map((item) => (
                            <CommandItem
                                key={item.id}
                                onSelect={() => runCommand(() => router.push(item.action))}
                                className="aria-selected:bg-primary/10 aria-selected:text-primary aria-selected:border-l-2 border-primary/0 border-transparent transition-all"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold flex items-center gap-2">
                                        {/* Dynamic Icon Rendering could go here if mapped */}
                                        {item.type === "CARRIER" && <Truck size={14} />}
                                        {item.type === "QUOTE" && <FileText size={14} />}
                                        {item.type === "ACTION" && <BarChart3 size={14} />}
                                        {item.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-6">{item.subtitle}</span>
                                </div>
                                {item.value && (
                                    <span className="ml-auto font-mono text-xs font-bold">{item.value}</span>
                                )}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {results.length > 0 && <CommandSeparator />}

                {/* STATIC NAVIGATION (Always visible if no query, or fallback) */}
                {query.length === 0 && (
                    <>
                        <CommandGroup heading="Core Pages">
                            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/tracking"))}>
                                <Ship className="mr-2 h-4 w-4" />
                                <span>Live Telematics</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/logistics/messaging"))}>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Messaging Hub</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/logistics/claims"))}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                <span>Claims Command</span>
                            </CommandItem>
                        </CommandGroup>

                        <CommandSeparator />

                        <CommandGroup heading="Procurement & Analytics">
                            <CommandItem onSelect={() => runCommand(() => router.push("/procurement/tenders"))}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Tender Management</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/analytics/executive"))}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                <span>Executive Analytics</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/lanes"))}>
                                <Truck className="mr-2 h-4 w-4" />
                                <span>Lane Intelligence</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/risk"))}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                <span>Risk Intelligence</span>
                            </CommandItem>
                        </CommandGroup>

                        <CommandSeparator />

                        <CommandGroup heading="Finance & Ops">
                            <CommandItem onSelect={() => runCommand(() => router.push("/settings/billing"))}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing & Usage</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/inventory"))}>
                                <Package className="mr-2 h-4 w-4" />
                                <span>Inventory</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/reconcile"))}>
                                <FileCheck className="mr-2 h-4 w-4" />
                                <span>Invoice Audit</span>
                            </CommandItem>
                        </CommandGroup>

                        <CommandSeparator />

                        <CommandGroup heading="Settings">
                            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/settings/team"))}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Team Members</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/admin/audit"))}>
                                <History className="mr-2 h-4 w-4" />
                                <span>Audit Log</span>
                            </CommandItem>
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </CommandDialog>
    )
}
