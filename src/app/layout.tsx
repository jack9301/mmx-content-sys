import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: { default: "Agubi Men's Health", template: "%s · Agubi Men's Health" },
  description: 'Evidence-based articles about prostate conditions, treatment, and recovery.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-[#fdfdfc] text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}