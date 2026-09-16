'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sitePath } from '@/lib/paths';

export function CompetitionFilters({
  current,
  season,
  seasonOptions,
  competitionOptions,
}: {
  current: string;
  season: string;
  seasonOptions: { id: string; href: string }[];
  competitionOptions: { id: string; label: string; href: string }[];
}) {
  return (
    <div className="filters" aria-label="Filtri campionato">
      <label htmlFor="season-filter">
        <span>Stagione</span>
        <Select value={season} onValueChange={(value) => {
          const option = seasonOptions.find((item) => item.id === value);
          if (option) window.location.assign(sitePath(option.href));
        }}>
          <SelectTrigger id="season-filter" className="filter-trigger"><SelectValue /></SelectTrigger>
          <SelectContent>{seasonOptions.map((item) => (
            <SelectItem value={item.id} key={item.id}>{item.id.replace('-', '/')}</SelectItem>
          ))}</SelectContent>
        </Select>
      </label>
      <label htmlFor="competition-filter">
        <span>Campionato</span>
        <Select value={current} onValueChange={(value) => {
          const option = competitionOptions.find((item) => item.id === value);
          if (option) window.location.assign(sitePath(option.href));
        }}>
          <SelectTrigger id="competition-filter" className="filter-trigger"><SelectValue /></SelectTrigger>
          <SelectContent>
            {competitionOptions.map((competition) => (
              <SelectItem value={competition.id} key={competition.id}>{competition.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
    </div>
  );
}
