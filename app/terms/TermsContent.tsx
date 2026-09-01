"use client";

import { useState, useEffect, useMemo } from "react";
import { Poppins, Roboto_Slab } from "next/font/google";
import Link from "next/link";
import Footer from "@/components/(landing-page)/footer";
import {
  FileText,
  ShieldCheck,
  UserCheck,
  Share2,
  Cpu,
  Copyright,
  AlertTriangle,
  CreditCard,
  Clock,
  Scale,
  ShieldAlert,
  Ban,
  Globe,
  RefreshCw,
  Mail,
  Printer,
  ArrowLeft,
  ChevronRight,
  Search,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

interface SectionItem {
  id: string;
  number: string;
  title: string;
  icon: any;
}

const SECTIONS: SectionItem[] = [
  { id: "acceptance", number: "1", title: "Acceptance of Terms & Eligibility", icon: CheckCircle2 },
  { id: "services-description", number: "2", title: "Service Description & SaaS Scope", icon: FileText },
  { id: "user-accounts", number: "3", title: "User Accounts & Authentication", icon: UserCheck },
  { id: "platform-integrations", number: "4", title: "Third-Party Social APIs & OAuth", icon: Share2 },
  { id: "ai-content-generation", number: "5", title: "AI Automation & Generated Content", icon: Cpu },
  { id: "intellectual-property", number: "6", title: "Intellectual Property & Content Ownership", icon: Copyright },
  { id: "acceptable-use", number: "7", title: "Acceptable Use & Prohibited Conduct", icon: AlertTriangle },
  { id: "billing-subscriptions", number: "8", title: "Subscription Plans, Billing & Refunds", icon: CreditCard },
  { id: "service-availability", number: "9", title: "Service Availability & SLA", icon: Clock },
  { id: "liability-disclaimers", number: "10", title: "Disclaimers & Limitation of Liability", icon: Scale },
  { id: "indemnification", number: "11", title: "Indemnification", icon: ShieldAlert },
  { id: "suspension-termination", number: "12", title: "Suspension & Termination", icon: Ban },
  { id: "governing-law", number: "13", title: "Governing Law & Dispute Resolution", icon: Globe },
  { id: "terms-modifications", number: "14", title: "Modifications to Terms", icon: RefreshCw },
  { id: "legal-contact", number: "15", title: "Legal Inquiries & Notices", icon: Mail },
];

export default function TermsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("acceptance");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const query = searchQuery.toLowerCase();
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.number.includes(query)
    );
  }, [searchQuery]);

  return (
    <div className={`min-h-screen bg-[#FDFBF7] text-[#1A1A1A] ${poppins.className}`}>
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-neutral-800 text-[#F3EBDD] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="chartes.tech Logo"
                className="h-8 sm:h-10 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="hidden sm:block h-6 w-px bg-neutral-800" />
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#F3EBDD]/60 font-medium">
              <span className="text-[#A67C3D]">Legal Center</span>
              <span>/</span>
              <span className="text-[#F3EBDD]">Terms of Service</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/privacy"
              className="hidden lg:inline-block text-xs font-medium text-[#F3EBDD]/70 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-700 hover:border-neutral-500 text-xs font-medium text-[#F3EBDD]/80 hover:text-white transition-all"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Terms</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-xs sm:text-sm font-medium text-[#F3EBDD] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-[#A67C3D] hover:bg-[#8f6b34] text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_2px_10px_rgba(166,124,61,0.3)]"
            >
              Client Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero / Header Section */}
      <section className="relative bg-[#0D0D0D] text-[#F3EBDD] py-16 sm:py-24 border-b border-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(166,124,61,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A67C3D]/20 border border-[#A67C3D]/40 text-[#D8B480] text-xs font-medium tracking-wide uppercase">
              <FileText className="w-3.5 h-3.5" />
              <span>Master Services Agreement</span>
            </div>
            <h1 className={`${robotoSlab.className} text-3xl sm:text-5xl font-bold tracking-tight text-[#F3EBDD] leading-tight`}>
              Terms and Conditions of Service
            </h1>
            <p className="text-sm sm:text-base text-[#F3EBDD]/70 leading-relaxed">
              These Terms of Service govern your access to and use of chartes.tech platform, automated publishing infrastructure, artificial intelligence tools, and developer integrations.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#F3EBDD]/50 border-t border-neutral-800/80">
              <div>Effective Date: <strong className="text-[#F3EBDD]/80">August 26, 2026</strong></div>
              <div>•</div>
              <div>Version: <strong className="text-[#F3EBDD]/80">2.4.0 (Enterprise)</strong></div>
              <div>•</div>
              <Link href="/privacy" className="text-[#A67C3D] hover:underline flex items-center gap-1">
                <span>View Privacy Policy</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar / TOC */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 lg:self-start space-y-6">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#EAE3D9] focus:outline-none focus:ring-1 focus:ring-[#A67C3D] text-neutral-900 shadow-xs"
              />
            </div>

            {/* Table of Contents */}
            <div className="bg-white rounded-2xl border border-[#EAE3D9] p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-3 pb-3 border-b border-[#EAE3D9]/60">
                Table of Contents
              </h3>
              <nav className="mt-3 space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                        isActive
                          ? "bg-[#18181B] text-white font-semibold shadow-xs"
                          : "text-neutral-600 hover:bg-[#FAF8F5] hover:text-neutral-900"
                      }`}
                    >
                      <span className={`w-5 text-[11px] font-mono shrink-0 ${isActive ? "text-[#D8B480]" : "text-neutral-400"}`}>
                        {section.number}.
                      </span>
                      <span className="truncate">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                <ShieldCheck className="w-4 h-4 text-[#A67C3D]" />
                <span>Summary & Assurance</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                You retain full ownership of your content and brand assets. chartes.tech publishes strictly on your behalf via official OAuth APIs with end-to-end credential encryption.
              </p>
            </div>
          </aside>

          {/* Legal Content */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-12 bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-10 lg:p-12 shadow-xs">
            {/* Section 1 */}
            <section id="acceptance" className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  1
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Acceptance of Terms & Eligibility
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  By creating an account, accessing, or utilizing the <strong>chartes.tech</strong> platform, application programming interfaces (APIs), social automation scheduler, or related services (collectively, the &ldquo;Services&rdquo;), you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service (&ldquo;Agreement&rdquo;) and our Privacy Policy.
                </p>
                <p>
                  If you are entering into this Agreement on behalf of a company, organization, agency, or other legal entity, you represent and warrant that you possess full corporate authority to bind that entity to these Terms. If you do not have such authority or do not agree with any part of these Terms, you must not use or access the Services.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 2 */}
            <section id="services-description" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  2
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Service Description & SaaS Scope
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  chartes.tech provides an automated social media orchestrator and management platform enabling users to create, schedule, optimize, generate AI-assisted multimedia content, and dispatch social media publications to supported third-party platforms (including LinkedIn, Meta Instagram, and Facebook).
                </p>
                <p>
                  We continuously improve and expand our offerings. chartes.tech reserves the right to modify, refine, update, or temporarily suspend aspects of the Services to introduce new features, improve security, or maintain infrastructure integrity.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 3 */}
            <section id="user-accounts" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  3
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  User Accounts & Authentication
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  To use the Services, you must register for an account by providing accurate, complete, and updated information. You are solely responsible for maintaining the confidentiality of your account credentials, passwords, and sessions.
                </p>
                <p>
                  You agree to immediately notify chartes.tech at <strong>support@chartes.tech</strong> of any unauthorized use or security breach of your account. chartes.tech shall not be liable for any losses or damages resulting from unauthorized account access.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 4 */}
            <section id="platform-integrations" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  4
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Third-Party Social APIs & OAuth Compliance
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  chartes.tech interacts with external developer APIs provided by social networks (e.g. LinkedIn API, Meta Graph API, Google OAuth). By connecting accounts, you authorize chartes.tech to access and publish content on your behalf in strict accordance with the permissions granted.
                </p>
                <p>
                  You agree to comply with the relevant developer terms of each connected provider:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                  <li>LinkedIn Developer Terms of Use and API Policies.</li>
                  <li>Meta Platform Terms and Community Guidelines.</li>
                  <li>Google API Services User Data Policy, including Limited Use requirements.</li>
                </ul>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 5 */}
            <section id="ai-content-generation" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  5
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  AI Automation & Generated Content
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  Our platform offers artificial intelligence capabilities for caption synthesis, hashtag generation, and scheduling recommendations. While our AI models strive for accuracy and creativity, you acknowledge that AI-generated output should be reviewed prior to publication.
                </p>
                <p>
                  You are solely responsible for ensuring that all published content complies with applicable advertising laws, intellectual property rights, and platform community standards.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 6 */}
            <section id="intellectual-property" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  6
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Intellectual Property & Content Ownership
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  <strong>Your Content:</strong> You retain 100% ownership and intellectual property rights in and to any text, images, media assets, and branding uploaded to chartes.tech. You grant us a worldwide, non-exclusive license solely to process, host, transform, and transmit your content for the purpose of executing the Services.
                </p>
                <p>
                  <strong>Our Platform:</strong> All software, designs, algorithms, user interfaces, branding, and proprietary systems of chartes.tech remain the exclusive intellectual property of chartes.tech and its licensors.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 7 */}
            <section id="acceptable-use" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  7
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Acceptable Use & Prohibited Conduct
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>You agree not to use the Services to:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                  <li>Distribute spam, deceptive marketing, malware, or phishing campaigns.</li>
                  <li>Infringe upon intellectual property, trademark, or privacy rights of any third party.</li>
                  <li>Circumvent API rate limits, security tokens, or platform access controls.</li>
                  <li>Engage in reverse engineering, scraping, or automated abuse of the chartes.tech backend.</li>
                </ul>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 8 */}
            <section id="billing-subscriptions" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  8
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Subscription Plans, Billing & Refunds
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  Certain tiers of the Services require paid subscriptions. Subscription fees are billed in advance on a recurring monthly or annual cycle. You may cancel your subscription at any time via your account settings; cancellation takes effect at the end of the current billing period.
                </p>
                <p>
                  Unless required by law, all payments are non-refundable once processed. Custom enterprise agreements supersede standard tier pricing terms.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 9 */}
            <section id="service-availability" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  9
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Service Availability & SLA
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  chartes.tech targets a 99.9% uptime for core publishing dispatchers and webhook queues. Scheduled maintenance windows will be announced in advance through dashboard alerts whenever possible.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 10 */}
            <section id="liability-disclaimers" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  10
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Disclaimers & Limitation of Liability
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHARTES.TECH DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  IN NO EVENT SHALL CHARTES.TECH OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE USE OF THE SERVICES.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 11 */}
            <section id="indemnification" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  11
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Indemnification
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  You agree to defend, indemnify, and hold harmless chartes.tech, its directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of your content or violation of these Terms.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 12 */}
            <section id="suspension-termination" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  12
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Suspension & Termination
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  You may terminate your account at any time. chartes.tech reserves the right to suspend or terminate accounts that breach these Terms or engage in fraudulent or harmful conduct.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 13 */}
            <section id="governing-law" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  13
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Governing Law & Dispute Resolution
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law principles. Any legal disputes shall be resolved through binding arbitration or competent courts.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 14 */}
            <section id="terms-modifications" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  14
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Modifications to Terms
                </h2>
              </div>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-3">
                <p>
                  We may update these Terms from time to time. When significant updates occur, we will notify registered users via in-app banner or email at least 30 days prior to the effective date.
                </p>
              </div>
            </section>

            <hr className="border-[#EAE3D9]/60" />

            {/* Section 15 */}
            <section id="legal-contact" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold font-mono">
                  15
                </span>
                <h2 className={`${robotoSlab.className} text-xl sm:text-2xl font-bold text-neutral-900`}>
                  Legal Inquiries & Notices
                </h2>
              </div>
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2">
                <p className="text-xs text-neutral-700">
                  For legal inquiries, contracts, or notices regarding these Terms, please contact:
                </p>
                <div className="text-xs text-neutral-900 font-medium">
                  <div>Legal Department — <strong>chartes.tech</strong></div>
                  <div>Email: <a href="mailto:legal@chartes.tech" className="text-[#A67C3D] hover:underline">legal@chartes.tech</a></div>
                  <div>Support: <a href="mailto:support@chartes.tech" className="text-[#A67C3D] hover:underline">support@chartes.tech</a></div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
