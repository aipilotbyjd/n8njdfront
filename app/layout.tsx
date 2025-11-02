import type { Metadata } from "next";
import { Spline_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/lib/toast';
import { ErrorBoundary } from './components/ErrorBoundary';

const splineSans = Spline_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-spline",
});

export const metadata: Metadata = {
  title: "Automation Inc. - Workflow Automation Platform",
  description: "Build, automate, and scale your workflows with our powerful automation platform. Connect apps, automate tasks, and boost productivity.",
  keywords: ['workflow automation', 'n8n', 'automation platform', 'workflow builder', 'api integration'],
  authors: [{ name: 'Automation Inc.' }],
  openGraph: {
    title: 'Automation Inc. - Workflow Automation Platform',
    description: 'Build, automate, and scale your workflows',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className={`${splineSans.variable} antialiased`}>
        <ErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
