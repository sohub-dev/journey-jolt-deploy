import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import { SiteHeader } from "@/components/Home/site-header";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JourneyJolt — An AI Travel Agent",
  description: "The best way to plan your next adventure.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-geist antialiased`}>
        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <SiteHeader />
            {/* <AuthButton /> */}
            {children}
          </NuqsAdapter>
        </Providers>
      </body>
    </html>
  );
}
