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
          <section className="glass rounded-3xl p-8 md:p-10 ornate-border">
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
              <p>To exercise these rights, please contact us at the information provided below.</p>
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
