import { ExternalLink } from 'lucide-react';
export function SocialEmbeds({ posts, title = 'Contenuti social' }: { posts: string[]; title?: string }) {
  if (!posts.length) return null;
  return <section className="social-embeds"><p className="eyebrow dark">Instagram</p><h2>{title}</h2><div className="social-embeds-grid">{posts.map((url, index) => { const clean = url.split('?')[0].replace(/\/+$/, ''); return <article className="social-embed-card" key={url}><iframe src={`${clean}/embed/`} title={`${title} ${index + 1}`} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" /><a href={url} target="_blank" rel="noreferrer">Apri su Instagram <ExternalLink size={15} /></a></article>; })}</div></section>;
}
