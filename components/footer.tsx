import Link from "next/link"
import { Mail, Instagram, Twitter, Facebook, Phone, Wallet } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/5 bg-linear-to-t from-black/50 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-serif mb-2">Divya Darshan 360</h4>
            <p className="text-muted-foreground text-sm">Developed by TellMe Digi Infotech Pvt Ltd</p>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href="tel:9049921850"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors justify-center md:justify-start"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>9049921850</span>
              </a>
              <a
                href="mailto:connect@youtellme.ai?cc=sairaj@tellmedigi.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors justify-center md:justify-start"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>connect@youtellme.ai </span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="tel:9049921850" className="p-3 glass rounded-full hover:text-primary transition-colors" title="Call us">
              <Phone className="w-5 h-5" />
            </a>
            <a href="mailto:connect@youtellme.ai?cc=sairaj@tellmedigi.com" className="p-3 glass rounded-full hover:text-primary transition-colors" title="Email us">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/divya_darshan360/" className="p-3 glass rounded-full hover:text-primary transition-colors" title="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            {/* <a href="#" className="p-3 glass rounded-full hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a> */}
            <a href="https://www.facebook.com/profile.php?id=61585988071604" className="p-3 glass rounded-full hover:text-primary transition-colors" title="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 justify-center md:justify-start">
            <Wallet className="w-3.5 h-3.5" />
            Payment information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 text-sm text-muted-foreground max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-baseline">
              <span className="text-xs uppercase tracking-wider text-muted-foreground/70 shrink-0 sm:w-28">Beneficiary</span>
              <span className="text-foreground/90">TELLME DIGIINFOTECH PRIVATE LIMITED</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-baseline">
              <span className="text-xs uppercase tracking-wider text-muted-foreground/70 shrink-0 sm:w-28">Account No.</span>
              <span className="font-mono text-foreground/90">2223006306876848</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-baseline">
              <span className="text-xs uppercase tracking-wider text-muted-foreground/70 shrink-0 sm:w-28">IFSC</span>
              <span className="font-mono text-foreground/90">UTIB000RAZP</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-baseline">
              <span className="text-xs uppercase tracking-wider text-muted-foreground/70 shrink-0 sm:w-28">UPI</span>
              <span className="font-mono text-foreground/90 break-all">rpy.payto000009179099666@icici</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/60 mt-3 max-w-3xl">
            Payments processed securely by Razorpay. Use the account or UPI handle above for direct bank/UPI transfers.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">
          <p>© 2025 Divya Darshan 360. All rights reserved.</p>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/blogs" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/vr-headset" className="hover:text-primary transition-colors">
              Buy VR Headset
            </Link>
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
  )
}
