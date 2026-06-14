import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'ShopEasy | Premium Kenyan E-Commerce',
  description: 'Shop premium fashion, electronics, and accessories. Fast deliveries and secure checkout via M-Pesa STK Push.',
  keywords: ['Kenya', 'E-commerce', 'M-Pesa', 'Daraja API', 'Online Shopping', 'Nairobi'],
  authors: [{ name: 'ShopEasy Team' }],
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
