"use client"

import { Ship, Truck, Box, Globe, Zap, Anchor } from "lucide-react"

const partners = [
    { name: "Atlas Logistics", icon: Ship },
    { name: "Global Freight", icon: Globe },
    { name: "Prime Cargo", icon: Truck },
    { name: "Neural Chain", icon: Zap },
    { name: "Oceanic Ltd", icon: Anchor },
    { name: "📦 SwiftPack", icon: Box },
]

export function LogoStrip() {
    return (
        <div className="py-12 border-y border-border/40 bg-muted/5">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-8">
                    Orchestrating Shipments for the World's Leading Networks
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                    {partners.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-110">
                            <p.icon size={24} className="text-foreground group-hover:text-primary transition-colors" />
                            <span className="font-heading text-lg font-black tracking-tighter text-foreground italic uppercase leading-none truncate">
                                {p.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
