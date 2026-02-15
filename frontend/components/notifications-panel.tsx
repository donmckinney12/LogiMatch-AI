"use client"

import { useState } from 'react'
import { Bell, Check, X, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

// Mock notifications - in production, fetch from API
const mockNotifications = [
    {
        id: 1,
        title: 'New quote received',
        description: 'Carrier XYZ submitted a quote for shipment #12345',
        time: '5 min ago',
        read: false,
        link: '/quotes'
    },
    {
        id: 2,
        title: 'Shipment delivered',
        description: 'Shipment #12344 was successfully delivered',
        time: '1 hour ago',
        read: false,
        link: '/tracking'
    },
    {
        id: 3,
        title: 'Invoice variance detected',
        description: 'Invoice #INV-2024-001 has a $150 variance',
        time: '3 hours ago',
        read: true,
        link: '/reconcile'
    },
]

export function NotificationsPanel() {
    const [notifications, setNotifications] = useState(mockNotifications)
    const [open, setOpen] = useState(false)

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const removeNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div>
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        <p className="text-xs text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-8 text-xs"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                            <Bell className="mx-auto mb-2 text-muted-foreground" size={32} />
                            <p className="text-sm text-muted-foreground">No notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 hover:bg-muted/50 transition-all group relative",
                                        !notification.read && "bg-primary/5"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        {!notification.read && (
                                            <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-medium text-sm text-foreground">
                                                    {notification.title}
                                                </h4>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-1 hover:bg-muted rounded"
                                                            title="Mark as read"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeNotification(notification.id)}
                                                        className="p-1 hover:bg-muted rounded"
                                                        title="Dismiss"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {notification.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-muted-foreground">
                                                    {notification.time}
                                                </span>
                                                {notification.link && (
                                                    <a
                                                        href={notification.link}
                                                        onClick={() => setOpen(false)}
                                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        View
                                                        <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="border-t border-border p-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-center text-xs"
                            onClick={() => setOpen(false)}
                        >
                            View all notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
