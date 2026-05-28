import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ToastProvider } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "CodeDiff Pro | Professional Code Difference Checker",
    template: "%s | CodeDiff Pro"
  },
  description:
    "Compare code snippets and uploaded files with Monaco-powered syntax highlighting, GitHub-style diffs, export tools, and a polished developer workflow.",
  applicationName: "CodeDiff Pro",
  keywords: [
    "code diff",
    "file compare",
    "diff checker",
    "developer tools",
    "Monaco editor"
  ],
  authors: [{ name: "CodeDiff Pro" }],
  openGraph: {
    title: "CodeDiff Pro",
    description:
      "A professional code and file difference checker for developers.",
    url: "/",
    siteName: "CodeDiff Pro",
    type: "website"
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
