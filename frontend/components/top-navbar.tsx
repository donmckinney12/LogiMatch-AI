"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
    Search,
    Bell,
    Menu,
    X,
    LayoutDashboard,
    FileText,
    BarChart3,
    Settings,
    Scale
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Quotes', href: '/quotes', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

const secondaryNav = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Legal', href: '/settings/legal', icon: Scale },
]

export function TopNavbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <>
            {/* Main Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Left: Logo + Main Navigation */}
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20 transition-all group-hover:shadow-primary/40">
                                    <span className="text-lg font-black text-primary-foreground">L</span>
                                </div>
                                <div className="hidden sm:block">
                                    <span className="font-heading text-lg font-black tracking-tight text-foreground">LogiMatch</span>
                                    <span className="ml-1 font-heading text-lg font-black tracking-tight text-primary">AI</span>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href ||
                                        (item.href !== '/' && pathname.startsWith(item.href))

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <item.icon size={16} />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Center: Search Bar */}
                        <div className="hidden lg:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    type="text"
                                    placeholder="Search quotes, carriers, analytics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-muted/50 border-border/50 focus:bg-background"
                                />
                            </div>
                        </div>

                        {/* Right: Notifications + User Menu */}
                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
                            </button>

                            {/* Settings (Desktop) */}
                            <Link
                                href="/settings"
                                className="hidden md:flex p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                            >
                                <Settings size={20} />
                            </Link>

                            {/* User Button */}
                            <div className="flex items-center">
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "h-8 w-8"
                                        }
                                    }}
                                />
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                            >
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="fixed top-16 left-0 right-0 bottom-0 bg-background border-t border-border overflow-y-auto">
                        <div className="p-4 space-y-2">
                            {/* Search (Mobile) */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Main Navigation */}
                            {navigation.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/' && pathname.startsWith(item.href))

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <item.icon size={20} />
                                        {item.name}
                                    </Link>
                                )
                            })}

                            {/* Divider */}
                            <div className="my-4 border-t border-border" />

                            {/* Secondary Navigation */}
                            {secondaryNav.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                                >
                                    <item.icon size={20} />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
