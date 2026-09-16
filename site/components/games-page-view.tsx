import { ArrowLeft } from 'lucide-react';
import { CompetitionFilters } from '@/components/competition-filters';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import Link from '@/components/site-link';
import type { Game } from '@/lib/data-types';
import { sportsData } from '@/lib/generated-data';
import { assetPath, sitePath } from '@/lib/paths';
import { archivePath, competitions, type Competition } from '@/lib/site-data';

const monthNames = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

function formatGameDate(date: string) {
  if (!date) return 'Data non disponibile';
  const [year, month, day] = date.split('-').map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

function orderedGames(games: Game[]) {
  return [...games].sort((first, second) => {
    if (first.date && second.date) return second.date.localeCompare(first.date);
    if (first.date) return -1;
    if (second.date) return 1;
    return second.id.localeCompare(first.id, 'it', { numeric: true });
  });
}

function ResultCard({ game }: { game: Game }) {
  const home = sportsData.teams[game.home_team];
  const away = sportsData.teams[game.away_team];

  return <Link className="result-card" href={sitePath(`/partite/${game.id}`)}>
    <span>{formatGameDate(game.date)}{game.round ? ` · ${game.round}` : ''}{game.notes ? ` · ${game.notes}` : ''}</span>
    <div className="result-match">
      <div className="result-team-list">
        <div className="result-team"><img src={assetPath(home?.logo || '/assets/logo-nero.png')} alt="" /><strong>{home?.short_name ?? game.home_team}</strong></div>
        <div className="result-team"><img src={assetPath(away?.logo || '/assets/logo-nero.png')} alt="" /><strong>{away?.short_name ?? game.away_team}</strong></div>
      </div>
      <b>{game.home_score ?? '–'} : {game.away_score ?? '–'}</b>
    </div>
  </Link>;
}

export function GamesPageView({ competition, seasonId }: { competition: Competition; seasonId: string }) {
  const selectedSeason = sportsData.seasons.find((season) => season.id === seasonId);
  const data = selectedSeason?.competitions.find((item) => item.id === competition.slug);
  const availableSeasons = sportsData.seasons.filter((season) => season.competitions.some((item) => item.id === competition.slug));
  const seasonOptions = availableSeasons.map((season) => {
    const targetCompetition = season.competitions.some((item) => item.id === competition.slug)
      ? competition.slug
      : season.competitions[0]?.id ?? competition.slug;
    return { id: season.id, href: archivePath('partite', targetCompetition, season.id) };
  });
  const competitionOptions = competitions
    .filter((item) => selectedSeason?.competitions.some((dataItem) => dataItem.id === item.slug))
    .map((item) => ({ id: item.slug, label: item.shortName, href: archivePath('partite', item.slug, seasonId) }));
  const neroneGames = data?.games.filter((game) => game.home_team === 'nerone' || game.away_team === 'nerone') ?? [];
  const otherGames = orderedGames(data?.games.filter((game) => game.home_team !== 'nerone' && game.away_team !== 'nerone') ?? []);
  const groups = [
    { id: 'final-four', title: 'Final Four', games: orderedGames(neroneGames.filter((game) => game.phase === 'final-four')) },
    { id: 'play-in', title: 'Play-in', games: orderedGames(neroneGames.filter((game) => game.phase === 'play-in')) },
    { id: 'regular-season', title: 'Stagione regolare', games: orderedGames(neroneGames.filter((game) => !game.phase || game.phase === 'regular-season')) },
  ].filter((group) => group.games.length > 0);

  return <main>
    <SiteHeader />
    <section className="league-hero games-hero">
      <img className="league-hero-bg" alt="" src={assetPath('/assets/calendar-bg.jpg')} />
      <p className="eyebrow">{competition.name} · {seasonId.replace('-', '/')}</p>
      <span className="league-hero-code">{competition.code}</span>
      <h1>Partite</h1>
    </section>

    <section className="page-section league-content">
      <div className="archive-toolbar">
        <CompetitionFilters current={competition.slug} season={seasonId} seasonOptions={seasonOptions} competitionOptions={competitionOptions} />
        <Link className="button archive-link" href={sitePath(archivePath('campionato', competition.slug, seasonId))}><ArrowLeft size={17} /> Classifiche e fasi finali</Link>
      </div>

      <div className="games-archive-layout">
        <div className="games-primary">
          <div className="content-heading">
            <p className="eyebrow dark">Nerone Basket Anzio</p>
            <h2>Tutte le partite</h2>
          </div>
          {groups.length ? groups.map((group) => <section className="game-phase" key={group.id}>
            <h3>{group.title}</h3>
            <div className="result-list">{group.games.map((game) => <ResultCard game={game} key={game.id} />)}</div>
          </section>) : <div className="empty-result"><img src={assetPath('/assets/logo-nero.png')} alt="" /><strong>Calendario in aggiornamento</strong><p>Qui troverai tutte le partite della stagione.</p></div>}
        </div>

        <aside className="results-panel other-games-panel">
          <div className="content-heading">
            <p className="eyebrow dark">Campionato</p>
            <h2>Altri risultati</h2>
          </div>
          {otherGames.length ? <div className="other-results archive-other-results">{otherGames.map((game) => (
            <div key={game.id}>
              <span>{sportsData.teams[game.home_team]?.short_name ?? game.home_team}</span>
              <b>{game.home_score ?? '–'}–{game.away_score ?? '–'}</b>
              <span>{sportsData.teams[game.away_team]?.short_name ?? game.away_team}</span>
              <small>{formatGameDate(game.date)}{game.round ? ` · ${game.round}` : ''}</small>
            </div>
          ))}</div> : <p className="archive-empty-note">I risultati delle altre squadre compariranno qui quando saranno disponibili.</p>}
        </aside>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
