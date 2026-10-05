import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });

const SITE_URL = 'https://mmx-content-sys02.pages.dev';
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const LOGO = `${SITE_URL}/favicon.png`;

export const metadata: Metadata = {
  title: { default: "Agubi Men's Health", template: "%s · Agubi Men's Health" },
  description: 'Evidence-based articles about prostate conditions, treatment, and recovery.',
  keywords: ['prostate health', "men's health", 'prostatitis', 'BPH', 'prostate cancer', 'urology'],
  authors: [{ name: "Agubi Men's Health" }],
  creator: "Agubi Men's Health",
  metadataBase: new URL(SITE_URL),

  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: "Agubi Men's Health",
    title: "Agubi Men's Health",
    description: 'Evidence-based care for prostate health.',
    images: [
      {
        url: OG_IMAGE,
        width: 1376,
        height: 768,
        alt: "Agubi Men's Health — evidence-based care for prostate health",
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: "Agubi Men's Health",
    description: 'Evidence-based care for prostate health.',
    images: [OG_IMAGE],
  },

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1376" />
        <meta property="og:image:height" content="768" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={OG_IMAGE} />
      </head>
      <body className="min-h-screen bg-[#fdfdfc] text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}