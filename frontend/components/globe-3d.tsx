"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface Globe3DProps {
    className?: string
}

export function Globe3D({ className }: Globe3DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let width = canvas.offsetWidth
        let height = canvas.offsetHeight
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

        const points: { x: number; y: number; z: number }[] = []
        const count = 800
        const radius = Math.min(width, height) * 0.4

        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count)
            const theta = Math.sqrt(count * Math.PI) * phi
            points.push({
                x: radius * Math.cos(theta) * Math.sin(phi),
                y: radius * Math.sin(theta) * Math.sin(phi),
                z: radius * Math.cos(phi),
            })
        }

        let rotationX = 0
        let rotationY = 0
        let targetRotationX = 0
        let targetRotationY = 0
        let mouseX = 0
        let mouseY = 0
        let dragging = false

        const onMouseDown = (e: MouseEvent) => {
            dragging = true
            mouseX = e.clientX
            mouseY = e.clientY
        }

        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return
            const dx = e.clientX - mouseX
            const dy = e.clientY - mouseY
            targetRotationY += dx * 0.01
            targetRotationX += dy * 0.01
            mouseX = e.clientX
            mouseY = e.clientY
        }

        const onMouseUp = () => (dragging = false)

        window.addEventListener("mousedown", onMouseDown)
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)

        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            rotationX += (targetRotationX - rotationX) * 0.1
            rotationY += (targetRotationY - rotationY) * 0.1

            // Natural slow rotation if not dragging
            if (!dragging) {
                targetRotationY += 0.002
            }

            const sortedPoints = points.map(p => {
                // Rotate X
                let y1 = p.y * Math.cos(rotationX) - p.z * Math.sin(rotationX)
                let z1 = p.y * Math.sin(rotationX) + p.z * Math.cos(rotationX)
                // Rotate Y
                let x2 = p.x * Math.cos(rotationY) + z1 * Math.sin(rotationY)
                let z2 = -p.x * Math.sin(rotationY) + z1 * Math.cos(rotationY)

                return { x: x2, y: y1, z: z2 }
            }).sort((a, b) => a.z - b.z)

            ctx.translate(width / 2, height / 2)

            sortedPoints.forEach(p => {
                const scale = (radius + p.z) / (radius * 2)
                const alpha = Math.max(0.1, scale)
                const size = Math.max(1, 2 * scale)

                ctx.beginPath()
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2)

                // Color based on Z depth for "Elite" neon feel
                if (p.z > radius * 0.8) {
                    ctx.fillStyle = `rgba(59, 130, 246, ${alpha})` // Front pulses
                    ctx.shadowBlur = 10
                    ctx.shadowColor = "rgba(59, 130, 246, 0.5)"
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`
                    ctx.shadowBlur = 0
                }

                ctx.fill()
            })

            // Draw some "Risk Nodes" (Red pulses)
            const riskNodes = [
                { phi: 0.5, theta: 0.8 }, // Suez
                { phi: 1.2, theta: 2.1 }, // Panama
                { phi: 2.1, theta: 0.4 }, // South China Sea
            ]

            riskNodes.forEach(rn => {
                const x = radius * Math.cos(rn.theta + rotationY) * Math.sin(rn.phi + rotationX)
                const y = radius * Math.sin(rn.theta + rotationY) * Math.sin(rn.phi + rotationX)
                const z = radius * Math.cos(rn.phi + rotationX)

                if (z > 0) {
                    const pulse = Math.sin(Date.now() * 0.005) * 5 + 10
                    ctx.beginPath()
                    ctx.arc(x, y, 4, 0, Math.PI * 2)
                    ctx.fillStyle = "rgba(239, 68, 68, 0.8)"
                    ctx.fill()

                    ctx.beginPath()
                    ctx.arc(x, y, pulse, 0, Math.PI * 2)
                    ctx.strokeStyle = "rgba(239, 68, 68, 0.3)"
                    ctx.stroke()
                }
            })

            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
            requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("mousedown", onMouseDown)
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className={cn("w-full h-full cursor-grab active:cursor-grabbing", className)}
            style={{ width: '100%', height: '100%' }}
        />
    )
}
