import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "../context/authcontext";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doctors Appointment App",
  description: "Connect with doctors anytime, anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ✅ AuthProvider wraps everything */}
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>

          <Toaster richColors />

          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>ALL RIGHTS RESERVED BY MEDICARE</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
