import type { Metadata } from "next";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service | chartes.tech - AI Social Media & Brand Automation",
  description: "Read the Terms and Conditions of Service governing your use of chartes.tech platform, social media integrations, and AI automation tools.",
};

export default function TermsPage() {
  return <TermsContent />;
}
