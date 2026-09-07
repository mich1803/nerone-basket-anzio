import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { sportsData } from '@/lib/generated-data';
import { assetPath, instagramUrl } from '@/lib/paths';
import { PlayerStats } from '@/components/player-stats';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return sportsData.players.map((player) => ({ id: player.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: sportsData.players.find((player) => player.id === id)?.name ?? 'Giocatore' };
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = sportsData.players.find((item) => item.id === id);
  if (!player) notFound();
  const membership = sportsData.rosters.find((entry) => entry.player_id === id && entry.season === sportsData.season);
  const stats = sportsData.competitions.flatMap((competition) => competition.playerStats.filter((stat) => stat.player_id === id));
  const totals = stats.reduce((sum, stat) => {
    const [minutes = 0, seconds = 0] = stat.minutes.split(':').map(Number);
    return {
      games: sum.games + 1,
      minutes: sum.minutes + (Number.isFinite(minutes) ? minutes * 60 + (seconds || 0) : 0),
      points: sum.points + stat.points,
      threePointersMade: sum.threePointersMade + stat.three_pointers_made,
      twoPointersMade: sum.twoPointersMade + stat.two_pointers_made,
      freeThrowsMade: sum.freeThrowsMade + stat.free_throws_made,
      fouls: sum.fouls + stat.fouls,
      reboundsOff: sum.reboundsOff + stat.rebounds_off,
      reboundsDef: sum.reboundsDef + stat.rebounds_def,
      assists: sum.assists + stat.assists,
      turnovers: sum.turnovers + stat.turnovers,
    };
  }, { games: 0, minutes: 0, points: 0, threePointersMade: 0, twoPointersMade: 0, freeThrowsMade: 0, fouls: 0, reboundsOff: 0, reboundsDef: 0, assists: 0, turnovers: 0 });
  const rows = [{ season: sportsData.season, ...totals }];

  return <main>
    <SiteHeader />
    <section className="player-hero">
      <div className="player-hero-copy"><p className="eyebrow">Roster 2026/27</p><span className="profile-number">{membership?.number ?? '—'}</span><h1>{player.name}</h1><p>{membership?.role || 'Giocatore'}</p></div>
      <figure><img src={assetPath(player.photo || '/assets/logo-bianco.png')} alt={player.name} /></figure>
    </section>
    <section className="page-section player-content">
      <article><p className="eyebrow dark">Profilo</p><h2>Bio</h2><p className="player-bio">{player.bio}</p>{player.instagram && <a className="button button-dark" href={instagramUrl(player.instagram)} target="_blank" rel="noreferrer">Instagram <ExternalLink size={16} /></a>}</article>
      <aside><p className="eyebrow dark">Rendimento</p><h2>Statistiche</h2>
        <PlayerStats rows={rows} />
      </aside>
    </section>
    <SiteFooter />
  </main>;
}
