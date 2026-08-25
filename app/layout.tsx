import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import StoreProvider from "./StoreProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Chartes | Social Media Management & Brand Growth",
  description:
    "Transforming brand presence into high-converting social narratives, viral campaigns, and organic community growth.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${plusJakartaSans.className} h-full antialiased`}
    >
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col font-sans`}>
        <StoreProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
