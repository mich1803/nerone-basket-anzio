import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays, ExternalLink, MapPin } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { sportsData } from '@/lib/generated-data';
import { assetPath } from '@/lib/paths';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const dynamic = 'force-static';
export const dynamicParams = false;

const neroneGames = sportsData.competitions.flatMap((competition) => competition.games.map((game) => ({ competition, game }))).filter(({ game }) => game.home_team === 'nerone' || game.away_team === 'nerone');

export function generateStaticParams() { return neroneGames.map(({ game }) => ({ id: game.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const found = neroneGames.find(({ game }) => game.id === id);
  if (!found) return { title: 'Partita' };
  return { title: `${sportsData.teams[found.game.home_team]?.short_name ?? found.game.home_team} – ${sportsData.teams[found.game.away_team]?.short_name ?? found.game.away_team}` };
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = neroneGames.find(({ game }) => game.id === id);
  if (!found) notFound();
  const { game, competition } = found;
  const stats = competition.playerStats.filter((stat) => stat.game_id === game.id);
  const home = sportsData.teams[game.home_team];
  const away = sportsData.teams[game.away_team];

  return <main>
    <SiteHeader />
    <section className="game-hero">
      <p className="eyebrow">{competition.name} · {sportsData.season.replace('-', '/')}</p>
      <div className="scoreboard">
        <div><img src={assetPath(home?.logo || '/assets/logo-bianco.png')} alt="" /><h1>{home?.short_name ?? game.home_team}</h1></div>
        <strong>{game.home_score ?? '–'}<span>:</span>{game.away_score ?? '–'}</strong>
        <div><img src={assetPath(away?.logo || '/assets/logo-bianco.png')} alt="" /><h1>{away?.short_name ?? game.away_team}</h1></div>
      </div>
      <div className="game-meta"><span><CalendarDays size={17} /> {game.date} · {game.time}</span><span><MapPin size={17} /> {game.venue || game.address}</span></div>
    </section>
    <section className="page-section boxscore"><p className="eyebrow dark">Nerone Basket Anzio</p><h2>Tabellino</h2>
      {stats.length ? <Table className="boxscore-table"><TableHeader><TableRow><TableHead>Giocatore</TableHead><TableHead>MIN</TableHead><TableHead>PT</TableHead><TableHead title="Tiri da 3 realizzati">T3</TableHead><TableHead title="Tiri da 2 realizzati">T2</TableHead><TableHead title="Tiri liberi realizzati">TL</TableHead><TableHead>F</TableHead><TableHead>RO</TableHead><TableHead>RD</TableHead><TableHead>AST</TableHead><TableHead>PP</TableHead></TableRow></TableHeader><TableBody>{stats.map((stat) => <TableRow key={stat.player_id}><TableCell><strong>{sportsData.players.find((player) => player.id === stat.player_id)?.name ?? stat.player_id}</strong></TableCell><TableCell>{stat.minutes}</TableCell><TableCell>{stat.points}</TableCell><TableCell>{stat.three_pointers_made}</TableCell><TableCell>{stat.two_pointers_made}</TableCell><TableCell>{stat.free_throws_made}</TableCell><TableCell>{stat.fouls}</TableCell><TableCell>{stat.rebounds_off}</TableCell><TableCell>{stat.rebounds_def}</TableCell><TableCell>{stat.assists}</TableCell><TableCell>{stat.turnovers}</TableCell></TableRow>)}</TableBody></Table> : <p className="stats-empty">Il tabellino verrà pubblicato dopo la partita.</p>}
      {game.instagram_url && <a className="button button-dark social-game-link" href={game.instagram_url} target="_blank" rel="noreferrer">Contenuto Instagram <ExternalLink size={16} /></a>}
    </section>
    <SiteFooter />
  </main>;
}
