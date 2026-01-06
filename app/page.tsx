"use client"
// Landing page for Divya Darshan 360
import { FeaturesGrid } from "@/components/features-grid"
import { Button } from "@/components/ui/button"
import { Mail, Instagram, Twitter, Facebook, ShieldCheck, Sparkles, Star, Focus as Lotus } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ExperienceCards } from "@/components/experience-cards"

import { SacredChakra } from "@/components/sacred-chakra"
import { AppShowcase } from "@/components/app-showcase"
import { FloatingDiya } from "@/components/floating-diya"
import { DivineParticles } from "@/components/divine-particles"
import { BackgroundLotus } from "@/components/background-lotus"
import { DemoVideo } from "@/components/demo-video"

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden selection:bg-primary/30">
      <DivineParticles />
      <SacredChakra />

      {/* Scattered Floating Diyas for atmosphere */}
      <FloatingDiya className="absolute top-[15%] left-[10%] scale-150 hidden md:block" />
      <FloatingDiya className="absolute top-[40%] right-[15%] scale-125 hidden md:block" />
      <FloatingDiya className="absolute bottom-[20%] left-[20%] scale-75 hidden md:block" />
      <FloatingDiya className="absolute bottom-[10%] right-[5%] scale-110 hidden md:block" />

      {/* Scattered Sacred Lotus Elements */}
      <BackgroundLotus className="top-[5%] right-[-10%]" size={600} opacity={0.15} duration={180} />
      <BackgroundLotus className="top-[35%] left-[-15%]" size={500} opacity={0.1} duration={220} delay={10} />
      <BackgroundLotus className="bottom-[15%] right-[-5%]" size={400} opacity={0.15} duration={200} delay={20} />
      <BackgroundLotus className="bottom-[-10%] left-[10%]" size={300} opacity={0.1} duration={250} delay={5} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary blur-[120px] animate-glow" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-secondary blur-[100px] animate-glow" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-12 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
            Experiential Spiritual Video Platform
          </motion.div>

          <h1 className="text-6xl md:text-[9rem] font-serif tracking-tighter mb-8 leading-[0.9] text-balance">
            Divya Darshan <span className="text-primary italic block md:inline">360</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed font-light">
            Transcend physical boundaries. Experience the divine essence through high-fidelity,{" "}
            <span className="text-primary font-medium">platform-exclusive</span> spiritual videos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
            <Link
              href="https://play.google.com/store/apps/details?id=com.tellme.tellme360&pcampaignid=web_share"
              target="_blank"
              className="group relative flex items-center gap-5 bg-white/80 backdrop-blur-md px-10 py-5 rounded-[1.5rem] border border-primary/20 hover:border-primary/50 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-primary/20"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer pointer-events-none" />

              <div className="relative z-10 p-2 bg-white/5 rounded-xl border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-500">
                <img
                  src="/google-play-icon.png"
                  alt="Play Store"
                  className="w-8 h-8 object-contain rounded-md group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col items-start leading-none relative z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-1">
                  Available on
                </span>
                <span className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors tracking-tight">
                  Google Play
                </span>
              </div>

              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/10 rounded-tr-lg group-hover:border-primary/40 transition-colors" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/10 rounded-bl-lg group-hover:border-primary/40 transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Demo Video */}
      <DemoVideo />

      {/* NEW: Exclusivity Banner - Softened borders and gradient */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-primary font-serif italic text-xl mb-4">
                <ShieldCheck className="w-6 h-6" />
                Only on Divya Darshan 360
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Authenticity Found Nowhere Else</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our content is captured using proprietary 360° technology during exclusive access periods granted by
                sacred institutions. These are not just videos; they are digital gateways available{" "}
                <span className="text-primary underline decoration-primary/30 underline-offset-4">uniquely</span> on
                this platform.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { label: "Original Content", icon: Sparkles },
                { label: "High Fidelity", icon: Star },
                { label: "Sacred Access", icon: Lotus },
                { label: "Pure Immersion", icon: ShieldCheck },
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass p-6 rounded-3xl flex flex-col items-center text-center gap-3 ornate-border shadow-lg shadow-primary/5"
                >
                  <item.icon className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium tracking-wide uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Experiential Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Softened skew background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -skew-y-3 translate-y-20 pointer-events-none blur-3xl opacity-50" />
        <BackgroundLotus className="bottom-[10%] left-[-5%]" size={350} opacity={0.08} duration={300} delay={15} />
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Sacred Journeys</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your path. Each video is captured in stunning detail to transport your soul directly to the divine
            presence.
          </p>
        </div>
        <ExperienceCards />
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        {/* Center ambient glow for features */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <BackgroundLotus className="top-[10%] right-[5%]" size={450} opacity={0.1} duration={240} delay={5} />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-primary tracking-[0.3em] uppercase text-sm mb-4 block">Core Offerings</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-6">Divine Features</h2>
          </div>
          <FeaturesGrid />
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden">
        {/* Softened background - removed strict block */}

        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6 backdrop-blur-md">
                <Lotus className="w-4 h-4" />
                Spiritual Connection
              </div>
              <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Deity Wisdom & Blessings</h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                Receive the grace of your favorite deities through experiential wisdom sessions. It's more than
                information—it's a spiritual connection that transcends the digital realm.
              </p>
              <ul className="space-y-6">
                {[
                  "Personalized Divine Blessings",
                  "Vedic Wisdom for Modern Living",
                  "Direct Connection through Virtual Presence",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/5] glass rounded-[3rem] p-4 ornate-border overflow-hidden group border-0 ring-0">
                <img
                  src="/vr-divine-experience.png"
                  alt="Immersive Spiritual VR Experience"
                  className="w-full h-full object-cover rounded-[2.5rem] group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />



                {/* Decorative corner accents - softened */}
                <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl opacity-60" />
                <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-3xl opacity-60" />
              </div>

              {/* Additional floating decoration */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
              <div
                className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-float"
                style={{ animationDelay: "2s" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <span className="text-primary tracking-[0.3em] uppercase text-sm mb-4 block">Experience the App</span>
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Immersive Interface</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A beautifully crafted mobile experience designed for spiritual seekers
          </p>
        </div>

        <BackgroundLotus className="top-[20%] left-[10%]" size={500} opacity={0.05} duration={350} />
        <AppShowcase />
      </section>

      {/* Privacy & Terms */}
      <section className="py-24 px-6 relative">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-[3rem] p-8 md:p-12 border-white/5">
            <h3 className="text-2xl font-serif mb-8">Privacy & Safety Overview</h3>
            <div className="prose prose-invert max-w-none h-64 overflow-y-auto pr-6 custom-scrollbar text-muted-foreground text-sm">
              <h4 className="text-foreground">VR Health Advisory</h4>
              <p>
                Please use caution when experiencing VR. Take regular breaks and ensure you are in a safe, static
                environment. Use while seated is recommended for temple darshans.
              </p>

              <h4 className="text-foreground mt-6">Privacy Policy</h4>
              <p>
                We respect your spiritual journey and personal data. Divya Darshan 360 does not sell your personal
                information. We collect minimal data required to provide the immersive service and app performance
                analytics.
              </p>

              <h4 className="text-foreground mt-6">Terms of Service</h4>
              <p>
                By using Divya Darshan 360, you agree to use the content for personal, non-commercial spiritual purposes
                only. Recording or redistribution of the 360° content is strictly prohibited.
              </p>
            </div>
            <div className="mt-8 flex justify-end">
              <Link href="/privacy">
                <Button variant="link" className="text-primary hover:text-primary/80">
                  Read Full Policy & Safety Guidelines →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 bg-gradient-to-t from-black/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-serif mb-2">Divya Darshan 360</h4>
              <p className="text-muted-foreground text-sm">Developed by TellMe Digi Infotech Pvt Ltd</p>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="p-3 glass rounded-full hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 glass rounded-full hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 glass rounded-full hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 glass rounded-full hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2025 Divya Darshan 360. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy#privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/privacy#terms" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/privacy#cookies" className="hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main >
  )
}
