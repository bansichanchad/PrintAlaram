import './globals.css';
import { Suspense } from 'react';
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google';
import { Toaster } from 'sonner';
import NavigationProgress from '@/components/site/NavigationProgress';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-serif', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata = {
  title: 'Printalaram — Premium Customized Shagun Lifafa & Wedding Money Covers',
  description: 'Personalize luxurious Indian wedding Shagun Lifafa with your names, wedding date, photo & blessings. Hand-crafted, delivered across India. Shop at printalaram.in',
  keywords: 'shagun lifafa, shagun envelope, wedding money cover, customized shagun lifafa, indian wedding shagun, personalized money cover, printalaram, printalaram.in',
  metadataBase: new URL('https://printalaram.in'),
  alternates: { canonical: 'https://printalaram.in' },
  openGraph: {
    title: 'Printalaram — Premium Customized Shagun Lifafa',
    description: 'Personalize luxurious Indian wedding Shagun Lifafa. Hand-crafted, delivered across India.',
    url: 'https://printalaram.in',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Printalaram',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Printalaram Logo' }],
  },
  twitter: { card: 'summary_large_image', title: 'Printalaram — Premium Shagun Lifafa', images: ['/logo.png'] },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans bg-[#fdfaf3] text-[#2a1a1a] antialiased">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
