import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays, MapPin } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { sportsData } from '@/lib/generated-data';
import { assetPath } from '@/lib/paths';
import { GamesPageView } from '@/components/games-page-view';
import { getArchiveCompetitionIds, getLatestSeasonForCompetition } from '@/lib/archive-data';
import { getCompetition } from '@/lib/site-data';
import { SocialEmbeds } from '@/components/social-embeds';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const dynamic = 'force-static';
export const dynamicParams = false;

const neroneGames = sportsData.seasons.flatMap((season) => season.competitions.flatMap((competition) => competition.games.map((game) => ({ season, competition, game })))).filter(({ game }) => game.home_team === 'nerone' || game.away_team === 'nerone');
const monthNames = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

function formatGameDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

export function generateStaticParams() {
  return [...neroneGames.map(({ game }) => game.id), ...getArchiveCompetitionIds()].map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const found = neroneGames.find(({ game }) => game.id === id);
  if (!found) {
    const competition = getCompetition(id);
    const season = getLatestSeasonForCompetition(id);
    return { title: competition && season ? `Partite ${competition.shortName} ${season.id.replace('-', '/')}` : 'Partita' };
  }
  return { title: `${sportsData.teams[found.game.home_team]?.short_name ?? found.game.home_team} – ${sportsData.teams[found.game.away_team]?.short_name ?? found.game.away_team}` };
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = neroneGames.find(({ game }) => game.id === id);
  if (!found) {
    const competition = getCompetition(id);
    const season = getLatestSeasonForCompetition(id);
    if (!competition || !season) notFound();
    return <GamesPageView competition={competition} seasonId={season.id} />;
  }
  const { game, competition, season } = found;
  const stats = competition.playerStats.filter((stat) => stat.game_id === game.id);
  const home = sportsData.teams[game.home_team];
  const away = sportsData.teams[game.away_team];
  const homeLogo = game.home_team === 'nerone' ? '/assets/logo-bianco.png' : home?.logo || '/assets/logo-bianco.png';
  const awayLogo = game.away_team === 'nerone' ? '/assets/logo-bianco.png' : away?.logo || '/assets/logo-bianco.png';

  return <main>
    <SiteHeader />
    <section className="game-hero">
      <p className="eyebrow">{competition.name} · {season.id.replace('-', '/')}{game.round ? ` · ${game.round}` : ''}</p>
      <h1 className="game-matchup-title">{home?.short_name ?? game.home_team} <span>vs</span> {away?.short_name ?? game.away_team}</h1>
      <div className="scoreboard">
        <div><img src={assetPath(homeLogo)} alt={home?.short_name ?? game.home_team} /></div>
        <strong>{game.home_score ?? '–'}<span>:</span>{game.away_score ?? '–'}</strong>
        <div><img src={assetPath(awayLogo)} alt={away?.short_name ?? game.away_team} /></div>
      </div>
      <div className="game-meta">
        <span><CalendarDays size={17} /> {game.date ? `${formatGameDate(game.date)}${game.time ? ` · ${game.time}` : ''}` : 'Data non disponibile'}</span>
        {game.address ? <a className="game-map-link" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(game.address)}`} target="_blank" rel="noreferrer"><MapPin size={17} /> {[game.venue, game.address].filter(Boolean).join(' · ')}</a> : <span><MapPin size={17} /> {game.venue || 'Luogo non disponibile'}</span>}
        {game.notes && <span>{game.notes}</span>}
      </div>
    </section>
    <section className="page-section boxscore"><p className="eyebrow dark">Nerone Basket Anzio</p><h2>Tabellino</h2>
      {stats.length ? <Table className="boxscore-table"><TableHeader><TableRow><TableHead>Giocatore</TableHead><TableHead>MIN</TableHead><TableHead>PT</TableHead><TableHead title="Tiri da 3 realizzati">T3</TableHead><TableHead title="Tiri da 2 realizzati">T2</TableHead><TableHead title="Tiri liberi realizzati">TL</TableHead><TableHead>F</TableHead><TableHead>RO</TableHead><TableHead>RD</TableHead><TableHead>AST</TableHead><TableHead>PP</TableHead></TableRow></TableHeader><TableBody>{stats.map((stat) => <TableRow key={stat.player_id}><TableCell><strong>{sportsData.players.find((player) => player.id === stat.player_id)?.name ?? stat.player_id}</strong></TableCell><TableCell>{stat.minutes}</TableCell><TableCell>{stat.points}</TableCell><TableCell>{stat.three_pointers_made}</TableCell><TableCell>{stat.two_pointers_made}</TableCell><TableCell>{stat.free_throws_made}</TableCell><TableCell>{stat.fouls}</TableCell><TableCell>{stat.rebounds_off}</TableCell><TableCell>{stat.rebounds_def}</TableCell><TableCell>{stat.assists}</TableCell><TableCell>{stat.turnovers}</TableCell></TableRow>)}</TableBody></Table> : <p className="stats-empty">{game.status === 'final' ? 'Statistiche individuali non disponibili per questa partita.' : 'Il tabellino verrà pubblicato dopo la partita.'}</p>}
      <SocialEmbeds posts={game.social_urls} title="Dalla partita" />
    </section>
    <SiteFooter />
  </main>;
}
