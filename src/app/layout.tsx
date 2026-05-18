import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Workspace Designer — monis.rent',
  description: 'Design your dream Bali workspace and rent it — desks, chairs, monitors, lamps, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full font-[var(--font-inter)] bg-[#F7F2EA] text-[#1A1510] antialiased">
        {children}
      </body>
    </html>
  );
}
