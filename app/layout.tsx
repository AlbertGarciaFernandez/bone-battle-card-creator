import React from 'react';
import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });

export const metadata: Metadata = {
  title: 'Bone Battle Creator',
  description: 'Create your Bone Battle TCG cards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${cinzel.variable}`}>
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased selection:bg-bone-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
