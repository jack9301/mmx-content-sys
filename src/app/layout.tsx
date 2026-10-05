import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
  OG_IMAGE_URL,
  KEYWORDS_BASE,
  OG_IMAGE_SPEC,
} from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: [...KEYWORDS_BASE],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [OG_IMAGE_SPEC],
  },

  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [OG_IMAGE_URL],
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/en/`,
      zh: `${SITE_URL}/zh/`,
      ja: `${SITE_URL}/ja/`,
      'x-default': `${SITE_URL}/en/`,
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  category: 'health',
  classification: 'Health & Medical',
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