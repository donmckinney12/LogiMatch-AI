"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Truck, Settings, BarChart3, Package, Users, User, Activity, History as HistoryIcon, ShieldCheck, ShieldAlert, Briefcase, Trophy, Globe, FileCheck, Zap, MessageSquare, Menu, X, Bell, Link as LinkIcon, Shield, HelpCircle, Crosshair, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton, OrganizationSwitcher, useOrganization } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlobalSearch } from "@/components/global-search"
import { FeatureGate } from "@/components/feature-gate"
import { AISidekick } from "@/components/ai-sidekick"
import { Button } from "@/components/ui/button"

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { organization } = useOrganization()
    const [hasMounted, setHasMounted] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const currentOrgId = organization?.id || "org_demo_123"

    const sections = [
        {
            title: "Operations",
            links: [
                { href: "/", label: "Dashboard", icon: LayoutDashboard },
                { href: "/notifications", label: "Notifications", icon: Bell },
                { href: "/procurement/tenders", label: "Procurement Events", icon: Briefcase },
                { href: "/inventory", label: "Inventory Monitor", icon: Package },
                { href: "/tracking", label: "Live Telematics", icon: Globe },
                { href: "/compliance/trade", label: "Global Trade", icon: ShieldCheck },
                { href: "/logistics/claims", label: "Freight Claims", icon: ShieldAlert },
                { href: "/logistics/messaging", label: "Collaboration Hub", icon: MessageSquare },
                { href: "/carriers", label: "Carrier Directory", icon: Truck },
                { href: "/vendors/quote", label: "Direct Quoting", icon: Truck },
            ]
        },
        {
            title: "Governance",
            links: [
                { href: "/admin/audit", label: "Governance Explorer", icon: ShieldCheck },
                { href: "/compliance", label: "Audit Assistant", icon: HistoryIcon },
                { href: "/reconcile", label: "Financial Audit", icon: FileCheck },
                { href: "/settings/legal", label: "Legal & Compliance", icon: Scale },
            ]
        },
        {
            title: "Strategic BI",
            links: [
                { href: "/analytics/war-room", label: "Executive War Room", icon: Crosshair },
                { href: "/analytics/market", label: "Market Intelligence", icon: Activity },
                { href: "/analytics/executive", label: "Executive Insights", icon: BarChart3 },
                { href: "/carriers/leaderboard", label: "Carrier Leaderboard", icon: Trophy },
                { href: "/lanes", label: "Lane Intelligence", icon: Globe },
                { href: "/risk", label: "Risk Intelligence", icon: ShieldAlert },
                { href: "/sandbox", label: "Simulation Sandbox", icon: Zap },
            ]
        },
        {
            title: "Settings",
            links: [
                { href: "/settings/profile", label: "User Profile", icon: User },
                { href: "/settings/integrations", label: "Integrations & API", icon: LinkIcon },
                { href: "/settings/security", label: "Security Vault", icon: Shield },
                { href: "/settings/billing", label: "Billing & Usage", icon: Briefcase },
                { href: "/settings/team", label: "Team Management", icon: Users },
                { href: "/settings", label: "Platform Settings", icon: Settings },
                { href: "/docs", label: "Help Center", icon: HelpCircle },
                { href: "/contact", label: "Contact Support", icon: MessageSquare },
            ]
        }
    ]

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground transition-colors overflow-x-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card/80 backdrop-blur-md z-30 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-lg tracking-tight">LogiMatch AI</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            </header>

            {/* Sidebar Desktop & Mobile Overlay */}
            <aside className={cn(
                "w-64 border-r border-border bg-card flex flex-col fixed h-full z-40 transition-all duration-300 lg:translate-x-0",
                isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-6 border-b border-border flex items-center gap-2">
                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-lg tracking-tight">LogiMatch AI</span>
                </div>

                <div className="p-4 border-b border-border bg-muted/30 min-h-[65px]">
                    {hasMounted && (
                        <OrganizationSwitcher
                            afterCreateOrganizationUrl="/"
                            afterLeaveOrganizationUrl="/"
                            afterSelectOrganizationUrl="/"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    organizationSwitcherTrigger: "w-full px-3 py-2 bg-card border border-border rounded-xl hover:bg-muted/50 transition-all text-foreground",
                                    organizationPreviewMainIdentifier: "text-sm font-bold text-foreground",
                                    organizationPreviewSecondaryIdentifier: "text-[10px] font-medium text-muted-foreground"
                                }
                            }}
                        />
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto mt-2">
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-1">
                            <h3 className="px-3 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest mb-2">
                                {section.title}
                            </h3>
                            {section.links.map((link) => {
                                const Icon = link.icon
                                const isActive = pathname === link.href
                                return (
                                    <div key={link.href}>
                                        {link.href === "/tracking" ? (
                                            <FeatureGate requiredTier="BASE" showLock fallback={
                                                <div className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative group text-muted-foreground/50 cursor-not-allowed"
                                                )}>
                                                    <Icon size={18} />
                                                    {link.label}
                                                </div>
                                            }>
                                                <Link
                                                    href={link.href}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative group",
                                                        isActive
                                                            ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    {isActive && (
                                                        <div className="absolute left-[-1rem] top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[2px_0_8px_rgba(37,99,235,0.4)]" />
                                                    )}
                                                    <Icon size={18} className={cn(isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                                    {link.label}
                                                </Link>
                                            </FeatureGate>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative group",
                                                    isActive
                                                        ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                {isActive && (
                                                    <div className="absolute left-[-1rem] top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[2px_0_8px_rgba(37,99,235,0.4)]" />
                                                )}
                                                <Icon size={18} className={cn(isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                                {link.label}
                                            </Link>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-border flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                        {hasMounted && <UserButton afterSignOutUrl="/" />}
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">Account</span>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </aside>

            {/* Mobile Backdrop Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 transition-all">
                <div className="max-w-6xl mx-auto space-y-8">
                    {children}
                </div>
                <GlobalSearch />
                <AISidekick />
            </main>
        </div>
    )
}

