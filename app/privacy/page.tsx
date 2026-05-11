import Link from "next/link"
import {
  Shield,
  ArrowLeft,
  Lock,
  FileText,
  Users,
  Globe,
  Mail,
  Database,
  Eye,
  Trash,
  Bell,
  CreditCard,
  Truck,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  Scale,
  ShieldCheck,
  Cookie,
  Gavel,
  UserCheck,
  Ban,
} from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-96 bg-primary blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <header className="mb-16">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Privacy Policy &amp; Terms</h1>
          <p className="text-lg text-foreground font-medium">Divya Darshan 360</p>
          <p className="text-muted-foreground">TellMe Digi Infotech Pvt Ltd</p>
          <p className="text-muted-foreground">Effective Date: December 26, 2025</p>
          <p className="text-muted-foreground">Last Updated: May 09, 2026</p>
        </header>

        <div className="space-y-12">
          {/* ============== PRIVACY POLICY ============== */}
          <section id="privacy" className="scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-serif mb-2">Privacy Policy</h2>
            <p className="text-sm text-muted-foreground mb-8">
              How we collect, use, and safeguard your information across our App, Website, and Services.
            </p>
          </section>

          {/* 1. Introduction */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">1. Introduction</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Welcome to Divya Darshan 360 (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how TellMe Digi Infotech Pvt Ltd collects, uses, discloses, and safeguards your information when you use our Divya Darshan 360 mobile application (the &quot;App&quot;), our website (the &quot;Website&quot;), and when you purchase products such as VR Boxes and related accessories through our platforms (collectively, the &quot;Services&quot;).
              </p>
              <p>
                Please read this Privacy Policy carefully. By downloading, accessing, browsing, or making a purchase through our Services, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this Privacy Policy, please do not use our Services.
              </p>
              <p>
                This Privacy Policy is published in compliance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, the Digital Personal Data Protection Act, 2023, and other applicable Indian laws.
              </p>
            </div>
          </section>

          {/* 2. Information We Collect */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">2. Information We Collect</h2>
            </div>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  2.1 Information You Provide to Us
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, mobile number, and profile preferences.</li>
                  <li><strong>Purchase &amp; Shipping Information:</strong> When you place an order for a VR Box or any other product, we collect your full name, billing address, shipping address, contact number, email address, and order details (including products purchased, quantity, and delivery preferences).</li>
                  <li><strong>Payment Information:</strong> All payments are processed through Razorpay, our PCI-DSS compliant third-party payment gateway. We do <strong>NOT</strong> store your credit card numbers, debit card details, UPI PIN, net-banking passwords, or CVV. Razorpay collects and processes this information directly under its own privacy policy. We only receive a transaction ID, payment status, payment method type, and last four digits of the instrument used (for reconciliation and customer support).</li>
                  <li><strong>GST / Tax Information:</strong> If you request a GST invoice for a business purchase, we collect your GSTIN and registered business name/address.</li>
                  <li><strong>User Preferences:</strong> Your favorite temples, deities, aartis, and viewing preferences within the App.</li>
                  <li><strong>Feedback and Communications:</strong> Feedback, reviews, comments, customer support tickets, or inquiries you send to us.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  2.2 Information Automatically Collected
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Device Information:</strong> Device type, model, operating system, unique device identifiers, browser type, and mobile network information.</li>
                  <li><strong>Usage Data:</strong> Features you use, content you view, products viewed/added to cart, time spent on the App or Website, and interaction patterns.</li>
                  <li><strong>Log Data:</strong> IP address, access times, app crashes, error logs, and system activity.</li>
                  <li><strong>Location Information:</strong> With your consent, we may collect approximate location data to provide location-based content recommendations and accurate shipping estimates.</li>
                  <li><strong>Cookies &amp; Similar Technologies:</strong> We use cookies, web beacons, and similar tracking technologies as described in our Cookie Policy.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  2.3 Information from Third-Party Services
                </h3>
                <p className="text-sm">
                  If you connect our Services to third-party services (such as Google for authentication or Razorpay for payments), we may receive information from those services based on your privacy settings with them. We may also receive shipment status updates from logistics partners (such as Delhivery, Bluedart, India Post, Shiprocket, or DTDC) used to deliver your VR Box order.
                </p>
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Information */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">3. How We Use Your Information</h2>
            </div>
            <ul className="list-disc pl-5 space-y-3 text-muted-foreground leading-relaxed">
              <li><strong>Provide and Maintain the Services:</strong> Deliver VR video content, temple darshan experiences, aarti services, and operate our online store.</li>
              <li><strong>Process Orders and Payments:</strong> Process your VR Box orders, verify payments through Razorpay, generate invoices, arrange shipping, and provide order tracking.</li>
              <li><strong>Customer Support:</strong> Respond to your queries, process returns, refunds, replacements, and warranty claims.</li>
              <li><strong>Personalization:</strong> Customize your experience based on your preferences, recommend relevant temples, deities, content, and products.</li>
              <li><strong>Improvements:</strong> Analyze usage patterns to improve the Services&rsquo; features, design, and performance.</li>
              <li><strong>Communications:</strong> Send transactional messages (order confirmations, shipping updates, payment receipts), service notifications, and (with your consent) marketing communications about new content or products.</li>
              <li><strong>Fraud Prevention &amp; Security:</strong> Detect, prevent, and address fraud, chargebacks, unauthorized transactions, technical issues, or security concerns.</li>
              <li><strong>Legal Compliance:</strong> Comply with applicable laws, regulations, tax requirements, and respond to legal processes.</li>
            </ul>
            <div className="mt-6 bg-white/5 rounded-xl p-5 border border-white/5">
              <h3 className="text-foreground font-medium mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                Refunds and Cancellations
              </h3>
              <p className="text-sm text-muted-foreground">
                We use your personal information to process order cancellations, returns, replacements, and refunds in accordance with our Cancellation &amp; Refund Policy. This includes verifying your identity, validating order details, assessing eligibility for refunds or replacements, arranging reverse pickups (where applicable), and issuing refunds through Razorpay to your original payment method. As stated in our Terms &amp; Conditions, refunds are initiated only after inspection and approval of returned Products, and Razorpay or your bank may require additional time to credit the amount. We retain cancellation and refund records as required under applicable Indian laws, including GST, accounting, and dispute-resolution requirements.
              </p>
            </div>
          </section>

          {/* 4. Payment Information & Razorpay */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">4. Payment Information &amp; Razorpay</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                All online payments on our Website and App are processed through Razorpay (Razorpay Software Private Limited), a payment gateway certified to PCI-DSS Level 1, the highest level of compliance for handling card data.
              </p>
              <p className="font-medium text-foreground">When you make a payment:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>You are securely redirected to Razorpay&rsquo;s payment interface or its hosted checkout, where you enter your payment details directly.</li>
                <li>We never see, collect, or store your full card number, CVV, UPI PIN, OTP, or net-banking credentials.</li>
                <li>Razorpay shares with us only the transaction reference ID, payment status (success/failure/pending), payment method (e.g., UPI, Card, Net Banking, Wallet), and the last four digits of the instrument, so we can fulfill your order and assist you with support.</li>
                <li>
                  Razorpay&rsquo;s use of your information is governed by its own privacy policy, available at{" "}
                  <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://razorpay.com/privacy/</a>.
                </li>
              </ul>
              <p className="text-sm italic">
                We strongly encourage you to review Razorpay&rsquo;s privacy policy before making a payment.
              </p>
            </div>
          </section>

          {/* 5. Data Sharing and Disclosure */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">5. Data Sharing and Disclosure</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">We do not sell your personal information.</p>
              <p>We may share your information only in the following circumstances:</p>
              <div className="space-y-4 mt-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-foreground font-medium mb-2">5.1 Service Providers</h3>
                  <p className="text-sm mb-2">We share information with trusted third-party vendors who assist us in operating our Services, including:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>Payment Processing:</strong> Razorpay (for payment collection, refunds, and reconciliation).</li>
                    <li><strong>Logistics &amp; Shipping:</strong> Courier partners such as Delhivery, Bluedart, Shiprocket, DTDC, and India Post for order delivery.</li>
                    <li><strong>Cloud Hosting &amp; Storage:</strong> Firebase, Google Cloud Platform, Amazon Web Services, or similar providers.</li>
                    <li><strong>Analytics &amp; Crash Reporting:</strong> Google Analytics, Firebase Analytics, Crashlytics.</li>
                    <li><strong>Communications:</strong> Email, SMS, and WhatsApp service providers for transactional and marketing messages.</li>
                    <li><strong>Customer Support Tools:</strong> Helpdesk and ticketing platforms.</li>
                  </ul>
                  <p className="text-sm mt-2">These service providers are contractually bound to use your information only for the purposes for which we disclose it.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-foreground font-medium mb-2">5.2 Legal Requirements</h3>
                  <p className="text-sm">We may disclose information if required by law, court order, or in response to valid legal requests by public authorities (such as tax authorities, GST authorities, law enforcement, or in response to a subpoena).</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-foreground font-medium mb-2">5.3 Business Transfers</h3>
                  <p className="text-sm">In the event of a merger, acquisition, restructuring, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such transfer.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-foreground font-medium mb-2">5.4 With Your Consent</h3>
                  <p className="text-sm">We may share information with third parties when you have given us explicit consent to do so.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Data Security */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">6. Data Security</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Encryption of data in transit (HTTPS/TLS) and at rest where applicable.</li>
                <li>PCI-DSS compliant payment processing through Razorpay (we do not store card data on our servers).</li>
                <li>Secure authentication mechanisms and password hashing.</li>
                <li>Role-based access controls and audit logging.</li>
                <li>Regular security assessments and patch management.</li>
              </ul>
              <p className="text-sm italic">However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
            </div>
          </section>

          {/* 7. Data Retention */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Trash className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">7. Data Retention</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Specifically:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Order, invoice, and tax records are retained for at least 8 years as required under the Income Tax Act, GST law, and the Companies Act.</li>
                <li>Account information is retained for as long as your account remains active and for a reasonable period thereafter.</li>
                <li>Transactional payment metadata is retained as required by Razorpay and applicable financial regulations.</li>
                <li>Customer support records are retained for up to 3 years from the last interaction.</li>
              </ul>
              <p>When information is no longer required, we will securely delete or anonymize it.</p>
            </div>
          </section>

          {/* 8. Your Rights and Choices */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                <Bell className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">8. Your Rights and Choices</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Depending on your location, you may have the following rights regarding your personal information under the Digital Personal Data Protection Act, 2023 and other applicable laws:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal information (subject to legal retention requirements).</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent for processing at any time, where processing is based on consent.</li>
                <li><strong>Right to Grievance Redressal:</strong> Lodge a complaint with our Grievance Officer.</li>
                <li><strong>Right to Nominate:</strong> Nominate another individual to exercise your rights in case of death or incapacity.</li>
                <li><strong>Right to Opt-Out:</strong> Opt out of marketing communications at any time by clicking &quot;unsubscribe&quot; in our emails or contacting us.</li>
              </ul>
              <p>
                To exercise any of these rights, you may use the in-app settings (where available) or write to us at{" "}
                <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a>{" "}
                or contact our Grievance Officer.
              </p>
              <p>We may request additional information to verify your identity. We may retain certain data where required under Indian law (for example, for accounting, tax, or dispute-resolution purposes).</p>
            </div>
          </section>

          {/* 9. Children's Privacy */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">9. Children&rsquo;s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Services are intended for general audiences and not directed at children under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without verifiable parental consent, we will take steps to delete such information promptly.
            </p>
          </section>

          {/* 10. Third-Party Links */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">10. Third-Party Links and Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Services may contain links to third-party websites, services, or payment gateways (including Razorpay). We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you access.
            </p>
          </section>

          {/* 11. International Data Transfers */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">11. International Data Transfers</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence (including in connection with cloud hosting and analytics). These countries may have data protection laws different from those of your country. By using our Services, you consent to such transfers in compliance with applicable Indian law.
            </p>
          </section>

          {/* 12. Changes to Privacy Policy */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">12. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date, or, where appropriate, by sending you an in-app or email notification. You are advised to review this Privacy Policy periodically.
            </p>
          </section>

          {/* 13. Governing Law */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <Scale className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">13. Governing Law and Jurisdiction</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this Privacy Policy shall be subject to the exclusive jurisdiction of the courts located in Pune, Maharashtra, India.
            </p>
          </section>

          {/* 14. Grievance Officer */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">14. Grievance Officer</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>In accordance with the Information Technology Act, 2000, the Consumer Protection Act, 2019, and the Digital Personal Data Protection Act, 2023, the details of our Grievance Officer are as follows:</p>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Designation:</span>
                  <span>Grievance Officer</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Company:</span>
                  <span>TellMe Digi Infotech Pvt Ltd</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Email:</span>
                  <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Address:</span>
                  <span>218, Akshay Complex, Dhole Patil Road, Pune – 411001, Maharashtra, India</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Working Hours:</span>
                  <span>Monday to Friday, 10:00 AM – 6:00 PM IST (excluding public holidays)</span>
                </div>
              </div>
              <p>The Grievance Officer will acknowledge complaints within 48 hours and resolve them within 30 days from the date of receipt of the complaint.</p>
            </div>
          </section>

          {/* 15. Contact Us */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">15. Contact Us</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              <p className="mb-4">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-1">
                <p className="text-foreground font-medium">TellMe Digi Infotech Pvt Ltd</p>
                <p>Email: <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a></p>
                <p>Website: <a href="https://youtellme.ai/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://youtellme.ai/</a></p>
                <p>Address: 218, Akshay Complex, Dhole Patil Road, Pune – 411001, Maharashtra, India</p>
              </div>
              <p className="mt-4 italic text-sm">By using Divya Darshan 360, you acknowledge that you have read and understood this Privacy Policy.</p>
            </div>
          </section>

          {/* ============== TERMS & CONDITIONS ============== */}
          <section id="terms" className="scroll-mt-20 pt-8">
            <h2 className="text-3xl md:text-4xl font-serif mb-2">Terms &amp; Conditions</h2>
            <p className="text-sm text-muted-foreground mb-8">
              The legal agreement governing your use of our App, Website, and purchase of our Products.
            </p>
          </section>

          {/* T 1. Introduction and Acceptance */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">1. Introduction and Acceptance of Terms</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of the Divya Darshan 360 mobile application, our website (the &quot;Website&quot;), and any products (including VR Boxes and related accessories) or services we offer (collectively, the &quot;Services&quot;) operated by TellMe Digi Infotech Pvt Ltd (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), a company incorporated under the Companies Act, 2013, with its registered office at 218, Akshay Complex, Dhole Patil Road, Pune – 411001, Maharashtra, India.
              </p>
              <p>
                By downloading, installing, accessing, or using the App or Website, by creating an account, or by placing an order with us, you (&quot;you,&quot; &quot;User,&quot; or &quot;Customer&quot;) agree to be legally bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Services.
              </p>
              <p>
                These Terms constitute an electronic contract under the Information Technology Act, 2000, and the Indian Contract Act, 1872, and do not require any physical, electronic, or digital signature.
              </p>
            </div>
          </section>

          {/* T 2. Eligibility */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">2. Eligibility</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>To use our Services and place orders, you must:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Be at least 18 years of age and capable of entering into a legally binding contract under the Indian Contract Act, 1872.</li>
                <li>Provide accurate, current, and complete information during registration and at checkout.</li>
                <li>Not be prohibited from receiving our Services under applicable Indian law.</li>
              </ul>
              <p>If you are below 18, you may use the Services only with the involvement and consent of a parent or legal guardian.</p>
            </div>
          </section>

          {/* T 3. Account Registration */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">3. Account Registration</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>You may need to create an account to access certain features or to make purchases. You agree to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Be solely responsible for all activities under your account.</li>
                <li>Notify us immediately of any unauthorized use or breach of your account.</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts that contain false information, are used fraudulently, or violate these Terms.</p>
            </div>
          </section>

          {/* T 4. Products and Services */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-500">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">4. Products and Services</h2>
            </div>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="text-foreground font-medium mb-2">4.1 Digital Content</h3>
                <p className="text-sm">Divya Darshan 360 offers 360° VR videos, live and recorded temple darshans, aartis, and other spiritual content through the App, intended for personal, non-commercial spiritual use.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">4.2 VR Box and Physical Products</h3>
                <p className="text-sm mb-2">We sell VR Boxes and related accessories (the &quot;Products&quot;) through our Website and App. We make every effort to display Product details, images, dimensions, specifications, and prices accurately. However:</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Product images are for illustration only; actual color, packaging, or appearance may vary slightly.</li>
                  <li>We do not warrant that Product descriptions or other content is fully accurate, complete, or error-free at all times.</li>
                  <li>All Products are subject to availability. We reserve the right to limit quantities, discontinue any Product, or correct typographical errors at any time without notice.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* T 5. Pricing, Taxes, and Order Acceptance */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">5. Pricing, Taxes, and Order Acceptance</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
              <li>All prices are listed in Indian Rupees (INR / ₹) and are inclusive of applicable GST unless otherwise specified.</li>
              <li>Shipping charges, if any, will be displayed separately at checkout before you confirm your order.</li>
              <li>We reserve the right to change prices at any time without prior notice. The price applicable to your order will be the price displayed at the time of order confirmation.</li>
              <li>In the event of an obvious pricing error (such as a price listed at a fraction of its actual value), we reserve the right to cancel the order and issue a full refund.</li>
              <li>Your order is an offer to purchase. Acceptance occurs only when we send you an order-confirmation email/SMS or dispatch the Product, whichever is earlier. Until then we may decline or cancel any order at our discretion.</li>
            </ul>
          </section>

          {/* T 6. Payments and Payment Gateway */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">6. Payments and Payment Gateway</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We accept payments through Razorpay (Razorpay Software Private Limited), a PCI-DSS Level 1 certified payment gateway. Available payment methods include:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Credit Cards (Visa, MasterCard, RuPay, American Express)</li>
                <li>Debit Cards (all major Indian banks)</li>
                <li>UPI (Google Pay, PhonePe, Paytm, BHIM, etc.)</li>
                <li>Net Banking (all major Indian banks)</li>
                <li>Mobile Wallets (where supported by Razorpay)</li>
                <li>EMI options (where applicable, subject to bank/Razorpay terms)</li>
              </ul>
              <p className="font-medium text-foreground">You agree that:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>All payments are processed securely by Razorpay. We do not collect or store your card number, CVV, UPI PIN, OTP, or net-banking credentials.</li>
                <li>Your use of Razorpay is subject to Razorpay&rsquo;s own Terms of Service and Privacy Policy, available at <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://razorpay.com</a>.</li>
                <li>You are responsible for ensuring sufficient funds and authorisation in your selected payment method.</li>
                <li>In case of payment failure, the transaction will not be completed, and any debited amount will be refunded by Razorpay/your bank as per their standard timelines (typically 5–7 business days).</li>
                <li>We are not responsible for any losses arising from incorrect payment details entered by you, payment failures by your bank/wallet, or delays attributable to Razorpay.</li>
                <li>In case of suspected fraudulent transactions, we reserve the right to cancel the order, withhold delivery, and refund the amount.</li>
              </ul>
            </div>
          </section>

          {/* T 7. Shipping and Delivery */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
                <Truck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">7. Shipping and Delivery</h2>
            </div>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="text-foreground font-medium mb-2">7.1 Shipping Locations</h3>
                <p className="text-sm">We currently ship VR Boxes and related Products only within India. International shipping is not available at this time unless explicitly indicated.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">7.2 Dispatch and Delivery Timelines</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Orders are typically dispatched within 2–4 business days from the date of order confirmation and successful payment.</li>
                  <li>Estimated delivery time is 5–10 business days from dispatch, depending on your location and the courier partner.</li>
                  <li>Delivery to remote locations, hilly areas, or PIN codes with limited courier coverage may take additional time.</li>
                  <li>We are not liable for delays caused by courier partners, natural calamities, strikes, lockdowns, civil disruptions, or other events beyond our reasonable control.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">7.3 Shipping Charges</h3>
                <p className="text-sm">Shipping charges, if any, will be calculated and displayed at checkout. We may offer free shipping on selected orders or during promotional offers, at our discretion.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">7.4 Order Tracking</h3>
                <p className="text-sm">Once dispatched, you will receive a tracking number via email/SMS. You can track your order through the courier partner&rsquo;s website or via our customer support.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">7.5 Delivery Attempts</h3>
                <p className="text-sm">Our courier partners typically make 2–3 delivery attempts. If the package cannot be delivered after these attempts, it will be returned to us. If a package is returned due to incorrect address, refusal to accept, or unavailability, re-shipping charges may apply.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">7.6 Risk of Loss</h3>
                <p className="text-sm">Risk of loss and title for Products purchased through our Services pass to you upon delivery to the courier partner. However, we will assist you in good faith with claims for items lost or damaged in transit, provided you notify us within 48 hours of delivery (or attempted delivery).</p>
              </div>
            </div>
          </section>

          {/* T 8. Cancellation, Returns and Refunds */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">8. Cancellation, Returns and Refunds</h2>
            </div>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="text-foreground font-medium mb-2">8.1 Order Cancellation by Customer</h3>
                <p className="text-sm">
                  You may cancel your order at any time before it is dispatched by contacting us at{" "}
                  <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a>{" "}
                  with your order ID. Once an order has been dispatched, it cannot be cancelled, but you may follow our return process below.
                </p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">8.2 Order Cancellation by Us</h3>
                <p className="text-sm mb-2">We reserve the right to cancel any order at our sole discretion, including (but not limited to) the following circumstances:</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>The Product is out of stock.</li>
                  <li>Inaccuracies or errors in pricing or Product information.</li>
                  <li>Suspected fraudulent or unauthorised transactions.</li>
                  <li>Delivery to the address provided is not feasible.</li>
                </ul>
                <p className="text-sm mt-2">In such cases, the full amount paid will be refunded to the original payment method via Razorpay.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">8.3 Returns and Replacements</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Returns or replacements are accepted only if the Product is received damaged, defective, or significantly different from the description.</li>
                  <li>You must notify us within 48 hours of delivery, with photos/videos of the issue and a clear unboxing video (where possible), at <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a>.</li>
                  <li>Products must be returned in their original packaging, unused, with all tags, accessories, and freebies intact.</li>
                  <li>We do not accept returns for change of mind, buyer&rsquo;s remorse, minor variations in color/appearance, or for hygiene-related items once unsealed.</li>
                  <li>Once we receive and inspect the returned Product, we will notify you of approval or rejection of the return.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">8.4 Refunds</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Approved refunds will be initiated within 5–7 business days from the date of approval.</li>
                  <li>Refunds will be processed through Razorpay back to the original payment method.</li>
                  <li>Depending on your bank/payment provider, the credit may take an additional 5–10 business days to reflect.</li>
                  <li>Shipping charges, if any, are non-refundable, except where the return is due to our error or a defective Product.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* T 9. Use of Digital Content */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">9. Use of Digital Content</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                All content available through the App and Website — including 360° videos, temple darshans, aartis, music, graphics, text, software, and spiritual content (the &quot;Content&quot;) — is the exclusive property of TellMe Digi Infotech Pvt Ltd or its licensors, and is protected under the Indian Copyright Act, 1957, the Trade Marks Act, 1999, and other intellectual property laws.
              </p>
              <p className="font-medium text-foreground">You agree to:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Use the Content solely for personal, non-commercial spiritual purposes.</li>
                <li>Not record, download (other than as expressly permitted), redistribute, broadcast, modify, sell, license, sublicense, or create derivative works from any Content.</li>
                <li>Not remove, alter, or obscure any copyright, trademark, or proprietary notices.</li>
                <li>Not use any automated means (bots, scrapers, etc.) to access the Services.</li>
              </ul>
            </div>
          </section>

          {/* T 10. User Conduct */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <Ban className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">10. User Conduct and Prohibited Activities</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>You agree to use the Services in a respectful manner consistent with their spiritual purpose. You shall <strong>NOT</strong>:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Use the Services for any unlawful, fraudulent, abusive, or harmful purpose.</li>
                <li>Upload or transmit viruses, malware, or any malicious code.</li>
                <li>Attempt to gain unauthorized access to our systems, other users&rsquo; accounts, or interfere with our infrastructure.</li>
                <li>Reverse-engineer, decompile, or disassemble any portion of the App.</li>
                <li>Post or transmit content that is hateful, obscene, defamatory, infringing, or that promotes religious intolerance, hatred, or discrimination.</li>
                <li>Resell, redistribute, or commercialise the Services or Content without our prior written consent.</li>
                <li>Use the Services in violation of any applicable Indian law, including the Information Technology Act, 2000.</li>
              </ul>
            </div>
          </section>

          {/* T 11. Intellectual Property */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">11. Intellectual Property</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                All intellectual property rights in and to the App, Website, Products (including their design, branding, packaging), trademarks, logos, copyrights, trade dress, and proprietary technology remain the exclusive property of TellMe Digi Infotech Pvt Ltd. No license or right is granted to you except as expressly set out in these Terms.
              </p>
              <p>&quot;Divya Darshan 360&quot; and our logo are trademarks of TellMe Digi Infotech Pvt Ltd. Any unauthorized use is strictly prohibited.</p>
            </div>
          </section>

          {/* T 12. Product Warranty and Disclaimer */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">12. Product Warranty and Disclaimer</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>VR Boxes, where covered by a manufacturer warranty, will carry the warranty terms specified in the Product packaging or product page on our Website.</li>
                <li>Warranty does not cover damage caused by misuse, accidental damage, unauthorised repairs, exposure to liquid, normal wear and tear, or use other than as intended.</li>
                <li>All warranty claims must be supported by the original invoice and made through our customer support channels.</li>
              </ul>
              <p className="text-sm">
                Except for any express warranty stated above or as required by applicable law, the Services and Products are provided on an &quot;as is&quot; and &quot;as available&quot; basis, without any warranties of merchantability, fitness for a particular purpose, or non-infringement, to the maximum extent permitted by law.
              </p>
              <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                <h3 className="text-foreground font-medium mb-2">12.1 Spiritual, Religious, and Non-Medical Disclaimer</h3>
                <p className="text-sm">
                  The Content provided through the App and Website — including darshans, aartis, rituals, mantras, and spiritual guidance — is intended solely for devotional and informational purposes. It does not constitute religious instruction, priestly advice, or medical/psychological guidance. You acknowledge that spiritual experiences may vary from person to person, and you agree not to rely on the Content as a substitute for professional religious consultation, medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </section>

          {/* T 13. Limitation of Liability */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Scale className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">13. Limitation of Liability</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>To the maximum extent permitted by applicable Indian law:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>TellMe Digi Infotech Pvt Ltd, its directors, employees, affiliates, and agents shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including loss of profits, data, goodwill, or other intangible losses, arising out of or relating to your use of the Services or Products.</li>
                <li>Our total aggregate liability arising out of or in connection with the Services or any Product shall not exceed the total amount paid by you for the specific Product/order giving rise to the claim, or INR 5,000, whichever is lower.</li>
                <li>Nothing in these Terms shall exclude or limit our liability for matters that cannot lawfully be excluded under Indian law.</li>
              </ul>
            </div>
          </section>

          {/* T 14. Indemnification */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">14. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless TellMe Digi Infotech Pvt Ltd, its directors, officers, employees, agents, and affiliates from and against any claims, demands, losses, liabilities, damages, costs, and expenses (including reasonable legal fees) arising out of or relating to: (a) your breach of these Terms; (b) your misuse of the Services or Products; (c) your violation of any law or third-party right; or (d) any content you submit through the Services.
            </p>
          </section>

          {/* T 15. Termination */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">15. Termination</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We may suspend or terminate your access to the Services at any time, with or without notice, if we believe you have breached these Terms or for any other reason at our sole discretion. Upon termination, your right to use the Services will immediately cease, but provisions relating to intellectual property, indemnity, limitation of liability, and governing law will survive.
            </p>
          </section>

          {/* T 16. Force Majeure */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">16. Force Majeure</h2>
            <p className="text-muted-foreground leading-relaxed">
              We shall not be liable for any failure or delay in performance caused by circumstances beyond our reasonable control, including acts of God, natural calamities, pandemics, epidemics, war, terrorism, riots, civil unrest, government actions, lockdowns, internet or telecommunication failures, courier disruptions, or strikes.
            </p>
          </section>

          {/* T 17. Governing Law */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <Gavel className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">17. Governing Law and Jurisdiction</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with these Terms or the Services shall be subject to the exclusive jurisdiction of the competent courts located in Pune, Maharashtra, India.
            </p>
          </section>

          {/* T 18. Dispute Resolution */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">18. Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed">
              Before initiating any legal action, the parties shall attempt to resolve disputes amicably. You may first contact our Grievance Officer at{" "}
              <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a>. If the dispute is not resolved within 30 days, either party may pursue remedies available under applicable Indian law, subject to the jurisdiction clause above.
            </p>
          </section>

          {/* T 19. Grievance Officer */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">19. Grievance Officer</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>In compliance with the Information Technology Act, 2000, the Consumer Protection Act, 2019, and the Consumer Protection (E-Commerce) Rules, 2020:</p>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Designation:</span>
                  <span>Grievance Officer</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Company:</span>
                  <span>TellMe Digi Infotech Pvt Ltd</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Email:</span>
                  <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Address:</span>
                  <span>218, Akshay Complex, Dhole Patil Road, Pune – 411001, Maharashtra, India</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium text-foreground">Working Hours:</span>
                  <span>Monday to Friday, 10:00 AM – 6:00 PM IST</span>
                </div>
              </div>
              <p>The Grievance Officer will acknowledge complaints within 48 hours and resolve them within 30 days from the date of receipt.</p>
            </div>
          </section>

          {/* T 20. Miscellaneous */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">20. Miscellaneous</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="text-foreground font-medium mb-2">20.1 Severability</h3>
                <p className="text-sm">If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">20.2 Waiver</h3>
                <p className="text-sm">Our failure to enforce any right or provision shall not constitute a waiver of such right or provision.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">20.3 Entire Agreement</h3>
                <p className="text-sm">These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and us regarding the Services.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">20.4 Assignment</h3>
                <p className="text-sm">You may not assign these Terms without our prior written consent. We may assign these Terms freely.</p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">20.5 Changes to Terms</h3>
                <p className="text-sm">We may revise these Terms at any time by updating this page. Your continued use of the Services after changes are posted constitutes acceptance of the revised Terms. We encourage you to review these Terms periodically.</p>
              </div>
            </div>
          </section>

          {/* T 21. Contact Us */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">21. Contact Us</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              <p className="mb-4">For any questions, concerns, or feedback regarding these Terms, please contact us at:</p>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-1">
                <p className="text-foreground font-medium">TellMe Digi Infotech Pvt Ltd</p>
                <p>Email: <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a></p>
                <p>Website: <a href="https://youtellme.ai/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://youtellme.ai/</a></p>
                <p>Address: 218, Akshay Complex, Dhole Patil Road, Pune – 411001, Maharashtra, India</p>
              </div>
              <p className="mt-4 italic text-sm">By using Divya Darshan 360 or purchasing our Products, you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions.</p>
            </div>
          </section>

          {/* ============== COOKIE POLICY ============== */}
          <section id="cookies" className="glass rounded-3xl p-8 md:p-10 ornate-border scroll-mt-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
                <Cookie className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Cookie Policy</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Divya Darshan 360 may use cookies, web beacons, and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our Services. This Cookie Policy supplements our Privacy Policy.
              </p>
              <div className="space-y-4 mt-6">
                <div>
                  <h3 className="text-foreground font-medium mb-2">What Are Cookies?</h3>
                  <p className="text-sm">
                    Cookies are small text files stored on your device when you visit a website or use an app. They help us remember your preferences and understand how you interact with our Services.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">How We Use Cookies</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><strong>Essential Cookies:</strong> Required for the Services to function properly (including secure checkout and payment via Razorpay) and cannot be disabled.</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the App and Website to improve performance and user experience (e.g., Google Analytics, Firebase Analytics).</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences for a personalized experience.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">Managing Cookies</h3>
                  <p className="text-sm">
                    You can manage cookie preferences through your device settings or browser. However, disabling certain cookies may affect the functionality of the Services, including the ability to complete purchases.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
