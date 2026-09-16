import { ExternalLink } from 'lucide-react';

function instagramEmbedUrl(postUrl: string) {
  const permalink = postUrl.split('?')[0].replace(/\/+$/, '');
  return `${permalink}/embed/`;
}

export function PromotedSocial({ posts }: { posts: string[] }) {
  return (
    <section className="promoted-social" aria-labelledby="promoted-social-title">
      <div className="promoted-social-heading">
        <div>
          <p className="eyebrow">Dal profilo @nerone_basket_anzio</p>
          <h2 id="promoted-social-title">Ultimi contenuti social promossi</h2>
        </div>
        <p>Dal campo, dallo spogliatoio e dalla nostra community.</p>
      </div>

      <div className="promoted-social-grid">
        {posts.map((postUrl, index) => (
          <article className="promoted-social-card" key={postUrl}>
            <iframe
              className="instagram-embed"
              src={instagramEmbedUrl(postUrl)}
              title={`Contenuto Instagram promosso ${index + 1}`}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <a href={postUrl} target="_blank" rel="noreferrer">
              Apri su Instagram <ExternalLink size={16} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
