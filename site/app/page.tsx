import Link from '@/components/site-link';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { assetPath, sitePath } from '@/lib/paths';
import { sportsData } from '@/lib/generated-data';
import { Countdown } from '@/components/countdown';
import { PromotedSocial } from '@/components/promoted-social';
import homeSocial from '@/data/home-social.json';

const competitions = [
  { name: 'Amatori UISP Platinum', slug: 'platinum', code: 'PLT' },
  { name: 'Amatori UISP Gold', slug: 'gold', code: 'GLD' },
];

export const dynamic = 'force-static';

export default function Home() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = sportsData.competitions.flatMap((competition) => competition.games.map((game) => ({ ...game, competitionName: competition.name }))).filter((game) => game.status === 'scheduled' && game.date >= today).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const nextGame = upcoming[0];
  const nextHome = nextGame ? sportsData.teams[nextGame.home_team]?.short_name ?? nextGame.home_team : '';
  const nextAway = nextGame ? sportsData.teams[nextGame.away_team]?.short_name ?? nextGame.away_team : '';

  return (
    <main>
      <SiteHeader />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Nerone Basket Anzio · Stagione 2026/27</p>
          <h1 id="hero-title">Black!</h1>
          <p className="hero-intro">
            Risultati, classifiche, tabellini e notizie della stagione 26/27 del
            NERONE BASKET ANZIO.
          </p>
          <div className="hero-actions">
            <Link className="button button-light" href={sitePath('/campionati')}>
              Segui la stagione <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="text-link" href={sitePath('/roster')}>Scopri i roster</Link>
          </div>
        </div>

        <div className="hero-photo" aria-hidden="true">
          <img src={assetPath('/assets/home-team-alt.png')} alt="" />
          <div className="photo-wash" />
          <p className="side-word">ANZIO</p>
        </div>

        <aside className="next-game" aria-label="Prossima partita">
          <p className="panel-label">Prossima partita</p>
          <div className="next-game-state">
            <img src={assetPath('/assets/logo-bianco.png')} alt="" />
            <div>
              <strong>{nextGame ? `${nextHome} – ${nextAway}` : 'Calendario in aggiornamento'}</strong>
              <span>{nextGame?.competitionName ?? 'Stagione 2026/27'}</span>
            </div>
          </div>
          <div className="next-game-meta">
            <span><CalendarDays size={16} /> {nextGame ? `${nextGame.date} · ${nextGame.time}` : 'Date in arrivo'}</span>
            <span><MapPin size={16} /> {nextGame?.venue || 'Anzio'}</span>
          </div>
          {nextGame && <Countdown target={`${nextGame.date}T${nextGame.time || '00:00'}:00`} />}
        </aside>
      </section>

      <PromotedSocial posts={homeSocial.posts} />

      <section className="competition-strip" aria-labelledby="competitions-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Le nostre squadre</p>
            <h2 id="competitions-title">Scegli il campionato</h2>
          </div>
          <p>
            Nella stagione 26/27 NERONE parteciperà ai due campionati amatori UISP
            Platinum e Gold.
          </p>
        </div>

        <div className="competition-grid">
          {competitions.map((competition, index) => (
            <Link href={sitePath(`/campionati/${competition.slug}`)} className="competition-card" key={competition.slug}>
              <span className="competition-index">0{index + 1}</span>
              <span className="competition-code">{competition.code}</span>
              <div>
                <p>Stagione 2026/27</p>
                <h3>{competition.name}</h3>
              </div>
              <ArrowRight size={24} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
