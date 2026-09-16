import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GamesPageView } from '@/components/games-page-view';
import { sportsData } from '@/lib/generated-data';
import { getCompetition, seasonRouteId } from '@/lib/site-data';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return sportsData.seasons.flatMap((season) => season.competitions.map((competition) => ({
    id: competition.id,
    year: seasonRouteId(season.id),
  })));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; year: string }> }): Promise<Metadata> {
  const { id, year } = await params;
  const competition = getCompetition(id);
  const season = sportsData.seasons.find((item) => seasonRouteId(item.id) === year && item.competitions.some((data) => data.id === id));
  return { title: competition && season ? `Partite ${competition.shortName} ${season.id.replace('-', '/')}` : 'Partite' };
}

export default async function GamesSeasonPage({ params }: { params: Promise<{ id: string; year: string }> }) {
  const { id, year } = await params;
  const competition = getCompetition(id);
  const season = sportsData.seasons.find((item) => seasonRouteId(item.id) === year && item.competitions.some((data) => data.id === id));
  if (!competition || !season) notFound();

  return <GamesPageView competition={competition} seasonId={season.id} />;
}
