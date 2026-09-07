import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Nerone Basket Anzio',
    template: '%s · Nerone Basket Anzio',
  },
  description: 'Risultati, classifiche, calendario, roster e notizie del Nerone Basket Anzio.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body>{children}</body></html>;
}
