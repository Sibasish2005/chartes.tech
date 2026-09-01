"use client";

import { useState, useEffect, useMemo } from "react";
import { Poppins, Roboto_Slab } from "next/font/google";
import Link from "next/link";
import Footer from "@/components/(landing-page)/footer";
import {
  ShieldCheck,
  Lock,
  Eye,
  Key,
  Cpu,
  Scale,
  Server,
  Trash2,
  UserCheck,
  Cookie,
  Globe,
  AlertCircle,
  Mail,
  Search,
  ArrowLeft,
  ArrowUp,
  ExternalLink,
  CheckCircle2,
  Share2,
  FileCheck,
  Printer,
  ChevronRight
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
  { id: "overview", number: "1", title: "Introduction & Overview", icon: ShieldCheck },
  { id: "definitions", number: "2", title: "Definitions & Key Terms", icon: FileCheck },
  { id: "information-collected", number: "3", title: "Information We Collect", icon: Eye },
  { id: "how-we-use-information", number: "4", title: "How We Use Your Information", icon: Cpu },
  { id: "social-media-apis", number: "5", title: "Social Media Platform APIs & OAuth", icon: Share2 },
  { id: "ai-data-processing", number: "6", title: "AI & Machine Learning Policies", icon: Cpu },
  { id: "legal-bases", number: "7", title: "Legal Bases for Processing (GDPR)", icon: Scale },
  { id: "data-sharing", number: "8", title: "Data Sharing & Sub-Processors", icon: Server },
  { id: "security-encryption", number: "9", title: "Security, Encryption & Token Vaults", icon: Lock },
  { id: "retention-deletion", number: "10", title: "Data Retention & Account Deletion", icon: Trash2 },
  { id: "your-privacy-rights", number: "11", title: "Your Rights & Privacy Controls", icon: UserCheck },
  { id: "cookies-tracking", number: "12", title: "Cookies & Tracking Technologies", icon: Cookie },
  { id: "international-transfers", number: "13", title: "International Data Transfers", icon: Globe },
  { id: "children-privacy", number: "14", title: "Children's Privacy Protection", icon: AlertCircle },
  { id: "policy-updates", number: "15", title: "Changes to This Policy", icon: FileCheck },
  { id: "contact-dpo", number: "16", title: "Contact Us & Data Protection Officer", icon: Mail },
];

