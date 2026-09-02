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
  FileText,
  Mail,
  AlertCircle
} from "lucide-react";

interface SectionItem {
  id: string;
  number: string;
  title: string;
}

const SECTIONS: SectionItem[] = [
  { id: "acceptance", number: "1", title: "Acceptance of Terms" },
  { id: "authority", number: "2", title: "User Authority" },
  { id: "services", number: "3", title: "Description of Services" },
  { id: "accounts", number: "4", title: "Accounts & Security" },
  { id: "user-content", number: "5", title: "User Content & License" },
  { id: "user-responsibility", number: "6", title: "User Responsibilities" },
  { id: "third-party-platforms", number: "7", title: "Third-Party Platforms & APIs" },
  { id: "ai-features", number: "8", title: "AI Features & Review Notice" },
  { id: "no-guarantee-results", number: "9", title: "No Guarantee of Results" },
  { id: "prohibited-use", number: "10", title: "Prohibited Conduct" },
  { id: "billing", number: "11", title: "Fees, Billing & Cancellation" },
  { id: "warranties", number: "12", title: "Disclaimer of Warranties" },
  { id: "liability", number: "13", title: "Limitation of Liability" },
  { id: "indemnity", number: "14", title: "Indemnification" },
  { id: "termination", number: "15", title: "Suspension & Termination" },
  { id: "force-majeure", number: "16", title: "Events Outside Control" },
  { id: "governing-law", number: "17", title: "Applicable Law & Disputes" },
  { id: "updates-contact", number: "18", title: "Changes & Contact" },
];

