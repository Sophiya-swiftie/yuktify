import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://yuktify.com"),
  title: "YUKTIFY | Premium AI-Powered Interview Preparation Platform",
  description: "Master Coding and Interview Preparation with AI-powered explanations, verified coding solutions, and company-wise interview questions.",
  keywords: ["interview prep", "SDE", "frontend", "backend", "coding interviews", "AI assistant", "YUKTIFY"],
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "YUKTIFY | Master Coding. Ace Interviews.",
    description: "Master Coding and Interview Preparation with AI-powered explanations, verified coding solutions, and company-wise interview questions.",
    url: "https://yuktify.com",
    siteName: "YUKTIFY",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YUKTIFY Branding Social Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YUKTIFY | Master Coding. Ace Interviews.",
    description: "Master Coding and Interview Preparation with AI-powered explanations, verified coding solutions, and company-wise interview questions.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground scrollbar-custom">
        <AuthProvider>
          {children}
          <AuthRequiredModal />
        </AuthProvider>
      </body>
    </html>
  );
}
