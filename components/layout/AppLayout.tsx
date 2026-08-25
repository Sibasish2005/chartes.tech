import { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import AppSidebar from "./AppSidebar";

const fontSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

interface AppLayoutProps {
  children: ReactNode;
  userEmail?: string;
  userName?: string;
}

export default function AppLayout({
  children,
  userEmail,
  userName,
}: AppLayoutProps) {
  return (
    <div
      className={`min-h-screen bg-[#F8F6F2] flex flex-col lg:flex-row text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900 ${fontSans.className}`}
    >
      {/* Sidebar Navigation */}
      <AppSidebar userEmail={userEmail} userName={userName} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
