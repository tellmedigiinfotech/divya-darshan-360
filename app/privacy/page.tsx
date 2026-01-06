import Link from "next/link"
import { Shield, ArrowLeft, Lock, FileText, Users, Globe, Mail, Database, Eye, Trash, Bell } from "lucide-react"

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
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Privacy Policy</h1>
          <p className="text-lg text-foreground font-medium">Divya Darshan 360</p>
          <p className="text-muted-foreground">Effective Date: December 26, 2025</p>
          <p className="text-muted-foreground">Last Updated: December 26, 2025</p>
        </header>

        <div className="space-y-12">
          {/* Introduction */}
          <section id="privacy" className="glass rounded-3xl p-8 md:p-10 ornate-border scroll-mt-20">
            <h2 className="text-2xl font-serif mb-6">Introduction</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Welcome to Divya Darshan 360 ("we," "our," or "us"). This Privacy Policy explains how TellMe Digi Infotech Pvt Ltd collects, uses, discloses, and safeguards your information when you use our Divya Darshan 360 mobile application (the "App") available on Android and iOS platforms.
              </p>
              <p>
                Please read this Privacy Policy carefully. By downloading, accessing, or using the App, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this Privacy Policy, please do not access the App.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Information We Collect</h2>
            </div>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  1. Information You Provide to Us
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Account Information:</strong> If you create an account, we may collect your name, email address, and profile preferences.</li>
                  <li><strong>User Preferences:</strong> Your favorite temples, deities, aartis, and viewing preferences within the App.</li>
                  <li><strong>Feedback and Communications:</strong> Any feedback, comments, or inquiries you send to us.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  2. Information Automatically Collected
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers, and mobile network information.</li>
                  <li><strong>Usage Data:</strong> Features you use, content you view, time spent on the App, and interaction patterns.</li>
                  <li><strong>Log Data:</strong> IP address, access times, app crashes, and system activity.</li>
                  <li><strong>Location Information:</strong> With your consent, we may collect approximate location data to provide location-based content recommendations.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  3. Information from Third-Party Services
                </h3>
                <p className="text-sm">
                  If you connect the App to third-party services (such as Google for authentication), we may receive information from those services based on your privacy settings with them.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">How We Use Your Information</h2>
            </div>
            <ul className="list-disc pl-5 space-y-3 text-muted-foreground leading-relaxed">
              <li><strong>Provide and Maintain the App:</strong> Deliver the VR video content, temple darshan experiences, and aarti services.</li>
              <li><strong>Personalization:</strong> Customize your experience based on your preferences, such as recommending relevant temples, deities, and content.</li>
              <li><strong>Improvements:</strong> Analyze usage patterns to improve the App's features, design, and performance.</li>
              <li><strong>Communications:</strong> Send you updates, notifications about new content, and respond to your inquiries.</li>
              <li><strong>Safety and Security:</strong> Detect, prevent, and address technical issues, fraud, or security concerns.</li>
              <li><strong>Legal Compliance:</strong> Comply with applicable laws, regulations, and legal processes.</li>
            </ul>
          </section>

          {/* Data Sharing and Disclosure */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Data Sharing and Disclosure</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">We do not sell your personal information.</p>
              <p>We may share your information only in the following circumstances:</p>
              <div className="space-y-4 mt-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-foreground font-medium mb-2">1. Service Providers</h3>
                  <p className="text-sm">We may share information with third-party vendors who assist us in operating the App, including cloud hosting providers (Firebase, Google Cloud), analytics services, and customer support services.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-foreground font-medium mb-2">2. Legal Requirements</h3>
                  <p className="text-sm">We may disclose information if required by law or in response to valid legal requests by public authorities.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-foreground font-medium mb-2">3. Business Transfers</h3>
                  <p className="text-sm">In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-foreground font-medium mb-2">4. With Your Consent</h3>
                  <p className="text-sm">We may share information with third parties when you have given us explicit consent to do so.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Data Security</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security assessments</li>
                <li>Access controls and monitoring</li>
              </ul>
              <p className="text-sm italic">However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Trash className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Data Retention</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When your information is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          {/* Your Rights and Choices */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                <Bell className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Your Rights and Choices</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information.</li>
                <li><strong>Opt-Out:</strong> Opt out of certain data collection or marketing communications.</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format.</li>
              </ul>
              <p>To exercise your rights to access, correction, deletion, withdrawal of consent, or other privacy‑related requests, you may:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Use the in‑app settings (where available); or</li>
                <li>Write to us at <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a> or contact the Grievance Officer with details of your request.</li>
              </ul>
              <p className="mt-4">We may request additional information to verify your identity and may retain certain data where required under Indian law (for example, for accounting, tax, or dispute‑resolution purposes).</p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              The App is intended for general audiences and is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">Third-Party Links and Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              The App may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you access through the App.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">International Data Transfers</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from your country. By using the App, you consent to the transfer of your information to these countries.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <h2 className="text-2xl font-serif mb-6">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Terms of Service */}
          <section id="terms" className="glass rounded-3xl p-8 md:p-10 ornate-border scroll-mt-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Terms of Service</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Effective Date: December 26, 2025</p>
              <p>
                By downloading, installing, accessing, or using Divya Darshan 360 ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.
              </p>
              <div className="space-y-4 mt-6">
                <div>
                  <h3 className="text-foreground font-medium mb-2">1. Acceptance of Terms</h3>
                  <p className="text-sm">
                    These Terms constitute a legally binding agreement between you and TellMe Digi Infotech Pvt Ltd. By using the App, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">2. Use of Content</h3>
                  <p className="text-sm">
                    All content available through the App, including but not limited to 360° videos, temple darshans, aartis, and spiritual content, is the exclusive property of TellMe Digi Infotech Pvt Ltd and its licensors. You agree to use the content solely for personal, non-commercial spiritual purposes. Recording, redistributing, or reproducing any content is strictly prohibited.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">3. User Conduct</h3>
                  <p className="text-sm">
                    You agree to use the App in a respectful manner consistent with its spiritual purpose. You shall not misuse, abuse, or exploit the App or its content in any way that violates applicable laws or regulations.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">4. Intellectual Property</h3>
                  <p className="text-sm">
                    All intellectual property rights in the App, including trademarks, copyrights, and proprietary technology, remain the exclusive property of TellMe Digi Infotech Pvt Ltd.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">5. Limitation of Liability</h3>
                  <p className="text-sm">
                    The App is provided "as is" without warranties of any kind. TellMe Digi Infotech Pvt Ltd shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Policy */}
          <section id="cookies" className="glass rounded-3xl p-8 md:p-10 ornate-border scroll-mt-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Cookie Policy</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Divya Darshan 360 may use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services.
              </p>
              <div className="space-y-4 mt-6">
                <div>
                  <h3 className="text-foreground font-medium mb-2">What Are Cookies?</h3>
                  <p className="text-sm">
                    Cookies are small text files stored on your device when you visit a website or use an app. They help us remember your preferences and understand how you interact with our App.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">How We Use Cookies</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><strong>Essential Cookies:</strong> Required for the App to function properly and cannot be disabled.</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the App to improve performance and user experience.</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences for a personalized experience.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">Managing Cookies</h3>
                  <p className="text-sm">
                    You can manage cookie preferences through your device settings or browser. However, disabling certain cookies may affect the functionality of the App.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Governing Law and Jurisdiction */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Governing Law and Jurisdiction</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this Privacy Policy shall be subject to the exclusive jurisdiction of the courts located in Pune,Maharashtra India.
            </p>
          </section>

          {/* Grievance Officer */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Grievance Officer</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>In accordance with applicable Indian law, the details of the Grievance Officer are as follows:</p>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium text-foreground">Name:</span>
                  <span></span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium text-foreground">Designation:</span>
                  <span>Grievance Officer</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium text-foreground">Email:</span>
                  <a href="mailto:Connect@youtellme.ai" className="text-primary hover:underline">Connect@youtellme.ai</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium text-foreground">Address:</span>
                  <span>218 , Akshay Complex, Dhole patil Road, Pune - 411001</span>
                </div>
              </div>
              <p>
                Users in India may contact the Grievance Officer with concerns or grievances regarding their personal information. The Grievance Officer will acknowledge and resolve grievances within a reasonable time, typically within 30 days.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif">Contact Us</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              <p className="mb-4">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <p className="text-foreground font-medium mb-2">TellMe Digi Infotech Pvt Ltd</p>
                <p>Email: <a href="mailto:connect@youtellme.ai" className="text-primary hover:underline">connect@youtellme.ai</a></p>
                <p>Website: <a href="https://youtellme.ai/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://youtellme.ai/</a></p>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-muted-foreground italic">
            © 2025 TellMe Digi Infotech Pvt Ltd. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  )
}
