import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Talkie",
    template: "%s · Talkie",
  },
  description: "A private line for your favorite people.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <Script
          id="talkie-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />

        <ThemeProvider>
          <header className="border-b border-border bg-surface">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
              <Link
                href="/"
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                Talkie
              </Link>

              <Navigation />
            </div>
          </header>

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
