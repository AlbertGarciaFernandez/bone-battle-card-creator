import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
        <html lang="en">
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet" />
                <script dangerouslySetInnerHTML={{
                    __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    bone: {
                      50: '#f9f9f7',
                      100: '#f1f0ea',
                      200: '#e1dfd2',
                      300: '#c9c6b0',
                      400: '#ada88b',
                      500: '#948e6d',
                      600: '#767154',
                      700: '#5f5b45',
                      800: '#4e4b3b',
                      900: '#403d32',
                    },
                    rarity: {
                      common: '#94a3b8',
                      rare: '#3b82f6',
                      epic: '#a855f7',
                      legendary: '#eab308'
                    }
                  },
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    display: ['Cinzel', 'serif'],
                  }
                }
              }
            }
          `
                }} />
            </head>
            <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased selection:bg-bone-500 selection:text-white`}>
                {children}
            </body>
        </html>
    );
}
