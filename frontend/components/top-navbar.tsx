"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
    Menu,
    X,
    Home,
    LayoutDashboard,
    FileText,
    BarChart3,
    Settings,
    Scale,
    Search,
    ChevronDown,
    Gavel,
    TrendingUp,
    Globe,
    Sword,
    ShieldAlert,
    MapPin,
    Receipt,
    Package,
    LifeBuoy,
    FileBadge,
    Zap,
    Terminal,
    Trophy,
    CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchModal } from '@/components/search-modal'
import { NotificationsPanel } from '@/components/notifications-panel'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = [
    {
        name: 'Procurement',
        icon: LayoutDashboard,
        items: [
            { name: 'Mission Control', href: '/dashboard', icon: LayoutDashboard, desc: 'Real-time activity overview' },
            { name: 'Tender Management', href: '/procurement/tenders', icon: Gavel, desc: 'Manage bids and awards' },
            { name: 'Savings Analysis', href: '/quotes', icon: BarChart3, desc: 'Cost optimization insights' },
        ]
    },
    {
        name: 'Intelligence',
        icon: TrendingUp,
        items: [
            { name: 'Intelligence Hub', href: '/analytics', icon: Zap, desc: 'Strategic analytics overview' },
            { name: 'Market Intelligence', href: '/analytics/market', icon: Globe, desc: 'Rate trends and benchmarks' },
            { name: 'Strategic War Room', href: '/analytics/war-room', icon: Sword, desc: 'Simulation and planning' },
        ]
    },
    {
        name: 'Operations',
        icon: Zap,
        items: [
            { name: 'Global Tracking', href: '/tracking', icon: MapPin, desc: 'Live shipment telematics' },
            { name: 'Billing & Usage', href: '/settings/billing', icon: CreditCard, desc: 'Credits and subscription' },
            { name: 'Inventory Sync', href: '/inventory', icon: Package, desc: 'Stock impact prediction' },
            { name: 'Claims Center', href: '/logistics/claims', icon: LifeBuoy, desc: 'Damage and delay recovery' },
        ]
    },
    {
        name: 'Compliance',
        icon: Scale,
        items: [
            { name: 'Legal Center', href: '/settings/legal', icon: Scale, desc: 'Regulatory and T&Cs' },
            { name: 'Trade Compliance', href: '/compliance', icon: FileBadge, desc: 'Customs and HS classification' },
        ]
    },
    {
        name: 'Resources',
        icon: Globe,
        items: [
            { name: 'Help Center', href: '/docs', icon: LifeBuoy, desc: 'Guides and tutorials' },
            { name: 'Engineering Blog', href: '/blog', icon: Zap, desc: 'Latest industry insights' },
            { name: 'Customer Stories', href: '/case-studies', icon: Trophy, desc: 'Measurable ROI success' },
            { name: 'Developer Portal', href: '/api-reference', icon: Terminal, desc: 'API specs and SDKs' },
        ]
    }
]

