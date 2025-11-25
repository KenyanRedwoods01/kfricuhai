import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/lib/stores';

export const metadata: Metadata = {
  title: 'Redwoods Portfolio',
  description: 'A MacOS-inspired portfolio showcasing projects and skills',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}