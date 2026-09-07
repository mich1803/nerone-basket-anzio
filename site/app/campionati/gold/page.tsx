import type { Metadata } from 'next';
import { CompetitionPageView } from '@/components/competition-page-view';
import { competitions } from '@/lib/site-data';

export const metadata: Metadata = { title: 'Amatori UISP Gold' };
export const dynamic = 'force-static';

export default function GoldPage() {
  return <CompetitionPageView competition={competitions[1]} />;
}
