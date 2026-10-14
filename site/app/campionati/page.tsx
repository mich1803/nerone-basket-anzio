import type { Metadata } from 'next';
import { CompetitionPageView } from '@/components/competition-page-view';
import { competitions } from '@/lib/site-data';

export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Amatori UISP' };

export default function CompetitionsPage() {
  return <CompetitionPageView competition={competitions[0]} seasonId="2026-27" />;
}
