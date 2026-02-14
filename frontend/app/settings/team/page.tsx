"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import {
    Users,
    UserPlus,
    Shield,
    Mail,
    MoreHorizontal,
    Trash2,
    UserCheck,
    Clock,
    Search,
    ShieldAlert
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function TeamManagementPage() {
    const { organization, memberships, isLoaded } = useOrganization({
        memberships: {
            pageSize: 10,
            keepPreviousData: true,
        },
    })

    const [searchQuery, setSearchQuery] = useState("")

    if (!isLoaded) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
                    <Users size={48} className="text-blue-500 mb-4" />
                    <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Loading Team Roster...</span>
                </div>
            </AppLayout>
        )
    }

    if (!organization) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center max-w-md mx-auto">
                    <div className="p-6 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-[32px]">
                        <ShieldAlert size={48} />
                    </div>
                    <h1 className="text-2xl font-black text-foreground">Personal Account Detected</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">Team management is only available within an Organization context. Please switch to an organization using the sidebar.</p>
                </div>
            </AppLayout>
        )
    }

    const members = memberships?.data || []

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                            <Shield size={14} /> Organization Governance
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            Team <span className="text-blue-600 dark:text-blue-400">Console</span>
                        </h1>
                        <p className="text-muted-foreground font-medium italic">
                            Managing {organization.name} — {members.length} active members
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-900/10 dark:shadow-none active:scale-95">
                        <UserPlus size={18} /> Invite Colleague
                    </button>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    {/* Member Directory */}
                    <div className="bg-card rounded-[40px] border border-border shadow-sm overflow-hidden glass-card">
                        <div className="p-8 border-b border-neutral-50 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/10 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 transition-all dark:text-white"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <span className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <UserCheck size={14} /> Active Members
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">User</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Role</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Joined</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                                    {members.map((membership: any) => (
                                        <tr key={membership.id} className="group hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={membership.publicUserData.imageUrl}
                                                        alt=""
                                                        className="w-10 h-10 rounded-2xl object-cover ring-2 ring-neutral-100 ring-offset-2"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-foreground leading-none mb-1">
                                                            {membership.publicUserData.firstName} {membership.publicUserData.lastName}
                                                        </p>
                                                        <p className="text-xs text-neutral-400 font-medium">
                                                            {membership.publicUserData.identifier}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    membership.role === 'admin' ? "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400" : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400"
                                                )}>
                                                    {membership.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                    <Clock size={14} className="text-muted-foreground/50" />
                                                    {new Date(membership.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pending Invitations Stub */}
                    <div className="bg-card rounded-[40px] p-10 text-foreground flex flex-col md:flex-row items-center justify-between gap-8 border border-border shadow-sm glass-card">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                                <Mail className="text-blue-500" /> Pending Invitations
                            </h3>
                            <p className="text-muted-foreground text-sm font-medium">
                                Growth tracking: Invite new auditors or procurement managers to join {organization.name}.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-2xl bg-muted border-4 border-card flex items-center justify-center text-[10px] font-black text-muted-foreground">
                                        INV
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm font-bold text-muted-foreground">0 pending</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
