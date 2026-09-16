import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompetitionPageView } from '@/components/competition-page-view';
import { sportsData } from '@/lib/generated-data';
import { getCompetition, seasonRouteId } from '@/lib/site-data';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return sportsData.seasons.flatMap((season) => season.competitions.map((competition) => ({
    competition: competition.id,
    year: seasonRouteId(season.id),
  })));
}

export async function generateMetadata({ params }: { params: Promise<{ competition: string; year: string }> }): Promise<Metadata> {
  const { competition: competitionId, year } = await params;
  const competition = getCompetition(competitionId);
  const season = sportsData.seasons.find((item) => seasonRouteId(item.id) === year && item.competitions.some((data) => data.id === competitionId));
  return { title: competition && season ? `${competition.name} ${season.id.replace('-', '/')}` : 'Campionato' };
}

export default async function CompetitionSeasonPage({ params }: { params: Promise<{ competition: string; year: string }> }) {
  const { competition: competitionId, year } = await params;
  const competition = getCompetition(competitionId);
  const season = sportsData.seasons.find((item) => seasonRouteId(item.id) === year && item.competitions.some((data) => data.id === competitionId));
  if (!competition || !season) notFound();

  return <CompetitionPageView competition={competition} seasonId={season.id} />;
}
