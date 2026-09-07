import type { Metadata } from 'next';
import { CompetitionPageView } from '@/components/competition-page-view';
import { competitions } from '@/lib/site-data';

export const metadata: Metadata = { title: 'Amatori UISP Platinum' };
export const dynamic = 'force-static';

export default function PlatinumPage() {
  return <CompetitionPageView competition={competitions[0]} />;
}
