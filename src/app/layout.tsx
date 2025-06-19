// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

const ibmPlexSans = localFont({
  src: [
    {
      path: './ibm-regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './ibm-medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './ibm-semibold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-ibm',
});

const sfPro = localFont({
  src: [
    {
      path: './sfpro-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './sfpro-medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './sfpro-semibold.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-sf',
});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Everflow",
  description: "Assignment from ToolJet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${sfPro.variable} ${inter.variable}`}>
      <body className="bg-neutral-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
