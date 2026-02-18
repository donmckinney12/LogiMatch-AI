import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { SiteFooter } from "@/components/site-footer"
import { TestimonialsSection } from "@/components/testimonials-section"
import { BlogPreview } from "@/components/blog-preview"
import { LogoStrip } from "@/components/logo-strip"
import { ArrowRight, Zap, ShieldCheck, BarChart3, Globe, ChevronRight, Calendar } from "lucide-react"

export default function LandingPage() {
  return (
    <AppLayout>
      <main className="relative">
        <div className="bg-mesh opacity-70" aria-hidden="true" />

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-32 overflow-hidden">
          <div className="bg-grid opacity-30" aria-hidden="true" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-full pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] opacity-40 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[160px] opacity-40 animate-bounce-slow" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-in slide-in-from-top-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">System Online: Enterprise v5.0 Beta</span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-foreground italic uppercase leading-[0.8] mb-8 drop-shadow-2xl">
                Normalize <span className="text-primary-foreground drop-shadow-[0_2px_10px_rgba(59,130,246,0.5)]">Data</span> <br />
                <span className="text-primary italic animate-glow">& Predict Spikes.</span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-xl md:text-3xl font-medium text-muted-foreground leading-relaxed balance opacity-90">
                The neural core for global procurement. <span className="text-foreground font-bold border-b-2 border-primary/40">Consolidate manifests</span>, automate spend audits, and predict market shifts in milliseconds.
              </p>

              <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/contact" className="w-full sm:w-auto px-12 py-7 bg-primary text-primary-foreground font-black uppercase text-xs tracking-[0.3em] rounded-[24px] hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-primary/50 flex items-center justify-center gap-3 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Calendar size={20} /> Book a Demo
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto px-12 py-7 bg-white/5 border border-white/20 text-foreground font-black uppercase text-xs tracking-[0.3em] rounded-[24px] hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-3 group shadow-xl">
                  Start Free Audit <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>

              {/* Trust Bar */}
              <div className="mt-24 opacity-60 hover:opacity-100 transition-opacity duration-700">
                <LogoStrip />
              </div>

              {/* Sub-Hero Terminal Preview */}
              <div className="mt-24 lg:mt-40 max-w-6xl mx-auto rounded-[64px] border border-white/10 bg-[#0A0C10]/80 p-6 shadow-[0_64px_128px_-20px_rgba(0,0,0,0.8)] glass-card transition-all duration-1000 overflow-hidden relative group hover:scale-[1.02] hover:border-primary/40">
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                <div className="aspect-[21/9] w-full bg-[#050608] rounded-[48px] flex items-center justify-center relative overflow-hidden ring-1 ring-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000"
                    alt="LogiMatch AI Analytics Core"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent" />
                  <div className="relative z-10 text-center space-y-6">
                    <div className="p-8 bg-primary/20 backdrop-blur-3xl rounded-[32px] inline-block shadow-2xl border border-primary/30 neon-glow">
                      <Zap className="text-primary" size={64} fill="currentColor" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black uppercase tracking-[0.8em] text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">Mission Control v5.0</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Neural Logistics Core Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-muted/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: "Auto-Auditor", desc: "Instantly find overcharges in messy PDF manifests and convert them to clean USD landed costs." },
                { icon: BarChart3, title: "Savings Tracker", desc: "Watch your actual savings grow in real-time versus carrier benchmarks." },
                { icon: ShieldCheck, title: "Disruption Shield", desc: "Get alerted to lane vulnerabilities before they cost you thousands in delays." },
                { icon: Globe, title: "Rate Benchmarking", desc: "Direct access to real-time market rates so you know if your carrier is overcharging." },
              ].map((f, i) => (
                <div key={i} className="p-8 bg-card rounded-[32px] border border-border/40 hover:border-primary/50 transition-all group shadow-sm">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary w-fit mb-6 group-hover:scale-110 transition-transform">
                    <f.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">{f.title}</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <TestimonialsSection />

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="bg-primary rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/40 group">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white italic uppercase mb-8">
                  Ready to Optimize your <br />
                  Global Procurement?
                </h2>
                <p className="mt-6 text-lg text-primary-foreground/80 font-medium max-w-2xl mx-auto mb-10">
                  Join the world's leading brands using LogiMatch AI to gain strategic advantage in global logistics.
                </p>
                <Link href="/dashboard" className="inline-flex px-10 py-6 bg-white text-primary font-black uppercase tracking-widest rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Articles/Blog */}
        <BlogPreview />

      </main>

      <SiteFooter />
    </AppLayout>
  )
}