export default function PrivacyContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Determine active section
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
              <span className="text-[#F3EBDD]">Privacy Policy</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/terms"
              className="hidden lg:inline-block text-xs font-medium text-[#F3EBDD]/70 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-700 hover:border-neutral-500 text-xs font-medium text-[#F3EBDD]/80 hover:text-white transition-all"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Policy</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-xs sm:text-sm font-medium text-[#F3EBDD] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              href="/automation"
              className="px-4 py-2 rounded-full bg-[#A67C3D] hover:bg-[#8f6b34] text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_2px_10px_rgba(166,124,61,0.3)]"
            >
              Client Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero / Header Section */}
      <section className="relative bg-[#0D0D0D] text-[#F3EBDD] py-16 sm:py-24 border-b border-neutral-800 overflow-hidden">
        {/* Subtle Decorative Background Gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#A67C3D]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#A67C3D]/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A67C3D]/15 border border-[#A67C3D]/30 text-[#A67C3D] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Trust, Governance & Data Protection</span>
            </div>

            <h1 className={`${robotoSlab.className} text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F3EBDD]`}>
              chartes.tech Privacy Policy
            </h1>

            <p className="text-base sm:text-lg text-[#F3EBDD]/70 font-light leading-relaxed">
              At chartes.tech (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), protecting the integrity of your personal information, social media authorizations, brand media assets, and artificial intelligence workflows is a foundational commitment. This policy outlines our stringent privacy protocols, data safeguards, and legal compliance.
            </p>

            {/* Document Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-800/80 text-xs sm:text-sm text-[#F3EBDD]/60">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#F3EBDD]/90">Effective Date:</span>
                <span>August 24, 2026</span>
              </div>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#F3EBDD]/90">Last Updated:</span>
                <span>August 2026</span>
              </div>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#F3EBDD]/90">Version:</span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-[#A67C3D] font-mono text-xs">v2.4.0</span>
              </div>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-medium">Fully Enforced & Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Privacy Commitments Grid */}
      <section className="bg-[#141414] border-b border-neutral-800 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold text-[#A67C3D] uppercase tracking-widest mb-6">
            Key Privacy Guarantees at a Glance
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:border-[#A67C3D]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A67C3D]/10 flex items-center justify-center text-[#A67C3D]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Zero Data Selling</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We never sell, broker, or monetize your private contact data, credentials, or connected account tokens under any circumstances.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:border-[#A67C3D]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A67C3D]/10 flex items-center justify-center text-[#A67C3D]">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Isolated Token Vaults</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                OAuth access tokens for Instagram, LinkedIn, Meta, and Google are encrypted at rest with AES-256 and transmitted exclusively via TLS 1.3.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:border-[#A67C3D]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A67C3D]/10 flex items-center justify-center text-[#A67C3D]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Private AI Guardrails</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Your proprietary brand prompts, media files, and caption drafts are processed via zero-retention enterprise pipelines and never used to train public LLMs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:border-[#A67C3D]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A67C3D]/10 flex items-center justify-center text-[#A67C3D]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Full GDPR & CCPA Rights</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Seamless self-service data export, social account disconnection, and 30-day complete data purge upon account deletion request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area with Sticky Sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-neutral-900 text-sm tracking-tight flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#A67C3D]" />
                  <span>Table of Contents</span>
                </h2>
                <span className="text-[11px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                  16 Sections
                </span>
              </div>

              {/* Quick Search within document */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search policy sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C3D]/30 focus:border-[#A67C3D] transition-all placeholder:text-neutral-400"
                />
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 max-h-[55vh] overflow-y-auto pr-1 text-xs">
                {filteredSections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group transition-all ${
                        isActive
                          ? "bg-[#A67C3D]/10 text-[#A67C3D] font-semibold border-l-2 border-[#A67C3D]"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-[10px] font-mono opacity-60 w-4">{sec.number}.</span>
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? "text-[#A67C3D] translate-x-0.5" : "text-neutral-400 opacity-0 group-hover:opacity-100"}`} />
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <div className="text-[11px] text-neutral-500 font-medium">Quick Privacy Actions</div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/connected-accounts"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-medium border border-neutral-200/60 transition-colors"
                  >
                    <span>Manage Connected Accounts</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </Link>
                  <a
                    href="mailto:privacy@chartes.tech"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-medium border border-neutral-200/60 transition-colors"
                  >
                    <span>Contact Privacy Officer</span>
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="p-5 rounded-2xl bg-[#0D0D0D] text-[#F3EBDD] border border-neutral-800 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A67C3D]">
                <ShieldCheck className="w-4 h-4" />
                <span>chartes.tech Privacy Pledge</span>
              </div>
              <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                Your brand reputation is your greatest asset. We build automation tools with strict least-privilege principles so you always retain 100% ownership over your brand intellectual property and data.
              </p>
            </div>
          </aside>

          {/* Detailed Legal Content Column */}
          <div className="lg:col-span-8 space-y-12 leading-relaxed text-neutral-700">

            {/* Section 1: Introduction & Overview */}
            <section id="overview" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  01
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  1. Introduction & Overview
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  Welcome to <strong>chartes.tech</strong> (&quot;chartes.tech&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a premier brand growth, content generation, and social media automation technology platform. chartes.tech empowers creators, agencies, enterprise brands, and businesses to orchestrate high-converting social campaigns, automate scheduled publishing, generate AI-assisted multimedia content, and analyze performance metrics across multiple connected social networks.
                </p>
                <p>
                  This Privacy Policy details how chartes.tech collects, processes, stores, protects, and discloses personal data and digital assets when you access our web application, mobile applications, APIs, content schedulers, and associated services (collectively, the &quot;Services&quot;).
                </p>
                <p>
                  By registering an account, connecting social media channels, or interacting with our platform in any manner, you acknowledge having read and understood the practices described herein.
                </p>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs sm:text-sm flex items-start gap-3 leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-amber-950">Scope Note:</strong> This Privacy Policy applies to data processed by chartes.tech as a Data Controller and, where applicable under data processing agreements with enterprise teams, as a Data Processor on behalf of our business clients.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Definitions */}
            <section id="definitions" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  02
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  2. Definitions & Key Terminology
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
                  <div className="font-semibold text-neutral-900">Personal Data</div>
                  <div className="text-neutral-600">Any information relating to an identified or identifiable natural person, including names, email addresses, IP addresses, and account credentials.</div>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="font-semibold text-neutral-900 text-sm mb-1">OAuth Token Vault</div>
                  <div className="text-neutral-600">Encrypted authorization keys issued by third-party platforms (e.g. Meta, LinkedIn, Google) allowing chartes.tech to publish posts and fetch analytics on your behalf.</div>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="font-semibold text-neutral-900 text-sm mb-1">Brand Media & Content Assets</div>
                  <div className="text-neutral-600">Media files, imagery, video reels, captions, hashtags, schedule calendars, and campaign drafts uploaded or generated inside the chartes.tech platform.</div>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="font-semibold text-neutral-900 text-sm mb-1">Sub-Processors</div>
                  <div className="text-neutral-600">Third-party service providers engaged by chartes.tech to provide hosting, database storage, email delivery, AI inference, and billing processing under strict contractual terms.</div>
                </div>
              </div>
            </section>

            {/* Section 3: Information We Collect */}
            <section id="information-collected" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  03
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  3. Information We Collect
                </h2>
              </div>

              <div className="space-y-6 text-sm sm:text-base">
                <div className="space-y-3">
                  <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#A67C3D]" />
                    <span>3.1 Information You Directly Provide</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-2">
                    <li><strong>Account Credentials:</strong> Full name, professional email address, hashed passwords, profile image, organization/agency name, and timezone preferences.</li>
                    <li><strong>Billing & Transaction Details:</strong> Billing address, tax identification numbers, and payment transaction metadata. Credit card numbers are tokenized and processed exclusively through PCI-DSS Level 1 compliant payment processors (such as Stripe).</li>
                    <li><strong>Communication Records:</strong> Customer support tickets, feedback submissions, strategy consultation notes, and onboarding survey answers.</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#A67C3D]" />
                    <span>3.2 Connected Social Media Accounts & OAuth Data</span>
                  </h3>
                  <p className="text-neutral-600">
                    When you link social accounts (e.g. Instagram Business, Facebook Pages, LinkedIn Pages, Google/YouTube, X/Twitter), we request authorization via standard OAuth 2.0 protocols. Depending on the permissions you grant, we collect and store:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-2">
                    <li>Secure access tokens, refresh tokens, and token expiration timestamps.</li>
                    <li>Social account identifiers (User ID, Page ID, Business Account ID, handle/username).</li>
                    <li>Public profile details (display name, avatar URL, follower count).</li>
                    <li>Content publication statuses and historical performance analytics (impressions, reach, engagement rates, click-throughs).</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#A67C3D]" />
                    <span>3.3 User Content & AI Input Prompts</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-2">
                    <li>Uploaded multimedia files (high-resolution images, video files, audio tracks, brand logos, PDF documents).</li>
                    <li>Text prompts provided to AI content generation engines, target audience descriptions, tone-of-voice preferences, and custom brand guidelines.</li>
                    <li>Generated post drafts, scheduled publishing queues, content calendar tags, and approval history.</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#A67C3D]" />
                    <span>3.4 Automatically Collected Telemetry & Device Data</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-2">
                    <li><strong>Device & Network Information:</strong> IP address, browser type and version, operating system, device identifiers, and language settings.</li>
                    <li><strong>Usage & Session Logs:</strong> Features utilized, click streams, page view durations, publishing errors, and latency metrics.</li>
                    <li><strong>Cookies & Local Storage:</strong> Essential session cookies, security tokens, and local cache entries to ensure seamless application state.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4: How We Use Your Information */}
            <section id="how-we-use-information" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  04
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  4. How We Use Your Information
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>We process your personal data for legitimate, specific, and transparent purposes:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-neutral-900 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Service Delivery & Automation</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Executing automated post publishing, scheduling content pipelines, validating media formats, and synchronizing data across social platforms.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-neutral-900 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>AI Content Generation</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Transforming your raw prompts into tailored post captions, graphic templates, hashtag suggestions, and optimized posting schedules.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-neutral-900 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Analytics & Performance Insights</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Aggregating cross-platform metrics to deliver actionable intelligence on post engagement, follower growth, and optimal posting times.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-neutral-900 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Security & Fraud Prevention</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Detecting suspicious login activity, preventing unauthorized API misuse, monitoring system stability, and enforcing platform rate limits.
                    </p>
                  </div>
                </div>

                <p className="text-neutral-600 pt-2">
                  We also use your contact information for critical transactional communications, such as token expiration alerts, scheduled post failure notices, invoice receipts, and vital security advisories.
                </p>
              </div>
            </section>

            {/* Section 5: Social Media Platform APIs & OAuth */}
            <section id="social-media-apis" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  05
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  5. Social Media Platform APIs & OAuth Governance
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  chartes.tech interacts with official developer APIs provided by social networks. Our usage of data received from these APIs adheres strictly to each platform&apos;s developer terms and user data policies:
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="font-semibold text-neutral-900 text-sm flex items-center gap-2 mb-1">
                      <span>Meta Platforms (Instagram & Facebook Graph APIs)</span>
                    </div>
                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                      chartes.tech accesses Instagram and Facebook data solely to publish media, read basic profile information, and collect page analytics authorized by you. We do not access private direct messages or personal friends lists. All Meta platform terms and developer policies are strictly respected.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="font-semibold text-neutral-900 text-sm flex items-center gap-2 mb-1">
                      <span>Google API Services & YouTube API Services</span>
                    </div>
                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                      chartes.tech&apos;s use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-[#A67C3D] underline underline-offset-2">Google API Services User Data Policy</a>, including the Limited Use requirements.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="font-semibold text-neutral-900 text-sm flex items-center gap-2 mb-1">
                      <span>LinkedIn Marketing Developer Platform</span>
                    </div>
                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                      We access LinkedIn company pages and professional profiles only to publish approved status updates, articles, and retrieve organic performance metrics.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 text-[#F3EBDD] text-xs sm:text-sm">
                  <div className="font-semibold text-[#A67C3D] mb-1 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    <span>User Token Revocation & Isolation</span>
                  </div>
                  <p className="text-neutral-300">
                    You maintain complete sovereignty over your social integrations. You can disconnect any social network at any moment through the <Link href="/connected-accounts" className="text-[#A67C3D] underline underline-offset-2 font-medium">Connected Accounts page</Link> or by revoking chartes.tech&apos;s permissions directly inside the security settings of Instagram, Facebook, Google, or LinkedIn. Upon disconnection, all stored tokens are permanently erased from our active databases.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: AI & Machine Learning Policies */}
            <section id="ai-data-processing" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  06
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  6. AI & Machine Learning Data Processing Policies
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  chartes.tech incorporates advanced generative artificial intelligence to assist users in crafting compelling social copy, generating campaign concepts, and automating workflow schedules. We enforce rigorous ethical AI policies:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="font-semibold text-neutral-900 text-sm mb-1">No AI Training on Private Assets</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">
                      We do <strong>NOT</strong> use your proprietary brand media, confidential creative prompts, private captions, or customer data to train public LLM models (e.g. OpenAI, Anthropic) without explicit written agreement.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="font-semibold text-neutral-900 text-sm mb-1">Zero-Retention API Processing</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">
                      Prompts and content sent to enterprise AI inference providers are subject to strict zero-data-retention (ZDR) agreements preventing long-term caching or secondary processing.
                    </div>
                  </div>
                </div>

                <div className="text-neutral-600 text-xs sm:text-sm">
                  <strong className="text-neutral-900 font-semibold">Human-in-the-Loop Safeguards:</strong> chartes.tech provides manual review stages allowing you to inspect, edit, or reject any AI-generated social media post prior to scheduled dispatch.
                </div>
              </div>
            </section>

            {/* Section 7: Legal Bases (GDPR) */}
            <section id="legal-bases" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  07
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  7. Legal Bases for Processing (GDPR Article 6)
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  If you reside in the European Economic Area (EEA), the United Kingdom, or Switzerland, we process your personal data under the following lawful legal grounds:
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
                    <strong className="font-semibold text-neutral-900">1. Contractual Necessity (Art. 6(1)(b) GDPR):</strong> Processing is necessary to establish your user account, execute requested social media publication tasks, deliver automation services, and process billing invoices.
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
                    <strong className="font-semibold text-neutral-900">2. Legitimate Interests (Art. 6(1)(f) GDPR):</strong> Processing is necessary for our legitimate business interests, including maintaining platform security, detecting fraudulent activity, improving application performance, and safeguarding our infrastructure.
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
                    <strong className="font-semibold text-neutral-900">3. Explicit Consent (Art. 6(1)(a) GDPR):</strong> Where you have granted explicit consent, such as authorizing specific third-party social media OAuth permissions or subscribing to optional marketing digests.
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
                    <strong className="font-semibold text-neutral-900">4. Legal Obligation (Art. 6(1)(c) GDPR):</strong> Processing necessary to comply with applicable statutory, tax, commercial, or judicial reporting requirements.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8: Data Sharing & Sub-Processors */}
            <section id="data-sharing" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  08
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  8. Data Sharing & Sub-Processors
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  <strong>We do not sell, rent, lease, or trade your personal information to any third party for advertising or marketing purposes.</strong> We only share data with vetted sub-processors bound by strict Data Processing Agreements (DPAs):
                </p>

                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-neutral-100/80 text-neutral-900 font-semibold border-b border-neutral-200">
                      <tr>
                        <th className="p-3">Entity / Provider</th>
                        <th className="p-3">Purpose / Category</th>
                        <th className="p-3">Data Transferred</th>
                        <th className="p-3">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white">
                      <tr>
                        <td className="p-3 font-medium text-neutral-900">Cloud Infrastructure (AWS / Vercel)</td>
                        <td className="p-3 text-neutral-600">Application hosting, CDN & compute</td>
                        <td className="p-3 text-neutral-600">Encrypted application payload & logs</td>
                        <td className="p-3 text-neutral-600">United States / EU</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-neutral-900">Prisma / PostgreSQL Hosting</td>
                        <td className="p-3 text-neutral-600">Secure transactional database</td>
                        <td className="p-3 text-neutral-600">Account profiles, post queues, metadata</td>
                        <td className="p-3 text-neutral-600">United States</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-neutral-900">Payment Gateway (Stripe)</td>
                        <td className="p-3 text-neutral-600">PCI-DSS compliant billing</td>
                        <td className="p-3 text-neutral-600">Payment identifiers, invoice history</td>
                        <td className="p-3 text-neutral-600">Global / US</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-neutral-900">ImageKit / Media CDN</td>
                        <td className="p-3 text-neutral-600">Optimized image & video asset delivery</td>
                        <td className="p-3 text-neutral-600">User uploaded media for publishing</td>
                        <td className="p-3 text-neutral-600">Global CDN</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-neutral-900">Social Platform APIs</td>
                        <td className="p-3 text-neutral-600">Direct post publishing & metrics</td>
                        <td className="p-3 text-neutral-600">Scheduled media, captions, hashtags</td>
                        <td className="p-3 text-neutral-600">Meta / Google / LinkedIn</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-neutral-500 pt-2">
                  Additionally, we may disclose information in response to lawful subpoenas, court orders, or government requests, or in connection with a corporate reorganization, merger, or asset sale, subject to confidentiality covenants.
                </p>
              </div>
            </section>

            {/* Section 9: Security Standards & Token Vaults */}
            <section id="security-encryption" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  09
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  9. Security, Encryption & Token Vaults
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  chartes.tech maintains multi-layered technical, physical, and administrative safeguards designed to protect your personal information against unauthorized access, destruction, loss, or disclosure:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
                    <div className="font-semibold text-neutral-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#A67C3D]" />
                      <span>AES-256 Encryption at Rest</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      All database records, credentials, and OAuth tokens are stored in cryptographically sealed vaults using AES-256 standard encryption keys.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
                    <div className="font-semibold text-neutral-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#A67C3D]" />
                      <span>TLS 1.3 Encryption in Transit</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      All network traffic between your browser, our servers, and third-party APIs is encrypted using Transport Layer Security (TLS 1.3/HTTPS).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
                    <div className="font-semibold text-neutral-900 flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#A67C3D]" />
                      <span>Salted Bcrypt Password Hashing</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Passwords are never stored in plaintext and undergo high-work-factor bcrypt salted hashing with strict entropy standards.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
                    <div className="font-semibold text-neutral-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#A67C3D]" />
                      <span>Role-Based Access Controls</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Internal engineering access is restricted according to the principle of least privilege, requiring hardware-backed MFA and audit logging.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 10: Retention & Account Deletion */}
            <section id="retention-deletion" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  10
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  10. Data Retention & Account Deletion
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  We retain personal data only for as long as your account remains active or as required to fulfill the purposes outlined in this policy, unless a longer retention duration is required by law (such as statutory financial audit laws).
                </p>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="font-semibold text-neutral-900 text-sm">Account Deletion & Content Purge</div>
                  <p className="text-neutral-600 text-xs sm:text-sm">
                    When you request account termination, chartes.tech executes a comprehensive deletion routine:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
                    <li>Social authentication tokens and secret credentials are permanently purged from database vaults immediately.</li>
                    <li>Uploaded brand media assets stored on CDN buckets are scheduled for permanent eradication within 30 calendar days.</li>
                    <li>Automated publishing queues, post schedules, and analytics caches are permanently eliminated.</li>
                    <li>Aggregated, anonymized statistical records stripped of personal identifiers may be retained for platform performance benchmarking.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 11: Your Rights & Privacy Controls */}
            <section id="your-privacy-rights" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  11
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  11. Your Rights & Privacy Controls
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  Depending on your jurisdiction (including the European Union under GDPR, United Kingdom, California under CCPA/CPRA, and other states), you possess comprehensive legal rights:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/60">
                    <strong className="text-neutral-900">Right to Access:</strong> Request a complete copy of the personal information we hold about you.
                  </div>
                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/60">
                    <strong className="text-neutral-900">Right to Rectification:</strong> Request correction of inaccurate or incomplete personal records.
                  </div>
                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/60">
                    <strong className="text-neutral-900">Right to Erasure (&quot;Be Forgotten&quot;):</strong> Request the permanent deletion of your personal data.
                  </div>
                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/60">
                    <strong className="text-neutral-900">Right to Data Portability:</strong> Receive your data in a structured, commonly used, machine-readable JSON format.
                  </div>
                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/60">
                    <strong className="text-neutral-900">Right to Restrict & Object:</strong> Limit or object to certain types of processing or automated decisions.
                  </div>
                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/60">
                    <strong className="text-neutral-900">Non-Discrimination:</strong> We will never deny services, charge differing prices, or alter service tiers for exercising privacy rights.
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="mailto:privacy@chartes.tech"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#A67C3D]/10 hover:bg-[#A67C3D]/20 text-[#A67C3D] font-medium transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>privacy@chartes.tech</span>
                  </a>
                  <span className="text-xs text-neutral-500">Responses delivered within 30 calendar days at zero cost.</span>
                </div>
              </div>
            </section>

            {/* Section 12: Cookies & Tracking */}
            <section id="cookies-tracking" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  12
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  12. Cookies & Tracking Technologies
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  We utilize cookies, web beacons, and browser local storage to maintain session state, authenticate client sessions, and capture diagnostic performance data:
                </p>

                <ul className="list-disc list-inside space-y-2 text-neutral-600 text-xs sm:text-sm ml-2">
                  <li><strong>Strictly Necessary Cookies:</strong> Mandatory for account authentication, CSRF security tokens, and state preservation. These cannot be disabled.</li>
                  <li><strong>Functional & Preference Cookies:</strong> Remember your workspace layouts, dark/light visual modes, and timezone settings.</li>
                  <li><strong>Analytical & Diagnostic Telemetry:</strong> Anonymized measurement of platform speed, feature adoption, and client errors to improve platform uptime.</li>
                </ul>

                <p className="text-xs text-neutral-500 pt-1">
                  You can configure your browser to reject cookies or notify you when cookies are set. Please note that disabling essential cookies may impact core functionalities of the chartes.tech web application.
                </p>
              </div>
            </section>

            {/* Section 13: International Data Transfers */}
            <section id="international-transfers" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  13
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  13. International Data Transfers
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  chartes.tech operates globally. Information collected about you may be transferred to, stored, and processed in the United States and other countries where our cloud sub-processors maintain server facilities.
                </p>
                <p>
                  When transferring personal data originating in the European Economic Area (EEA), the United Kingdom, or Switzerland to countries without an Adequacy Decision by the European Commission, we implement robust cross-border transfer mechanisms, including the European Commission&apos;s approved <strong>Standard Contractual Clauses (SCCs)</strong> and supplementary security measures.
                </p>
              </div>
            </section>

            {/* Section 14: Children's Privacy */}
            <section id="children-privacy" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  14
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  14. Children&apos;s Privacy Protection (COPPA Compliance)
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  chartes.tech Services are strictly intended for professional creators, businesses, and individuals who are at least <strong>18 years of age</strong> (or the legal age of majority in your jurisdiction). We do not knowingly solicit, collect, or process personal data from children under the age of 13 (or under 16 where local law mandates).
                </p>
                <p>
                  If we discover that a minor under the minimum legal age has registered an account or provided personal details to chartes.tech, we will take immediate steps to terminate the account and permanently purge the associated data. If you believe a child has provided us with personal information, please contact us immediately at <a href="mailto:privacy@chartes.tech" className="text-[#A67C3D] font-medium underline">privacy@chartes.tech</a>.
                </p>
              </div>
            </section>

            {/* Section 15: Changes to This Policy */}
            <section id="policy-updates" className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/10 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  15
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-neutral-900`}>
                  15. Changes to This Privacy Policy
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  We may periodically revise this Privacy Policy to reflect enhancements to our platform features, changes in legal frameworks, or updates to social media API developer agreements.
                </p>
                <p>
                  When material modifications occur, we will notify you through prominent in-app dashboard notices, an update to the &quot;Last Updated&quot; date at the top of this document, or direct email notifications to your registered email address at least <strong>30 days</strong> prior to the effective date of such changes. Continued use of chartes.tech following the effective date constitutes acceptance of the revised terms.
                </p>
              </div>
            </section>

            {/* Section 16: Contact Us & DPO */}
            <section id="contact-dpo" className="p-8 sm:p-10 rounded-2xl bg-[#0D0D0D] text-[#F3EBDD] border border-neutral-800 shadow-lg space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#A67C3D]/20 text-[#A67C3D] flex items-center justify-center font-bold text-sm font-mono">
                  16
                </span>
                <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl font-bold text-[#F3EBDD]`}>
                  16. Contact Us & Data Protection Officer
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#F3EBDD]/80">
                <p>
                  If you have inquiries, feedback, privacy rights requests, or wish to consult our designated Data Protection Officer (DPO), please reach out to our dedicated legal and compliance team:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="text-sm font-medium text-white">chartes.tech Global Privacy Team</div>
                    <div className="text-xs text-neutral-400 space-y-1">
                      <div>Email: <a href="mailto:privacy@chartes.tech" className="text-[#A67C3D] hover:underline">privacy@chartes.tech</a></div>
                      <div>Legal: <a href="mailto:legal@chartes.tech" className="text-[#A67C3D] hover:underline">legal@chartes.tech</a></div>
                      <div>Address: 100 Montgomery St, Suite 1200, San Francisco, CA 94104</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="text-sm font-medium text-white">Data Protection Officer (DPO)</div>
                    <div className="text-xs text-neutral-400 space-y-1">
                      <div>Attention: Data Protection Officer / Privacy Office</div>
                      <div>Inquiry Email: <a href="mailto:dpo@chartes.tech" className="text-[#A67C3D] hover:underline">dpo@chartes.tech</a></div>
                      <div>EU Representative: European Privacy Services Ltd, Dublin, Ireland</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-[#F3EBDD]/50">
                  <span>If you are located in the EU, you also retain the right to lodge a formal complaint with your local Data Protection Supervisory Authority.</span>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex items-center gap-1.5 text-[#A67C3D] hover:text-[#8f6b34] font-medium transition-colors"
                  >
                    <span>Back to Top</span>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#0D0D0D] text-[#A67C3D] border border-neutral-700 shadow-xl hover:scale-110 active:scale-95 transition-all"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
