import { Trophy } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CompetitionFilters } from '@/components/competition-filters';
import { archivePath, competitions, type Competition } from '@/lib/site-data';
import type { Game } from '@/lib/data-types';
import { assetPath, sitePath } from '@/lib/paths';
import { sportsData } from '@/lib/generated-data';
import Link from '@/components/site-link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const monthNames = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

function formatGameDate(date: string) {
  if (!date) return 'Data non disponibile';
  const [year, month, day] = date.split('-').map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

function BracketMatchCard({ game, label, className = '' }: { game: Game; label: string; className?: string }) {
  const home = sportsData.teams[game.home_team];
  const away = sportsData.teams[game.away_team];
  const homeWon = (game.home_score ?? 0) > (game.away_score ?? 0);
  const awayWon = (game.away_score ?? 0) > (game.home_score ?? 0);
  const body = <>
    <span>{label} · {formatGameDate(game.date)}</span>
    <div className={`bracket-team${homeWon ? ' bracket-winner' : ''}`}>
      <img src={assetPath(game.home_team === 'nerone' ? '/assets/logo-bianco.png' : home?.logo || '/assets/logo-bianco.png')} alt="" />
      <strong>{home?.short_name ?? game.home_team}</strong><b>{game.home_score ?? '–'}</b>
    </div>
    <div className={`bracket-team${awayWon ? ' bracket-winner' : ''}`}>
      <img src={assetPath(game.away_team === 'nerone' ? '/assets/logo-bianco.png' : away?.logo || '/assets/logo-bianco.png')} alt="" />
      <strong>{away?.short_name ?? game.away_team}</strong><b>{game.away_score ?? '–'}</b>
    </div>
  </>;
  const classes = `bracket-match ${className}`.trim();
  return game.home_team === 'nerone' || game.away_team === 'nerone'
    ? <Link className={classes} href={sitePath(`/partite/${game.id}`)}>{body}</Link>
    : <article className={classes}>{body}</article>;
}

export function CompetitionPageView({ competition, seasonId }: { competition: Competition; seasonId: string }) {
  const availableSeasons = sportsData.seasons.filter((season) => season.competitions.some((item) => item.id === competition.slug));
  const selectedSeason = availableSeasons.find((season) => season.id === seasonId);
  const data = selectedSeason?.competitions.find((item) => item.id === competition.slug);
  const seasonOptions = availableSeasons.map((season) => {
    const hasCurrentCompetition = season.competitions.some((item) => item.id === competition.slug);
    const targetCompetition = hasCurrentCompetition ? competition.slug : season.competitions[0]?.id ?? competition.slug;
    return { id: season.id, href: archivePath('campionato', targetCompetition, season.id) };
  });
  const competitionOptions = competitions
    .filter((item) => selectedSeason?.competitions.some((dataItem) => dataItem.id === item.slug))
    .map((item) => ({ id: item.slug, label: item.shortName, href: archivePath('campionato', item.slug, seasonId) }));

  return (
    <main>
      <SiteHeader />
      <section className="league-hero">
        <img className="league-hero-bg" alt="" src={assetPath('/assets/calendar-bg.jpg')} />
        <p className="eyebrow">Nerone Basket Anzio · {seasonId.replace('-', '/')}</p>
        <span className="league-hero-code">{competition.code}</span>
        <h1>{competition.name}</h1>
      </section>

      <section className="page-section league-content">
        <div className="archive-toolbar">
          <CompetitionFilters current={competition.slug} season={seasonId} seasonOptions={seasonOptions} competitionOptions={competitionOptions} />
          <Link className="button archive-link" href={sitePath(archivePath('partite', competition.slug, seasonId))}>Vedi tutte le partite</Link>
        </div>
        <div className="standings-panel standings-panel-wide">
            <div className="content-heading">
              <p className="eyebrow dark">Classifica</p>
              <h2>Stagione regolare</h2>
            </div>
            <Table className="standings-table">
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead><TableHead>Squadra</TableHead><TableHead>G</TableHead>
                  <TableHead>V</TableHead><TableHead>S</TableHead><TableHead>PF</TableHead>
                  <TableHead>PS</TableHead><TableHead>PT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.standings.length ? data.standings.map((row, index) => (
                  <TableRow key={row.team_id} className={row.team_id === 'nerone' ? 'nerone-row' : ''}>
                    <TableCell>{index + 1}</TableCell><TableCell><strong>{row.name}</strong></TableCell>
                    <TableCell>{row.played}</TableCell><TableCell>{row.wins}</TableCell><TableCell>{row.losses}</TableCell>
                    <TableCell>{row.points_for}</TableCell><TableCell>{row.points_against}</TableCell>
                    <TableCell>{row.table_points ?? '—'}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={8} className="table-empty">La classifica comparirà dopo i primi risultati ufficiali.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
        </div>

        {data?.postseason && (() => {
          const semifinals = data.postseason.bracket.semifinal_game_ids.map((id) => data.games.find((game) => game.id === id)).filter((game): game is Game => Boolean(game));
          const finalGame = data.games.find((game) => game.id === data.postseason?.bracket.final_game_id);
          const champion = sportsData.teams[data.postseason.bracket.champion_team_id];
          return <div className="postseason-section">
            <div className="postseason-heading">
              <p className="eyebrow dark">Post season</p>
              <h2>{data.postseason.title}</h2>
            </div>

            <div className="playin-heading">
              <h3>{data.postseason.play_in.title}</h3>
              {data.postseason.play_in.note && <p>{data.postseason.play_in.note}</p>}
            </div>
            <div className="playin-groups">
              {data.postseason.play_in.groups.map((group) => <article className="playin-card" key={group.id}>
                <h4>{group.name}</h4>
                <table>
                  <thead><tr><th>Squadra</th><th>V–S</th><th>Diff.</th></tr></thead>
                  <tbody>{group.rows.map((row) => <tr className={row.team_id === 'nerone' ? 'playin-nerone' : ''} key={row.team_id}>
                    <td><img src={assetPath(sportsData.teams[row.team_id]?.logo || '/assets/logo-nero.png')} alt="" /><strong>{sportsData.teams[row.team_id]?.short_name ?? row.team_id}</strong>{row.qualified && <span>Qualificata</span>}</td>
                    <td>{row.wins}–{row.losses}</td>
                    <td>{row.difference > 0 ? '+' : ''}{row.difference}</td>
                  </tr>)}</tbody>
                </table>
              </article>)}
            </div>

            {semifinals.length === 2 && finalGame && <section className="final-four">
              <div className="final-four-heading"><p className="eyebrow">Tabellone</p><h3>{data.postseason.bracket.title}</h3></div>
              <div className="bracket-stage">
                <BracketMatchCard game={semifinals[0]} label="Semifinale" />
                <div className="bracket-final">
                  <Trophy aria-hidden="true" />
                  <BracketMatchCard game={finalGame} label="Finale" className="bracket-final-match" />
                  <p><strong>{champion?.short_name ?? data.postseason.bracket.champion_team_id}</strong> campione {seasonId.replace('-', '/')}</p>
                </div>
                <BracketMatchCard game={semifinals[1]} label="Semifinale" />
              </div>
            </section>}
            {data.postseason.closing_note && <p className="postseason-closing-note">{data.postseason.closing_note}</p>}
          </div>;
        })()}
      </section>
      <SiteFooter />
    </main>
  );
}
