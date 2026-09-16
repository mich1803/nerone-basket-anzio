import type { Metadata } from 'next';
import { CompetitionPageView } from '@/components/competition-page-view';
import { competitions } from '@/lib/site-data';
import { getLatestSeasonForCompetition } from '@/lib/archive-data';

export const metadata: Metadata = { title: 'Amatori UISP Platinum' };
export const dynamic = 'force-static';

export default function PlatinumPage() {
  const season = getLatestSeasonForCompetition(competitions[0].slug);
  return <CompetitionPageView competition={competitions[0]} seasonId={season?.id ?? '2026-27'} />;
}
