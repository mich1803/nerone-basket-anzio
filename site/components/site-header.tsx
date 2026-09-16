import Link from '@/components/site-link';
import { Menu } from 'lucide-react';
import { assetPath, sitePath } from '@/lib/paths';

const links = [
  { href: '/campionati', label: 'Campionati' },
  { href: '/partite/platinum', label: 'Partite' },
  { href: '/calendario', label: 'Calendario' },
  { href: '/roster', label: 'Roster' },
  { href: '/notizie', label: 'Notizie' },
  { href: '/club', label: 'Club' },
];

export function SiteHeader({ light = false }: { light?: boolean }) {
  return (
    <header className={`site-header ${light ? 'site-header-light' : ''}`}>
      <Link className="brand" href={sitePath('/')} aria-label="Nerone Basket Anzio — Home">
        <img
          src={assetPath(`/assets/${light ? 'logo-nero.png' : 'logo-bianco.png'}`)}
          alt=""
        />
        <span>Nerone Basket Anzio</span>
      </Link>
      <nav className="desktop-nav" aria-label="Navigazione principale">
        {links.map((link) => <Link href={sitePath(link.href)} key={link.href}>{link.label}</Link>)}
      </nav>
      <span className="season-chip">2026 / 27</span>
      <details className="mobile-menu">
        <summary aria-label="Apri il menu"><Menu size={22} /></summary>
        <nav aria-label="Navigazione mobile">
          {links.map((link) => <Link href={sitePath(link.href)} key={link.href}>{link.label}</Link>)}
        </nav>
      </details>
    </header>
  );
}