export function TopNavbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            {/* Main Navbar */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1700px] z-50 rounded-[28px] border border-white/10 bg-background/60 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] glass-card">
                <div className="px-6 lg:px-10">
                    <div className="flex h-16 items-center justify-between">
                        {/* Left: Logo + Desktop Categories */}
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-3 group mr-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-blue-500 to-indigo-600 shadow-xl shadow-primary/20 transition-all group-hover:shadow-primary/40 group-active:scale-95 group-hover:rotate-12">
                                    <Zap size={22} className="text-primary-foreground fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                                </div>
                                <div className="hidden xl:block">
                                    <span className="font-heading text-xl font-black tracking-tighter text-foreground uppercase italic leading-none transition-colors group-hover:text-primary">LogiMatch</span>
                                    <span className="ml-1 font-heading text-xl font-black tracking-tighter text-primary uppercase italic leading-none">AI</span>
                                </div>
                            </Link>
                        </div>

                        {/* Right Side: Home, Portal, Resources, Utility Icons */}
                        <div className="flex items-center gap-1">
                            {/* Home Link */}
                            <Link
                                href="/"
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black tracking-[0.1em] uppercase transition-all border border-transparent shadow-sm mr-1",
                                    pathname === '/'
                                        ? "bg-primary text-primary-foreground shadow-primary/30"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                )}
                            >
                                <Home size={14} className={cn(pathname === '/' ? "fill-white" : "fill-primary")} /> Home
                            </Link>

                            {/* Portal Link (Primary Navigation) */}
                            <Link
                                href="/portal"
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black tracking-[0.1em] uppercase transition-all border border-transparent shadow-sm mr-2",
                                    pathname === '/portal'
                                        ? "bg-primary text-primary-foreground shadow-primary/30"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                )}
                            >
                                <Zap size={14} className={cn(pathname === '/portal' ? "fill-white" : "fill-primary")} /> Portal
                            </Link>

                            {/* Resources Dropdown */}
                            <div className="hidden lg:block relative group/res">
                                <button className={cn(
                                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium tracking-widest transition-all hover:bg-muted/50 text-muted-foreground hover:text-foreground uppercase",
                                    pathname.startsWith('/resources') || categories.find(c => c.name === 'Resources')?.items.some(i => pathname === i.href) ? "text-primary bg-primary/5" : ""
                                )}>
                                    Resources
                                    <ChevronDown size={14} className="opacity-40 group-hover/res:rotate-180 transition-transform duration-300" />
                                </button>
                                <div className="absolute top-full right-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/res:opacity-100 group-hover/res:translate-y-0 group-hover/res:pointer-events-auto transition-all duration-300 z-50">
                                    <div className="w-64 bg-background border border-border/50 rounded-2xl shadow-xl p-2 glass-card">
                                        {categories.find(c => c.name === 'Resources')?.items.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted group/res-item transition-all"
                                            >
                                                <div className="p-1.5 rounded-lg bg-muted group-hover/res-item:bg-primary/20 text-muted-foreground group-hover/res-item:text-primary transition-colors">
                                                    <item.icon size={16} />
                                                </div>
                                                <span className="text-sm font-bold tracking-tight text-foreground group-hover/res-item:text-primary transition-colors">{item.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="h-4 w-[1px] bg-border/40 mx-2 hidden lg:block" />

                            <div className="flex items-center gap-2">
                                {mounted && (
                                    <>
                                        <SearchModal />
                                        <NotificationsPanel />
                                    </>
                                )}

                                <Link
                                    href="/settings"
                                    className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
                                >
                                    <Settings size={20} className="group-hover:rotate-45 transition-transform" />
                                </Link>

                                <div className="flex items-center ml-1 border-l border-border/50 pl-3">
                                    {mounted && (
                                        <UserButton
                                            afterSignOutUrl="/"
                                            appearance={{
                                                elements: {
                                                    avatarBox: "h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-all rounded-xl shadow-md",
                                                    userButtonPopoverCard: "rounded-2xl border-border/50 glass-card",
                                                    userButtonTrigger: "rounded-xl"
                                                }
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="lg:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-90"
                                >
                                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-background/90 backdrop-blur-xl animate-in fade-in" onClick={() => setMobileMenuOpen(false)} />
                    <div className="fixed top-16 left-0 right-0 bottom-0 bg-background border-t border-border overflow-y-auto animate-in slide-in-from-top-1 px-4 py-6">
                        <div className="space-y-8 pb-20">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-bold transition-all active:scale-95",
                                    pathname === '/' ? "bg-primary/10 text-primary shadow-sm" : "text-foreground hover:bg-muted/50"
                                )}
                            >
                                <div className={cn("p-2 rounded-xl", pathname === '/' ? "bg-primary/20" : "bg-muted")}>
                                    <Home size={18} className="text-primary fill-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span>Welcome Home</span>
                                    <span className="text-[10px] font-medium text-muted-foreground">Return to the landing page</span>
                                </div>
                            </Link>

                            <Link
                                href="/portal"
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-bold transition-all active:scale-95",
                                    pathname === '/portal' ? "bg-primary/10 text-primary shadow-sm" : "text-foreground hover:bg-muted/50"
                                )}
                            >
                                <div className={cn("p-2 rounded-xl", pathname === '/portal' ? "bg-primary/20" : "bg-muted")}>
                                    <Zap size={18} className="text-primary fill-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span>Global Command Center</span>
                                    <span className="text-[10px] font-medium text-muted-foreground">Access all modules & insights</span>
                                </div>
                            </Link>

                            <div className="pt-4 border-t border-border/50">
                                <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-primary mb-3">
                                    Resources
                                </h3>
                                <div className="grid grid-cols-1 gap-1">
                                    {categories.find(c => c.name === 'Resources')?.items.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-bold transition-all active:scale-95",
                                                pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn("p-2 rounded-xl", pathname === item.href ? "bg-primary/20" : "bg-muted")}>
                                                <item.icon size={18} />
                                            </div>
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50">
                                <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                                    Direct Access
                                </h3>
                                <div className="grid grid-cols-1 gap-1">
                                    <Link
                                        href="/case-studies"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-bold transition-all active:scale-95",
                                            pathname === '/case-studies' ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        Case Studies
                                    </Link>
                                    <Link
                                        href="/api-reference"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-bold transition-all active:scale-95",
                                            pathname === '/api-reference' ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        API Reference
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
