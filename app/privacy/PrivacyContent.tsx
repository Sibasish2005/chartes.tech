"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/(landing-page)/footer";
import {
  ArrowLeft,
  Printer,
  ChevronRight,
  ArrowUp,
  ExternalLink,
  ShieldCheck,
  Mail,
  AlertCircle
} from "lucide-react";

interface SectionItem {
  id: string;
  number: string;
  title: string;
}

const SECTIONS: SectionItem[] = [
  { id: "overview", number: "1", title: "Introduction & Scope" },
  { id: "information-collected", number: "2", title: "Information We Collect" },
  { id: "how-we-use-information", number: "3", title: "How We Use Information" },
  { id: "social-media-apis", number: "4", title: "Social Platform APIs & Third Parties" },
  { id: "ai-features", number: "5", title: "AI & Automated Features" },
  { id: "data-sharing", number: "6", title: "How We Share Information" },
  { id: "security", number: "7", title: "Security & Safeguards" },
  { id: "retention-deletion", number: "8", title: "Data Retention & Deletion" },
  { id: "privacy-rights", number: "9", title: "Your Privacy Rights" },
  { id: "cookies", number: "10", title: "Cookies & Tracking" },
  { id: "international-transfers", number: "11", title: "International Data Transfers" },
  { id: "children-privacy", number: "12", title: "Children's Privacy" },
  { id: "policy-updates", number: "13", title: "Changes to This Policy" },
  { id: "contact", number: "14", title: "Contact Us" },
];

