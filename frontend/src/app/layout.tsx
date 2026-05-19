import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Ecosystem | Team Task Manager",
  description: "A highly refined workspace management terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body
        className={`${inter.variable} font-sans min-h-screen bg-[#FAFAFA] text-[#111111]`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
