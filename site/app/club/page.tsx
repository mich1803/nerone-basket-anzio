import type { Metadata } from 'next';
import { ExternalLink, MapPin } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageIntro } from '@/components/page-intro';
import { assetPath } from '@/lib/paths';

export const metadata: Metadata = { title: 'Club e contatti' };
export const dynamic = 'force-static';

const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Anzio+Basket+Club+Via+Olimpica+46B+Anzio';

export default function ClubPage() {
  return (
    <main>
      <SiteHeader />
      <PageIntro eyebrow="Nerone Basket Anzio" title="La nostra squadra">
        <p>Casa, contatti e realtà che sostengono la squadra.</p>
      </PageIntro>
      <section className="page-section club-grid">
        <article className="club-story-card">
          <p className="eyebrow">Il nostro club</p>
          <h2>La nostra storia</h2>
          <p>
            Uno spazio dedicato alla nascita del Nerone Basket Anzio, alle persone
            che hanno costruito la squadra e alle stagioni che ne hanno segnato il percorso.
          </p>
          <p>La biografia completa del club sarà pubblicata qui.</p>
        </article>
        <div className="venue-card">
          <div className="venue-photo"><img src={assetPath('/assets/calendar-bg.jpg')} alt="Campo da basket" /></div>
          <div className="venue-copy">
            <p className="eyebrow dark">Come raggiungerci</p>
            <h2>Campo 4Kasette (Anzio Basket Club)</h2>
            <p><MapPin size={18} /> Via Olimpica, 46B<br />00042 Anzio RM</p>
            <a className="button button-dark" href={mapsUrl} target="_blank" rel="noreferrer">Apri in Google Maps <ExternalLink size={17} /></a>
          </div>
        </div>
        <aside className="contact-card">
          <p className="eyebrow">Contatti</p>
          <p>Seguici su Instagram oppure scrivici via email.</p>
          <a href="https://www.instagram.com/nerone_basket_anzio/" target="_blank" rel="noreferrer">Instagram · @nerone_basket_anzio</a>
          <a href="mailto:nerone.basket@gmail.com">nerone.basket@gmail.com</a>
        </aside>
      </section>
      <section className="page-section sponsors-empty">
        <p className="eyebrow dark">Partner</p><h2>Sponsor</h2><p>Uno spazio dedicato a chi sostiene il Nerone Basket Anzio.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
