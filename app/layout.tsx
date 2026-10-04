import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ResumeProvider } from "@/components/ResumeModal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { profile } from "@/content/profile";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.website),
  title: {
    default: `${profile.name} · ${profile.title}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <ResumeProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </ResumeProvider>
      </body>
    </html>
  );
}
