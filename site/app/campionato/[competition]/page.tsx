import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompetitionPageView } from '@/components/competition-page-view';
import { getArchiveCompetitionIds, getLatestSeasonForCompetition } from '@/lib/archive-data';
import { getCompetition } from '@/lib/site-data';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return getArchiveCompetitionIds().map((competition) => ({ competition }));
}

export async function generateMetadata({ params }: { params: Promise<{ competition: string }> }): Promise<Metadata> {
  const { competition: competitionId } = await params;
  const competition = getCompetition(competitionId);
  const season = getLatestSeasonForCompetition(competitionId);
  return { title: competition && season ? `${competition.name} ${season.id.replace('-', '/')}` : 'Campionato' };
}

export default async function LatestCompetitionPage({ params }: { params: Promise<{ competition: string }> }) {
  const { competition: competitionId } = await params;
  const competition = getCompetition(competitionId);
  const season = getLatestSeasonForCompetition(competitionId);
  if (!competition || !season) notFound();

  return <CompetitionPageView competition={competition} seasonId={season.id} />;
}
