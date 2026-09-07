import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { sportsData } from '@/lib/generated-data';
import { assetPath } from '@/lib/paths';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() { return sportsData.news.map((news) => ({ slug: news.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = sportsData.news.find((item) => item.slug === slug);
  return { title: news?.title ?? 'Notizia', description: news?.excerpt };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = sportsData.news.find((item) => item.slug === slug);
  if (!news) notFound();
  const html = await marked.parse(news.body);
  return <main>
    <SiteHeader />
    <section className="article-hero">
      {news.cover && <img src={assetPath(news.cover)} alt="" />}
      <div><p className="eyebrow">{new Date(`${news.date}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p><h1>{news.title}</h1></div>
    </section>
    <article className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
    <SiteFooter />
  </main>;
}
