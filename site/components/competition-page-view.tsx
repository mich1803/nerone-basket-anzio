import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CompetitionFilters } from '@/components/competition-filters';
import type { Competition } from '@/lib/site-data';
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

export function CompetitionPageView({ competition }: { competition: Competition }) {
  const data = sportsData.competitions.find((item) => item.id === competition.slug);
  const neroneGames = data?.games.filter((game) => game.home_team === 'nerone' || game.away_team === 'nerone') ?? [];
  const otherGames = data?.games.filter((game) => game.home_team !== 'nerone' && game.away_team !== 'nerone') ?? [];

  return (
    <main>
      <SiteHeader />
      <section className="league-hero">
        <img className="league-hero-bg" alt="" src={assetPath('/assets/calendar-bg.jpg')} />
        <p className="eyebrow">Nerone Basket Anzio · 2026/27</p>
        <span className="league-hero-code">{competition.code}</span>
        <h1>{competition.name}</h1>
      </section>

      <section className="page-section league-content">
        <CompetitionFilters current={competition.slug} />
        <div className="league-layout">
          <div className="standings-panel">
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

          <aside className="results-panel">
            <div className="content-heading">
              <p className="eyebrow dark">Partite</p>
              <h2>Risultati Nerone</h2>
            </div>
            {neroneGames.length ? <div className="result-list">{[...neroneGames].reverse().map((game) => (
              <Link className="result-card" href={sitePath(`/partite/${game.id}`)} key={game.id}>
                <span>{game.date}</span>
                <strong>{sportsData.teams[game.home_team]?.short_name ?? game.home_team}</strong>
                <b>{game.home_score ?? '–'} : {game.away_score ?? '–'}</b>
                <strong>{sportsData.teams[game.away_team]?.short_name ?? game.away_team}</strong>
              </Link>
            ))}</div> : <div className="empty-result"><img src={assetPath('/assets/logo-nero.png')} alt="" /><strong>Calendario in aggiornamento</strong><p>Qui troverai le partite in ordine dalla più recente.</p></div>}

            {otherGames.length > 0 && <div className="other-results"><h3>Altri risultati</h3>{[...otherGames].reverse().map((game) => (
              <div key={game.id}><span>{sportsData.teams[game.home_team]?.short_name ?? game.home_team}</span><b>{game.home_score ?? '–'}–{game.away_score ?? '–'}</b><span>{sportsData.teams[game.away_team]?.short_name ?? game.away_team}</span></div>
            ))}</div>}
          </aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
