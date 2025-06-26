import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SessionProvider } from "@/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Protein Revolution - Premium Protein Supplements",
  description: "Premium quality protein supplements for your fitness journey. Shop whey protein, mass gainers, and more.",
  keywords: "protein, supplements, whey protein, mass gainer, fitness, bodybuilding",
  openGraph: {
    title: "The Protein Revolution",
    description: "Premium quality protein supplements for your fitness journey",
    url: "https://theproteinrevolution.com",
    siteName: "The Protein Revolution",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Protein Revolution",
    description: "Premium quality protein supplements for your fitness journey",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
