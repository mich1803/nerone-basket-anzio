'use client';

import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { competitions } from '@/lib/site-data';
import { sitePath } from '@/lib/paths';

export function CompetitionFilters({ current }: { current: string }) {
  const router = useRouter();

  return (
    <div className="filters" aria-label="Filtri campionato">
      <label>
        <span>Stagione</span>
        <Select defaultValue="2026-27">
          <SelectTrigger className="filter-trigger"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="2026-27">2026/27</SelectItem></SelectContent>
        </Select>
      </label>
      <label>
        <span>Campionato</span>
        <Select defaultValue={current} onValueChange={(value) => router.push(sitePath(`/campionati/${value}`))}>
          <SelectTrigger className="filter-trigger"><SelectValue /></SelectTrigger>
          <SelectContent>
            {competitions.map((competition) => (
              <SelectItem value={competition.slug} key={competition.slug}>{competition.shortName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
    </div>
  );
}
