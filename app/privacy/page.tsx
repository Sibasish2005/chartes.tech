import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | chartes.tech - AI Social Media & Brand Automation",
  description: "Learn how chartes.tech collects, uses, encrypts, and protects your personal data, connected social media accounts, and AI automation workflows in compliance with GDPR, CCPA, and global standards.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