export default function TermsContent() {
  const [activeSection, setActiveSection] = useState("acceptance");
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
            <span className="text-xs font-medium text-neutral-900">Terms of Service</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="text-xs font-medium text-neutral-500 transition hover:text-neutral-900 hidden sm:inline"
            >
              Privacy Policy
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
            <FileText className="h-4 w-4" />
            <span>User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-3xl text-base text-neutral-600 leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website, applications, APIs, user dashboards, automated scheduling tools, and related software provided through chartes.tech (collectively, the &quot;Services&quot;). In these Terms, &quot;chartes.tech&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot; refers to chartes.tech and the operator of the Services.
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
              <span className="font-semibold text-neutral-700">Version:</span> 2.7.0
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
                  href="/privacy"
                  className="flex items-center justify-between text-xs text-neutral-600 hover:text-neutral-900 transition"
                >
                  <span>View Privacy Policy</span>
                  <ExternalLink className="h-3 w-3 text-neutral-400" />
                </Link>
                <a
                  href="mailto:legal@chartes.tech"
                  className="flex items-center justify-between text-xs text-neutral-600 hover:text-neutral-900 transition"
                >
                  <span>Contact Inquiries</span>
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
            <section id="acceptance" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                1. Acceptance of Terms & Eligibility
              </h2>
              <p>
                By creating an account, accessing, or using the Services, you agree to these Terms and our <Link href="/privacy" className="text-[#A67C3D] underline underline-offset-2">Privacy Policy</Link>. If you do not agree to these Terms, you must not access or use the Services.
              </p>
              <p>
                <strong>Eligibility:</strong> The Services are intended solely for adults who are at least 18 years of age (or the legal age of majority in your jurisdiction). By accessing the Services or registering an account, you represent and warrant that you meet this age requirement.
              </p>
              <p className="text-xs sm:text-sm text-neutral-500">
                Where the account registration flow presents an affirmative agreement option (such as a confirmation checkbox), checking that box constitutes your express agreement to these Terms and the Privacy Policy.
              </p>
            </section>

            {/* Section 2 */}
            <section id="authority" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                2. User Authority & Organization Use
              </h2>
              <p>
                If you use the Services on behalf of a business, organization, agency, or other entity, you represent and warrant that you have authority to accept these Terms on its behalf.
              </p>
              <p>
                In that case, &quot;you&quot; and &quot;your&quot; refers to that entity, and that entity agrees to be responsible for compliance with these Terms by all authorized users, employees, or collaborators accessing the Services through its account.
              </p>
            </section>

            {/* Section 3 */}
            <section id="services" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                3. Description of Services & Modifications
              </h2>
              <p>
                chartes.tech provides web-based software tools for content creation, scheduling, publishing automation, performance metrics tracking, and AI-assisted drafting across supported third-party social media platforms.
              </p>
              <p>
                We may modify, suspend, restrict, or discontinue features or portions of the Services at any time, including where necessary for security, maintenance, legal compliance, or changes in third-party services. We do not promise that every feature or functionality currently offered will remain permanently available.
              </p>
            </section>

            {/* Section 4 */}
            <section id="accounts" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                4. User Accounts & Account Security
              </h2>
              <p>
                To use most features of the Services, you must register for an account by providing accurate, current, and complete registration information. You agree to maintain the confidentiality of your account credentials, login credentials, and session tokens.
              </p>
              <p>
                You are responsible for all activities that occur under your account. You agree to notify chartes.tech immediately at <a href="mailto:support@chartes.tech" className="text-[#A67C3D] underline">support@chartes.tech</a> if you discover or suspect any unauthorized access to or security breach of your account.
              </p>
            </section>

            {/* Section 5 */}
            <section id="user-content" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                5. User Content & Limited License
              </h2>
              <p>
                <strong>Ownership:</strong> As between you and chartes.tech, you retain full ownership and all intellectual property rights in and to the text, images, video reels, audio files, graphics, and brand assets that you upload, compose, or submit through the Services (&quot;User Content&quot;). chartes.tech does not claim ownership of your User Content.
              </p>
              <p>
                <strong>Limited License to Operate the Services:</strong> You grant chartes.tech a non-exclusive, worldwide, royalty-free license to host, store, reproduce, process, transmit, and display your User Content only as reasonably necessary to operate, maintain, secure, and provide the Services on your behalf.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                This license does not grant chartes.tech the right to sell your content or use it for independent commercial advertising without your separate, explicit permission.
              </p>
            </section>

            {/* Section 6 */}
            <section id="user-responsibility" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                6. User Responsibilities & Content Publishing
              </h2>
              <p>
                You are responsible for the content, information, media, and materials that you submit to or publish through the Services and for ensuring that you have all rights, permissions, consents, and authorizations necessary to use and publish them.
              </p>
              <p>
                You are responsible for ensuring that your use of the Services and published content complies with applicable law and the rules and policies of the third-party platforms you connect.
              </p>
              <p>
                <strong>Reviewing Scheduled Content:</strong> You are responsible for reviewing scheduled content before publication and for ensuring that content is appropriate, lawful, and authorized. Chartes does not guarantee that content will be published at a particular time where publication depends on third-party platforms, APIs, network availability, or other factors outside our reasonable control.
              </p>
            </section>

            {/* Section 7 */}
            <section id="third-party-platforms" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                7. Third-Party Platforms & APIs
              </h2>
              <p>
                Our Services allow you to connect authorized social media accounts through official developer APIs (such as Meta Graph APIs for Instagram and Facebook, Google API Services and YouTube APIs, and LinkedIn Developer APIs).
              </p>
              <p>
                <strong>Independent Platforms:</strong> Third-party platforms are independent services. Their availability, policies, algorithms, APIs, account restrictions, content moderation, and decisions are outside our control.
              </p>
              <p>
                chartes.tech does not guarantee:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-neutral-600">
                <li>Continued, uninterrupted API access to any external platform;</li>
                <li>Account verification or approval by third-party platforms;</li>
                <li>Post reach, follower growth, engagement rates, or algorithm performance;</li>
                <li>Platform uptime or continuous third-party availability;</li>
                <li>The absence of third-party account suspensions or content removals.</li>
              </ul>
              <p className="text-xs sm:text-sm text-neutral-600">
                You agree to comply with all applicable third-party platform terms and developer policies (including the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-[#A67C3D] underline">Google API Services User Data Policy</a>, including Limited Use requirements, Meta Platform Terms, and LinkedIn Developer Terms). You may disconnect your social accounts at any time via your dashboard settings.
              </p>
            </section>

            {/* Section 8 */}
            <section id="ai-features" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                8. AI Features & Review Notice
              </h2>
              <p>
                chartes.tech offers artificial intelligence features to assist you with generating post captions, suggesting hashtags, and drafting content concepts.
              </p>
              <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50/50 p-4 text-xs sm:text-sm text-amber-900 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Important Notice on AI Output & User Verification</span>
                </div>
                <p>
                  AI outputs are generated algorithmically and may be inaccurate, incomplete, inappropriate, or unintended. You must review output before relying on or publishing it, and you are solely responsible for deciding whether to publish AI-generated material.
                </p>
                <p>
                  chartes.tech does not guarantee that AI-generated outputs are accurate, original, legally compliant, free of copyright infringement, commercially successful, or approved by any platform.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="no-guarantee-results" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                9. No Guarantee of Marketing Results
              </h2>
              <p>
                chartes.tech provides content automation and scheduling software tools. Because social media outcomes depend on numerous external variables outside our control (including user content quality, audience behavior, and platform algorithms), chartes.tech does not warrant or guarantee:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-neutral-600">
                <li>Follower growth, audience expansion, or account reach;</li>
                <li>Impressions, likes, comments, shares, or engagement metrics;</li>
                <li>Sales revenue, business leads, customer conversions, or virality;</li>
                <li>Advertising efficiency or commercial return on investment;</li>
                <li>Platform approval, account verification, or specific business results.</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section id="prohibited-use" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                10. Prohibited Activities & Acceptable Use
              </h2>
              <p>You agree not to use the Services to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-600">
                <li>Engage in or promote unlawful, fraudulent, deceptive, or defamatory activity;</li>
                <li>Distribute unsolicited communications, bulk spam, or misleading marketing schemes;</li>
                <li>Infringe, misappropriate, or violate any third-party intellectual property, privacy, publicity, or contractual rights;</li>
                <li>Bypass, circumvent, or disable API rate limits, authentication tokens, or security controls;</li>
                <li>Interfere with, disrupt, or place an unreasonable technical burden on the Services or connected infrastructure;</li>
                <li>Reverse engineer, decompile, disassemble, or extract underlying source code from our software;</li>
                <li>Access or scrape the Services through automated bots or scripts without express authorization;</li>
                <li>Violate the policies, community standards, or developer terms of any connected third-party social media platform.</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section id="billing" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                11. Fees, Billing & Cancellation
              </h2>
              <p>
                Certain features of chartes.tech require a paid subscription. Subscription fees are billed in advance on a recurring monthly or annual basis as specified at the time of purchase.
              </p>
              <p>
                <strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings. Upon cancellation, your subscription will remain active until the end of the current paid billing cycle, and you will not be billed for subsequent cycles.
              </p>
              <p>
                <strong>Refund Policy:</strong> Except where required by applicable law or expressly stated at the time of purchase, fees are non-refundable once charged.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                <strong>Third-Party Payment Processors:</strong> Payment processing is handled by external third-party payment providers (such as Stripe). You agree to provide valid payment details and authorize recurring charges. chartes.tech does not store raw payment card numbers on its servers.
              </p>
            </section>

            {/* Section 12 */}
            <section id="warranties" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                12. Disclaimer of Warranties
              </h2>
              <p className="uppercase text-xs sm:text-sm font-medium text-neutral-600 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                CHARTES.TECH EXPRESSLY DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, TIMELY, OR ERROR-FREE, OR THAT ANY DEFECTS WILL BE CORRECTED.
              </p>
            </section>

            {/* Section 13 */}
            <section id="liability" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                13. Limitation of Liability
              </h2>
              <p className="uppercase text-xs sm:text-sm font-medium text-neutral-600 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CHARTES.TECH, ITS OPERATORS, CONTRIBUTORS, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES, OR FOR LOSS OF PROFITS, REVENUE, BUSINESS, GOODWILL, DATA, OR ANTICIPATED SAVINGS, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICES.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE GREATER OF (A) THE TOTAL AMOUNT PAID BY YOU TO CHARTES.TECH FOR THE SERVICES IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY, OR (B) FIFTY UNITED STATES DOLLARS ($50.00).
              </p>
              <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4 text-xs sm:text-sm text-neutral-700">
                <strong className="font-semibold text-neutral-900">Mandatory Rights Savings Clause:</strong> Nothing in these Terms limits or excludes liability or rights that cannot lawfully be limited or excluded under applicable law. Some jurisdictions do not permit the exclusion of certain warranties or limitations on certain liabilities; in such jurisdictions, liability is limited to the maximum extent permitted by law.
              </div>
            </section>

            {/* Section 14 */}
            <section id="indemnity" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                14. Indemnification
              </h2>
              <p>
                To the maximum extent permitted by applicable law, you agree to defend, indemnify, and hold harmless chartes.tech, its operators, contributors, and agents from and against any third-party claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or relating to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-600">
                <li>Your User Content or content published through your account;</li>
                <li>Your unlawful use of or interaction with the Services;</li>
                <li>Your violation of these Terms;</li>
                <li>Your infringement or violation of any third-party intellectual property, privacy, publicity, or other rights.</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section id="termination" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                15. Suspension & Termination
              </h2>
              <p>
                You may stop using the Services and close your account at any time via your account settings.
              </p>
              <p>
                chartes.tech reserves the right to suspend or terminate your account or access to the Services in the event of:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-neutral-600">
                <li>Material breach of these Terms or acceptable use policies;</li>
                <li>Fraudulent, abusive, or harmful activity;</li>
                <li>Security threats to the platform, other users, or third parties;</li>
                <li>Violation of third-party platform developer requirements;</li>
                <li>Compliance with statutory or regulatory requirements.</li>
              </ul>
              <p>
                We may also suspend access where reasonably necessary to protect the Services, users, or third parties. Upon termination, provisions that by their nature should survive (including intellectual property, disclaimers, limitations of liability, indemnification, and dispute terms) shall survive.
              </p>
            </section>

            {/* Section 16 */}
            <section id="force-majeure" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                16. Events Outside Reasonable Control (Force Majeure)
              </h2>
              <p>
                chartes.tech shall not be held liable for any delay or failure in performance resulting directly or indirectly from causes beyond our reasonable control, including internet service failures, cloud hosting outages, third-party social media platform outages or API modifications, power failures, cybersecurity incidents, strikes, labor disputes, natural disasters, acts of civil or military authorities, or government actions.
              </p>
            </section>

            {/* Section 17 */}
            <section id="governing-law" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                17. Applicable Law, Disputes & Consumer Protections
              </h2>
              <p>
                These Terms are subject to applicable law. Nothing in these Terms prevents a user from exercising rights or pursuing remedies that cannot legally be excluded or restricted.
              </p>
              <p>
                <strong>Consumer Rights:</strong> Nothing in these Terms is intended to exclude, restrict, or waive consumer rights or other protections that cannot lawfully be excluded or waived under applicable law.
              </p>
              <p>
                <strong>Informal Dispute Resolution:</strong> Before initiating formal legal proceedings, the parties may attempt in good faith to resolve disputes by contacting chartes.tech through the contact information provided below.
              </p>
            </section>

            {/* Section 18 */}
            <section id="updates-contact" className="scroll-mt-24 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                  18. Changes to These Terms & Contact Information
                </h2>
                <h3 className="text-base font-semibold text-neutral-900">18.1 Changes to Terms</h3>
                <p>
                  We may revise these Terms of Service from time to time as our Services develop, operational needs change, or legal requirements evolve. When changes occur, we will update the &quot;Effective Date&quot; and &quot;Last Updated&quot; dates at the top of this document.
                </p>
                <p>
                  If we make material changes, we will provide notice through appropriate channels (such as via an in-app notice or email) where required by applicable law. Changes will not affect rights or obligations that cannot legally be modified without additional notice or consent.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-base font-semibold text-neutral-900">18.2 chartes.tech Contact</h3>
                <p>
                  If you have questions, feedback, or inquiries regarding these Terms of Service, please contact our team:
                </p>
                <div className="rounded-lg border border-neutral-200 p-4 bg-neutral-50/50 space-y-1.5 text-xs sm:text-sm">
                  <div className="font-semibold text-neutral-900">chartes.tech Contact</div>
                  <div className="text-neutral-600">
                    Terms & Legal Inquiries: <a href="mailto:legal@chartes.tech" className="text-[#A67C3D] underline">legal@chartes.tech</a>
                  </div>
                  <div className="text-neutral-600">
                    General Support: <a href="mailto:support@chartes.tech" className="text-[#A67C3D] underline">support@chartes.tech</a>
                  </div>
                  <div className="text-neutral-600">
                    Privacy Inquiries: <a href="mailto:privacy@chartes.tech" className="text-[#A67C3D] underline">privacy@chartes.tech</a>
                  </div>
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
