import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ToastProvider } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://codediffs.vercel.app"
  ),
  title: {
    default: "CodeDiff Pro | Professional Online Code & File Difference Checker",
    template: "%s | CodeDiff Pro"
  },
  description:
    "Compare code snippets, JSON files, and full-text documents side-by-side (split) or inline (unified). Engineered with Monaco Editor syntax highlighting, complete client-side privacy sandboxing, dynamic Google Translate localization, and instant patch generation.",
  applicationName: "CodeDiff Pro",
  keywords: [
    "code diff checker",
    "online difference checker",
    "file comparison tool",
    "monaco diff editor online",
    "side-by-side code compare",
    "inline git diff online",
    "compare files online",
    "text comparison tool",
    "secure local diff check",
    "json diff tool web",
    "code difference viewer",
    "developer difference tools",
    "google translate code diff",
    "regional language code editor",
    "nextjs diff checker",
    "react monaco code comparison",
    "lzw text compression",
    "redis share comparison code",
    "privacy-focused diff editor",
    "visual diff copy patch",
    "clean git patch copy",
    "original vs modified text compare",
    "best online file diff",
    "multilingual developer tools"
  ],
  authors: [{ name: "CodeDiff Pro", url: "https://codediffs.vercel.app" }],
  creator: "Jay Tailor",
  publisher: "Jay Tailor",
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    title: "CodeDiff Pro | Professional Online Code Difference Checker",
    description:
      "High-fidelity side-by-side & inline code and file difference viewer. Features sandboxed security, dynamic Monaco Editor canvas, 50+ languages translation, and instant share links.",
    url: "https://codediffs.vercel.app",
    siteName: "CodeDiff Pro",
    type: "website",
    locale: "en_US"
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#111318" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
