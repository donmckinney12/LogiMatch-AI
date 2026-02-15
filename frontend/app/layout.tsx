import type { Metadata } from "next";
import { Source_Sans_3, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { OrgProvider } from "@/context/org-context";
import { SubscriptionProvider } from "@/context/subscription-context";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "LogiMatch AI",
  description: "Freight Quote Normalization & Comparison",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <OrgProvider>
        <SubscriptionProvider>
          <html lang="en" suppressHydrationWarning>
            <body
              className={`${inter.variable} ${sourceSans.variable} font-body antialiased`}
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
              </ThemeProvider>
            </body>
          </html>
        </SubscriptionProvider>
      </OrgProvider>
    </ClerkProvider>
  );
}