export default function PrivacyContent() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const scrollPosition = window.scrollY + 180;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = SECTIONS[i];
        const el = document.getElementById(section.id);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 antialiased selection:bg-neutral-200">
      {/* Minimal Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-neutral-600 transition hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>chartes.tech</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-medium text-neutral-900">Privacy Policy</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/terms"
              className="text-xs font-medium text-neutral-500 transition hover:text-neutral-900 hidden sm:inline"
            >
              Terms of Service
            </Link>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
        
        {/* Document Title Header */}
        <div className="mb-12 border-b border-neutral-200 pb-8">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#A67C3D]">
            <ShieldCheck className="h-4 w-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
            chartes.tech Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl text-base text-neutral-600 leading-relaxed">
            This Privacy Policy explains how chartes.tech (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, stores, and protects personal information in connection with our website, application, dashboard, APIs, and content automation tools (collectively, the &quot;Services&quot;).
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-500">
            <div>
              <span className="font-semibold text-neutral-700">Effective Date:</span> August 24, 2026
            </div>
            <div className="hidden sm:inline text-neutral-300">•</div>
            <div>
              <span className="font-semibold text-neutral-700">Last Updated:</span> August 2026
            </div>
            <div className="hidden sm:inline text-neutral-300">•</div>
            <div>
              <span className="font-semibold text-neutral-700">Version:</span> 2.6.0
            </div>
          </div>
        </div>

        {/* Content Layout: Sticky Nav Sidebar + Prose Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Table of Contents - Desktop Sticky Sidebar */}
          <aside className="lg:col-span-4 sticky top-20 hidden lg:block print:hidden">
            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 px-2">
                On This Page
              </div>
              <nav className="space-y-0.5 max-h-[calc(100vh-140px)] overflow-y-auto pr-1 text-xs">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                        isActive
                          ? "bg-white text-[#A67C3D] font-medium shadow-xs border border-neutral-200/60"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60"
                      }`}
                    >
                      <span className="truncate">
                        <span className="text-neutral-400 mr-1.5">{sec.number}.</span>
                        {sec.title}
                      </span>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#A67C3D]" />}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-neutral-200/80 px-2 space-y-2">
                <Link
                  href="/connected-accounts"
                  className="flex items-center justify-between text-xs text-neutral-600 hover:text-neutral-900 transition"
                >
                  <span>Manage Connected Accounts</span>
                  <ExternalLink className="h-3 w-3 text-neutral-400" />
                </Link>
                <a
                  href="mailto:privacy@chartes.tech"
                  className="flex items-center justify-between text-xs text-neutral-600 hover:text-neutral-900 transition"
                >
                  <span>Contact Privacy Team</span>
                  <Mail className="h-3 w-3 text-neutral-400" />
                </a>
              </div>
            </div>
          </aside>

          {/* Document Content Column */}
          <main className="lg:col-span-8 space-y-12 text-sm sm:text-base leading-relaxed text-neutral-700">

            {/* Mobile Jump Selector */}
            <div className="lg:hidden print:hidden rounded-lg border border-neutral-200 bg-neutral-50/80 p-3">
              <label htmlFor="mobile-jump" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Jump to Section
              </label>
              <div className="relative">
                <select
                  id="mobile-jump"
                  value={activeSection}
                  onChange={(e) => scrollToSection(e.target.value)}
                  className="w-full appearance-none rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-800 shadow-2xs focus:border-[#A67C3D] focus:outline-none focus:ring-1 focus:ring-[#A67C3D]"
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.number}. {sec.title}
                    </option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rotate-90 text-neutral-400" />
              </div>
            </div>

            {/* Section 1 */}
            <section id="overview" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                1. Introduction & Scope
              </h2>
              <p>
                chartes.tech provides brand growth, social media scheduling, and AI-assisted content workflow software for creators, agencies, and businesses. This Privacy Policy describes how we handle personal information collected through our website, web application, APIs, user dashboard, and related services.
              </p>
              <p>
                This policy applies to individuals who visit our website, register for an account, or use our Services. When you connect external social media accounts (such as Instagram, Facebook, LinkedIn, Google, or YouTube), those third-party platforms operate independently and handle data according to their own privacy policies and terms.
              </p>
              <div className="rounded-lg border-l-4 border-[#A67C3D] bg-neutral-50 p-4 text-xs sm:text-sm text-neutral-700">
                <strong className="font-semibold text-neutral-900">Mandatory Rights Savings Clause:</strong> Nothing in this Privacy Policy is intended to limit, exclude, or restrict any rights or protections that cannot lawfully be excluded under applicable data protection laws.
              </div>
            </section>

            {/* Section 2 */}
            <section id="information-collected" className="scroll-mt-24 space-y-5">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                2. Information We Collect
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600">
                We collect information that is reasonably necessary to provide, support, and operate the Services. You should avoid submitting sensitive personal information to the Services unless it is necessary for your use of the Services.
              </p>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-neutral-900">2.1 Account & Contact Information</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-xs sm:text-sm">
                  <li>Name, email address, username, and encrypted password.</li>
                  <li>Organization name, workspace role, avatar, and timezone preferences.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-neutral-900">2.2 Billing Information</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-xs sm:text-sm">
                  <li>Billing contact details, address, and transaction records. Payment card processing is handled directly by third-party payment processors. chartes.tech does not store raw payment card numbers on its servers.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-neutral-900">2.3 User Content & Media Assets</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-xs sm:text-sm">
                  <li>Visual and media assets uploaded to the platform (such as images, video reels, graphics, and audio).</li>
                  <li>Post text, captions, hashtags, draft schedules, and calendar queues.</li>
                </ul>
                <p className="text-xs sm:text-sm text-neutral-600">
                  You are responsible for ensuring that content and personal information you submit to or publish through the Services is used lawfully and that you have the necessary rights, permissions, and authorizations.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-neutral-900">2.4 Connected Social Media Information</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-xs sm:text-sm">
                  <li>Authorization tokens (OAuth tokens and refresh tokens) received when you connect external accounts.</li>
                  <li>Account identifiers, channel names, public profile information, and post engagement analytics retrieved via platform APIs.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-neutral-900">2.5 AI Prompts & Content Inputs</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-xs sm:text-sm">
                  <li>Prompts, creative directions, audience descriptions, tone preferences, and resulting AI-assisted drafts.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-neutral-900">2.6 Communications</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-xs sm:text-sm">
                  <li>Inquiries sent to customer support, error reports, and user feedback.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-neutral-900">2.7 Device, Log & Usage Information</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-xs sm:text-sm">
                  <li>IP address, browser type, operating system, pages visited, session duration, and technical error logs.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="how-we-use-information" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                3. How We Use Information
              </h2>
              <p>We use the information we collect for straightforward operational purposes:</p>
              
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-600">
                <li><strong>Delivering the Services:</strong> Creating and managing accounts, scheduling posts, publishing content to connected channels, and displaying analytics.</li>
                <li><strong>AI Functionality:</strong> Processing user-submitted prompts to generate suggested text, captions, or scheduling ideas.</li>
                <li><strong>Customer Support & Operations:</strong> Responding to user inquiries, resolving technical problems, and sending service notices (such as password resets and billing receipts).</li>
                <li><strong>Security & Protection:</strong> Verifying logins, preventing unauthorized access, mitigating fraud or abuse, and enforcing our terms.</li>
                <li><strong>Service Improvement:</strong> Reviewing aggregate usage trends and troubleshooting bugs to enhance product reliability.</li>
                <li><strong>Legal Compliance:</strong> Complying with applicable tax, accounting, and legal requirements.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="social-media-apis" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                4. Social Platform APIs & Third Parties
              </h2>
              <p>
                Our platform connects with third-party social networks through their official developer APIs. Our use of information received from these APIs complies with the applicable platform policies:
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="rounded-lg border border-neutral-200/80 p-3.5 bg-neutral-50/50">
                  <strong className="text-neutral-900">Meta Platforms:</strong> Data from Instagram and Facebook APIs is accessed solely to publish authorized posts, read basic profile info, and retrieve post analytics.
                </div>
                <div className="rounded-lg border border-neutral-200/80 p-3.5 bg-neutral-50/50">
                  <strong className="text-neutral-900">Google API Services:</strong> chartes.tech&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A67C3D] underline underline-offset-2"
                  >
                    Google API Services User Data Policy
                  </a>
                  , including the Limited Use requirements.
                </div>
                <div className="rounded-lg border border-neutral-200/80 p-3.5 bg-neutral-50/50">
                  <strong className="text-neutral-900">LinkedIn:</strong> Used to publish authorized updates and retrieve engagement performance metrics.
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600">
                <strong>Third-Party Policies:</strong> Independent third-party platforms have their own privacy policies, terms, and data collection practices. chartes.tech does not control how external platforms process data once it has been transmitted to them.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                <strong>Disconnecting Accounts:</strong> You can disconnect your social accounts at any time via the{" "}
                <Link href="/connected-accounts" className="text-[#A67C3D] underline underline-offset-2 font-medium">
                  Connected Accounts page
                </Link>{" "}
                or directly within the security settings of the connected platform. Disconnecting removes stored authorization tokens from our active database.
              </p>
            </section>

            {/* Section 5 */}
            <section id="ai-features" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                5. AI & Automated Features
              </h2>
              <p>
                When you use AI-assisted tools within chartes.tech, the text prompts and instructions you provide are processed to deliver the requested captions, content ideas, or drafts.
              </p>
              <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50/50 p-4 text-xs sm:text-sm text-amber-900 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Important Notice on AI-Generated Outputs</span>
                </div>
                <p>
                  AI outputs are generated algorithmically and may occasionally be inaccurate, incomplete, or unintended. Users should review and verify all AI-generated copy and media recommendations before publishing or relying on them.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="data-sharing" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                6. How We Share Information
              </h2>
              <p>
                <strong>We do not sell, rent, or trade personal information.</strong> We only share information in the following limited circumstances:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-600">
                <li><strong>Service Providers:</strong> We may use third-party service providers for hosting, databases, payments, email delivery, media storage, analytics, AI processing, and other services needed to operate the Services. These providers may process personal information only as reasonably necessary to provide their services.</li>
                <li><strong>User-Directed Disclosures:</strong> When you schedule or publish content, you direct us to transmit that content and related media to the social platforms you have connected.</li>
                <li><strong>Legal Disclosures:</strong> We may disclose information if we believe in good faith that it is reasonably necessary to comply with valid legal obligations, court orders, or governmental requests, or to protect the rights, property, and safety of chartes.tech, our users, or others.</li>
                <li><strong>Business Transfers:</strong> If chartes.tech is involved in a merger, acquisition, reorganization, sale of assets, or bankruptcy, personal information may be transferred as part of that corporate transaction.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="security" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                7. Security & Safeguards
              </h2>
              <p>
                We maintain reasonable technical and organizational measures designed to protect personal information against unauthorized access, loss, alteration, or disclosure.
              </p>
              <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4 text-xs sm:text-sm text-neutral-700">
                <strong className="font-semibold text-neutral-900">Security Limitation:</strong> No method of transmission over the Internet, electronic storage, or electronic processing can be guaranteed to be completely secure. While we take reasonable steps to protect your information, we cannot guarantee absolute security.
              </div>
            </section>

            {/* Section 8 */}
            <section id="retention-deletion" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                8. Data Retention & Deletion
              </h2>
              <p>
                We retain personal information for as long as reasonably necessary to provide the Services, maintain security, comply with legal obligations, resolve disputes, and enforce our agreements.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                When you close your account or request data deletion, we take steps to remove your personal information and active authorization tokens from our active databases. Some information may be retained where required by law (such as financial or tax records) or where reasonably necessary for legitimate business purposes.
              </p>
              <p className="text-xs sm:text-sm text-neutral-500">
                Please note that deleted information may remain temporarily in secure system backups until those backups are routinely overwritten in the ordinary course of operations.
              </p>
            </section>

            {/* Section 9 */}
            <section id="privacy-rights" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                9. Your Privacy Rights
              </h2>
              <p>
                Depending on your location and applicable data protection laws, you may have rights regarding your personal information, including:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="rounded-md border border-neutral-200/80 p-2.5 bg-neutral-50/40">
                  <strong className="text-neutral-900">Access:</strong> Request confirmation of processing and a copy of your information.
                </div>
                <div className="rounded-md border border-neutral-200/80 p-2.5 bg-neutral-50/40">
                  <strong className="text-neutral-900">Correction:</strong> Request correction of inaccurate or incomplete information.
                </div>
                <div className="rounded-md border border-neutral-200/80 p-2.5 bg-neutral-50/40">
                  <strong className="text-neutral-900">Deletion:</strong> Request deletion of your personal information.
                </div>
                <div className="rounded-md border border-neutral-200/80 p-2.5 bg-neutral-50/40">
                  <strong className="text-neutral-900">Portability:</strong> Request a copy of your data in a structured, standard format.
                </div>
                <div className="rounded-md border border-neutral-200/80 p-2.5 bg-neutral-50/40">
                  <strong className="text-neutral-900">Restriction & Objection:</strong> Request limits on or object to certain processing activities.
                </div>
                <div className="rounded-md border border-neutral-200/80 p-2.5 bg-neutral-50/40">
                  <strong className="text-neutral-900">Consent Withdrawal:</strong> Revoke consent where processing relies on consent.
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600">
                <strong>Applicability & Verification:</strong> These rights may vary depending on your location and applicable law, and may be subject to legal exceptions. We may take reasonable steps to verify your identity before fulfilling your request. We respond to verified requests within the timeframe required by applicable law.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                You also have the right to lodge a complaint with your local data protection authority if you have concerns about how we handle your personal information.
              </p>
            </section>

            {/* Section 10 */}
            <section id="cookies" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                10. Cookies & Tracking Technologies
              </h2>
              <p>
                We use cookies and browser local storage to maintain session logins, secure the application, and understand how the Services are used.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-xs sm:text-sm">
                <li><strong>Strictly Necessary Cookies:</strong> Required for account authentication, security validation, and session maintenance.</li>
                <li><strong>Functional & Analytics Cookies:</strong> Used to remember user preferences and measure platform performance.</li>
              </ul>
              <p className="text-xs sm:text-sm text-neutral-600">
                Where required by applicable law, we obtain consent before using non-essential cookies or similar technologies.
              </p>
              <p className="text-xs text-neutral-500">
                You can configure your browser to reject or delete cookies. However, disabling essential cookies may prevent parts of the Services from working properly.
              </p>
            </section>

            {/* Section 11 */}
            <section id="international-transfers" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                11. International Data Transfers
              </h2>
              <p>
                chartes.tech operates globally. Personal information collected about you may be processed and stored in countries other than your country of residence, including the United States, where our hosting and service providers maintain facilities.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                Where required by applicable law, we implement appropriate safeguards to protect personal information transferred across international borders.
              </p>
            </section>

            {/* Section 12 */}
            <section id="children-privacy" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                12. Children&apos;s Privacy
              </h2>
              <p>
                The Services are intended for adults (18 years of age or older) and are not directed toward children. We do not knowingly collect personal information from children under 18. If we learn that we have inadvertently collected information from a child, we will take steps to delete that information promptly.
              </p>
            </section>

            {/* Section 13 */}
            <section id="policy-updates" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                13. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time as our Services evolve or as legal requirements change. When changes are made, we will update the &quot;Effective Date&quot; and &quot;Last Updated&quot; dates at the top of this page. If we make material changes, we will provide notice through appropriate channels (such as an in-app notification or email) where required by applicable law.
              </p>
            </section>

            {/* Section 14 */}
            <section id="contact" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                14. Contact Us
              </h2>
              <p>
                If you have questions, feedback, or privacy-related requests, you can contact our privacy team at:
              </p>
              <div className="rounded-lg border border-neutral-200 p-4 bg-neutral-50/50 space-y-1 text-xs sm:text-sm">
                <div className="font-semibold text-neutral-900">chartes.tech Privacy Contact</div>
                <div className="text-neutral-600">
                  Email: <a href="mailto:privacy@chartes.tech" className="text-[#A67C3D] underline">privacy@chartes.tech</a>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 rounded-full border border-neutral-200 bg-white p-2.5 text-neutral-600 shadow-md transition hover:bg-neutral-50 hover:text-neutral-900 print:hidden"
          aria-label="Back to Top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {/* Shared Site Footer */}
      <Footer />
    </div>
  );
}
