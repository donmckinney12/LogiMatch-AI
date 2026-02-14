"use client"

import { useEffect, useState } from "react"
import { Truck, Ship, Plane, MapPin, Navigation, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface Telemetry {
    shipment_id: number
    latitude: number
    longitude: number
    destination: string
    speed_knots: number
    heading: number
    distance_remaining_km: number
    eta_drift_hours: number
    status: string
}

interface TrackingMapProps {
    shipments: Telemetry[]
}

export function TrackingMap({ shipments }: TrackingMapProps) {
    // Map bounds for projection
    const mapWidth = 800
    const mapHeight = 450

    const project = (lat: number, lon: number) => {
        // Simple linear projection for a stylized map
        const x = (lon + 180) * (mapWidth / 360)
        const y = (90 - lat) * (mapHeight / 180)
        return { x, y }
    }

    // Major ports to visualize
    const ports = [
        { name: "Port of Los Angeles", lat: 33.94, lon: -118.4 },
        { name: "Port of Rotterdam", lat: 51.92, lon: 4.47 },
        { name: "Singapore", lat: 1.35, lon: 103.8 },
        { name: "Shanghai", lat: 31.23, lon: 121.47 }
    ]

    return (
        <div className="relative bg-white dark:bg-neutral-900 rounded-[48px] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-2xl h-[500px]">
            {/* Map Background (Stylized SVG) */}
            <svg
                viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                className="w-full h-full opacity-100 dark:opacity-50 fill-neutral-50 dark:fill-neutral-800/50 stroke-neutral-200 dark:stroke-neutral-700 stroke-[1]"
            >
                {/* Simplified World Outlines - Just a few stylized rectangles/paths for continents */}
                <path d="M150,100 L250,100 L250,250 L100,250 Z" /> {/* North America approx */}
                <path d="M180,260 L240,260 L220,400 L160,350 Z" /> {/* South America approx */}
                <path d="M400,80 L500,80 L520,200 L380,200 Z" /> {/* Eurasia approx */}
                <path d="M420,210 L480,210 L490,320 L400,320 Z" /> {/* Africa approx */}
                <path d="M600,280 L680,280 L670,360 L620,360 Z" /> {/* Australia approx */}

                {/* Grid Lines */}
                {[...Array(10)].map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * (mapHeight / 10)} x2={mapWidth} y2={i * (mapHeight / 10)} className="stroke-neutral-100 dark:stroke-neutral-800" />
                ))}
                {[...Array(20)].map((_, i) => (
                    <line key={`v-${i}`} x1={i * (mapWidth / 20)} y1="0" x2={i * (mapWidth / 20)} y2={mapHeight} className="stroke-neutral-100 dark:stroke-neutral-800" />
                ))}
            </svg>

            {/* Port Geofences */}
            {ports.map((port, idx) => {
                const { x, y } = project(port.lat, port.lon)
                return (
                    <div
                        key={`port-${idx}`}
                        className="absolute group"
                        style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="w-12 h-12 border border-blue-500/30 rounded-full animate-pulse-slow bg-blue-500/5" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-neutral-800/90 px-2 py-1 rounded shadow-lg border border-neutral-100 dark:border-neutral-700">
                            {port.name}
                        </span>
                    </div>
                )
            })}

            {/* Shipment Markers */}
            {shipments.map((shipment) => {
                const { x, y } = project(shipment.latitude, shipment.longitude)
                return (
                    <div
                        key={shipment.shipment_id}
                        className="absolute transition-all duration-[3000ms] ease-linear group"
                        style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="relative cursor-pointer">
                            {/* Marker Icon */}
                            <div className={cn(
                                "p-2 rounded-xl border border-border/50 dark:border-white/10 shadow-lg backdrop-blur-sm transition-transform group-hover:scale-125",
                                shipment.status === 'ARRIVED' ? "bg-green-500 text-white" : "bg-white dark:bg-neutral-800 text-primary dark:text-blue-400"
                            )}>
                                <Navigation
                                    size={16}
                                    style={{ transform: `rotate(${shipment.heading}deg)` }}
                                    className="transition-transform duration-1000"
                                />
                            </div>

                            {/* Info Tooltip (Always Visible or On Hover) */}
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl p-3 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Shipment #{shipment.shipment_id}</span>
                                    {shipment.eta_drift_hours > 0 && (
                                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                            +{shipment.eta_drift_hours}h Delay
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs font-black text-neutral-900 mb-1">{shipment.destination}</p>
                                <div className="flex justify-between text-[10px] font-bold text-neutral-500">
                                    <span>{shipment.speed_knots} Knots</span>
                                    <span>{shipment.distance_remaining_km}km Left</span>
                                </div>
                            </div>

                            {/* Trail Animation (Simulation) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500/10 rounded-full animate-ping pointer-events-none" />
                        </div>
                    </div>
                )
            })}

            {/* Legend */}
            <div className="absolute bottom-8 left-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex gap-6 z-20 shadow-xl">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                    <span className="text-[10px] font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">In Transit</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">At Destination</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-primary/50 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">Geofence</span>
                </div>
            </div>

            {/* Overlay Info */}
            <div className="absolute top-8 right-8 text-right bg-white/40 dark:bg-black/20 p-2 rounded-xl backdrop-blur-[2px]">
                <p className="text-neutral-900 dark:text-white font-black text-xl italic tracking-tighter">SITUATIONAL <span className="text-blue-600 dark:text-blue-400">AWARENESS</span></p>
                <p className="text-neutral-500 dark:text-neutral-400 text-[10px] font-black uppercase tracking-widest">Live Telemetry Feed: AIS/ADS-B Integration</p>
            </div>
        </div>
    )
}
