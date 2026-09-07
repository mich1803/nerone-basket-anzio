import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageIntro } from '@/components/page-intro';
import { sportsData } from '@/lib/generated-data';
import { RosterGrid } from '@/components/roster-grid';

export const metadata: Metadata = { title: 'Roster' };
export const dynamic = 'force-static';

export default function RosterPage() {
  const players = sportsData.players.map((player) => {
    const membership = sportsData.rosters.find((entry) => entry.player_id === player.id && entry.season === sportsData.season);
    const appearances = new Set(sportsData.competitions.flatMap((competition) => competition.playerStats
      .filter((stat) => stat.player_id === player.id)
      .map((stat) => `${competition.id}:${stat.game_id}`))).size;
    return { ...player, number: membership?.number ?? null, appearances };
  });

  return (
    <main>
      <SiteHeader />
      <PageIntro eyebrow="Nerone Basket Anzio" title="Roster 2026/27">
        <p>I giocatori delle squadre Amatori UISP Platinum e Gold.</p>
      </PageIntro>
      <section className="page-section roster-section">
        <p className="eyebrow dark">Conosci i giocatori</p>
        <RosterGrid players={players} />
      </section>
      <SiteFooter />
    </main>
  );
}
