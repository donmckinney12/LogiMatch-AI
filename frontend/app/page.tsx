"use client"

import { useState, useCallback, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  TrendingUp,
  Activity,
  Globe,
  Zap,
  CreditCard,
  LayoutGrid
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComparisonTable } from '@/components/comparison-table'
import { AppLayout } from '@/components/app-layout'
import { UsageWidget } from '@/components/usage-widget'
import { useOrg } from "@/context/org-context"
import { apiRequest } from "@/lib/api-client"
// Recharts
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Mock Data for Hero Chart
const activityData = [
  { time: '08:00', quotes: 12, volume: 4500 },
  { time: '10:00', quotes: 18, volume: 6200 },
  { time: '12:00', quotes: 15, volume: 5100 },
  { time: '14:00', quotes: 25, volume: 8900 },
  { time: '16:00', quotes: 30, volume: 9200 },
  { time: '18:00', quotes: 22, volume: 7400 },
];

export default function Home() {
  const { user } = useUser()
  const { orgId } = useOrg()
  const [loading, setLoading] = useState(false)
  const [quotes, setQuotes] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [normalizationEnabled, setNormalizationEnabled] = useState(false)

  // Fetch initial quotes from DB
  useEffect(() => {
    fetchQuotes()
  }, [orgId])

  const fetchQuotes = async () => {
    try {
      const data = await apiRequest('/api/quotes', {}, orgId)
      setQuotes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch history", err)
      setQuotes([])
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true)
    setError(null)

    // Process files sequentially
    for (const file of acceptedFiles) {
      if (file.type !== 'application/pdf') continue;

      const formData = new FormData()
      formData.append('file', file)
      if (user?.id) {
        formData.append('user_id', user.id)
      }

      try {
        const data = await apiRequest('/api/extract', {
          method: 'POST',
          body: formData,
        }, orgId)

        // Backend now returns the saved quote object directly
        await fetchQuotes() // Re-fetch to ensure sync with DB ID
      } catch (err: any) {
        setError(`Failed to process ${file.name}: ${err.message} `)
      }
    }
    setLoading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  })

  return (
    <AppLayout>
      <div className="max-w-[1800px] mx-auto space-y-4 lg:space-y-8 animate-in fade-in duration-700">

        {/* 1. Header Section with Spotlight Feel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border/40">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
              Mission Control
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl">
              Welcome back. Global freight activity is <span className="text-emerald-500 font-bold italic underline decoration-emerald-500/30">trending up</span> today.
            </p>
          </div>

          {/* Normalization Toggle - Enterprise Pill Style */}
          <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full shadow-sm glass-card w-full md:w-auto">
            <button
              onClick={() => setNormalizationEnabled(false)}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all",
                !normalizationEnabled ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"
              )}
            >
              Original
            </button>
            <button
              onClick={() => setNormalizationEnabled(true)}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all",
                normalizationEnabled ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"
              )}
            >
              Normalized USD
            </button>
          </div>
        </div>

        {/* 2. Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* Start Column: Global Activity Hero (Spans 8) */}
          <div className="lg:col-span-8 p-6 md:p-8 bg-card rounded-[32px] md:rounded-[40px] border border-border shadow-2xl glass-card relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between min-h-[250px] md:min-h-[300px]">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 bg-primary/10 rounded-2xl text-primary">
                    <Globe size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-foreground uppercase tracking-wide">Global Trade Velocity</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Real-time Quote Ingestion</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-emerald-500/20">
                  <Activity size={14} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
                </div>
              </div>

              {/* Hero Chart */}
              <div className="flex-1 w-full h-[180px] md:h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <Tooltip
                      cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                      itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      className="neon-glow"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorActivity)"
                      strokeLinecap="round"
                      filter="url(#glow)"
                      animationDuration={2500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Stats Tiles (Spans 4) */}
          <div className="lg:col-span-4 grid grid-cols-1 gap-4 lg:gap-6">
            {/* Usage Widget Card */}
            <div className="bg-card rounded-[32px] border border-border shadow-lg glass-card overflow-hidden relative">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
              <div className="p-2">
                <UsageWidget />
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 md:p-6 bg-card rounded-[24px] md:rounded-[32px] border border-border glass-card flex flex-col justify-center items-center text-center hover:border-primary/50 transition-colors">
                <span className="text-3xl md:text-4xl font-black text-foreground mb-1">{quotes.length}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Quotes</span>
              </div>
              <div className="p-4 md:p-6 bg-card rounded-[24px] md:rounded-[32px] border border-border glass-card flex flex-col justify-center items-center text-center hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-1 text-emerald-500 mb-1">
                  <TrendingUp size={16} className="md:w-5 md:h-5" />
                  <span className="text-xl md:text-2xl font-black">12%</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">MoM Growth</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Upload & Table (Spans 12 each) */}

          {/* Upload Area - The "Drop Zone" */}
          <div className="lg:col-span-12">
            <div
              {...getRootProps()}
              className={cn(
                "relative border-2 border-dashed rounded-[32px] md:rounded-[40px] p-8 md:p-12 text-center cursor-pointer transition-all duration-300 group overflow-hidden",
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.01] shadow-2xl shadow-primary/20"
                  : "border-border hover:border-primary/50 hover:bg-muted/10"
              )}
            >
              <input {...getInputProps()} />
              <div className="absolute inset-0 bg-mesh opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

              <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6">
                <div className={cn(
                  "p-4 md:p-6 rounded-full bg-card border border-border shadow-xl transform transition-transform duration-500",
                  isDragActive ? "scale-125 rotate-12" : "group-hover:scale-110"
                )}>
                  {loading ? <Loader2 size={24} className="md:w-8 md:h-8 animate-spin text-primary" /> : <Upload size={24} className="md:w-8 md:h-8 text-primary" />}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-foreground">
                    {isDragActive ? "Drop Manifest Here" : "Upload Freight Quote"}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-medium max-w-sm md:max-w-md mx-auto">
                    Drag & drop PDF files to instantly extract, normalize, and analyze freight rates using our enterprise OCR engine.
                  </p>
                </div>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2 font-bold animate-in slide-in-from-top-2 text-sm">
                <AlertCircle size={18} /> {error}
              </div>
            )}
          </div>

          {/* Comparison Table */}
          <div className="lg:col-span-12">
            <div className="bg-card rounded-[40px] border border-border shadow-xl glass-card overflow-hidden">
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <LayoutGrid size={20} />
                  </div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-wide">Quote Matrix</h3>
                </div>
                <button className="px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors">
                  Export CSV
                </button>
              </div>
              <ComparisonTable data={quotes} normalizationEnabled={normalizationEnabled} />
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}
