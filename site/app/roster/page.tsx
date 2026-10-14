import type { Metadata } from 'next';
import Link from '@/components/site-link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageIntro } from '@/components/page-intro';
import { clubTeams } from '@/lib/site-data';
import { sitePath } from '@/lib/paths';

export const metadata: Metadata = { title: 'Roster' };
export const dynamic = 'force-static';

export default function RosterPage() {
  return (
    <main>
      <SiteHeader />
      <PageIntro eyebrow="Nerone Basket Anzio" title="Roster">
        <p>Due squadre, due gruppi distinti. Scegli il roster da consultare.</p>
      </PageIntro>
      <section className="page-section competition-chooser roster-chooser">
        {clubTeams.map((team, index) => (
          <Link href={sitePath(`/roster/${team.id}`)} className="league-panel" key={team.id}>
            <span className="league-number">0{index + 1}</span>
            <span className="league-code">{team.code}</span>
            <div>
              <p>Amatori UISP · 2026/27</p>
              <h2>{team.name}</h2>
            </div>
            <span className="league-link">Apri il roster <ArrowRight size={18} /></span>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
