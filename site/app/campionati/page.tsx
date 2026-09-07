import Link from '@/components/site-link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageIntro } from '@/components/page-intro';
import { competitions } from '@/lib/site-data';
import { sitePath } from '@/lib/paths';

export const dynamic = 'force-static';

export default function CompetitionsPage() {
  return (
    <main>
      <SiteHeader />
      <PageIntro eyebrow="Stagione 2026/27" title="Campionati">
        <p>Due squadre Nerone, due classifiche separate. Scegli il campionato da seguire.</p>
      </PageIntro>
      <section className="page-section competition-chooser">
        {competitions.map((competition, index) => (
          <Link href={sitePath(`/campionati/${competition.slug}`)} className="league-panel" key={competition.slug}>
            <span className="league-number">0{index + 1}</span>
            <span className="league-code">{competition.code}</span>
            <div>
              <p>Nerone Basket Anzio</p>
              <h2>{competition.name}</h2>
            </div>
            <span className="league-link">Apri campionato <ArrowRight size={18} /></span>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
