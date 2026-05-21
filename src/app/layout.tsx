import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YUKTIFY | AI-Powered Interview Preparation Platform",
  description: "Master your technical interviews with YUKTIFY. Company-wise questions, real-world solutions, and AI-powered assistance.",
  keywords: ["interview prep", "SDE", "frontend", "backend", "coding interviews", "AI assistant", "YUKTIFY"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground scrollbar-custom">
        {children}
      </body>
    </html>
  );
}
