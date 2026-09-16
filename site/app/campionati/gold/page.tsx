import type { Metadata } from 'next';
import { CompetitionPageView } from '@/components/competition-page-view';
import { competitions } from '@/lib/site-data';
import { getLatestSeasonForCompetition } from '@/lib/archive-data';

export const metadata: Metadata = { title: 'Amatori UISP Gold' };
export const dynamic = 'force-static';

export default function GoldPage() {
  const season = getLatestSeasonForCompetition(competitions[1].slug);
  return <CompetitionPageView competition={competitions[1]} seasonId={season?.id ?? '2026-27'} />;
}
