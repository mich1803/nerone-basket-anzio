import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageIntro } from '@/components/page-intro';
import { sportsData } from '@/lib/generated-data';
import { RosterGrid } from '@/components/roster-grid';

export const metadata: Metadata = { title: 'Roster' };
export const dynamic = 'force-static';

export default function RosterPage() {
  const rosterSeasons = [...new Set(sportsData.rosters.map((entry) => entry.season))]
    .sort((first, second) => second.localeCompare(first));
  const playersBySeason = Object.fromEntries(rosterSeasons.map((seasonId) => {
    const season = sportsData.seasons.find((item) => item.id === seasonId);
    const memberships = sportsData.rosters.filter((entry) => entry.season === seasonId && entry.active);
    const players = memberships.map((membership) => {
      const player = sportsData.players.find((item) => item.id === membership.player_id);
      if (!player) return null;
      const appearances = new Set((season?.competitions ?? []).flatMap((competition) => competition.playerStats
        .filter((stat) => stat.player_id === player.id)
        .map((stat) => `${competition.id}:${stat.game_id}`))).size;
      return { ...player, number: membership.number, appearances };
    }).filter((player): player is NonNullable<typeof player> => Boolean(player));
    return [seasonId, players];
  }));

  return (
    <main>
      <SiteHeader />
      <PageIntro eyebrow="Nerone Basket Anzio" title="Roster">
        <p>I giocatori delle squadre Amatori UISP Platinum e Gold.</p>
      </PageIntro>
      <section className="page-section roster-section">
        <p className="eyebrow dark">Conosci i giocatori</p>
        <RosterGrid playersBySeason={playersBySeason} seasons={rosterSeasons} initialSeason={sportsData.season} />
      </section>
      <SiteFooter />
    </main>
  );
}
