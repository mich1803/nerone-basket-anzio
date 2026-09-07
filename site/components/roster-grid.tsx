'use client';

import { useMemo, useState } from 'react';
import Link from '@/components/site-link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assetPath, sitePath } from '@/lib/paths';

type RosterCardPlayer = {
  id: string;
  name: string;
  number: number | null;
  appearances: number;
  photo?: string;
};

type SortOption = 'name' | 'number' | 'appearances';

export function RosterGrid({ players }: { players: RosterCardPlayer[] }) {
  const [sortBy, setSortBy] = useState<SortOption>('number');
  const sortedPlayers = useMemo(() => [...players].sort((first, second) => {
    if (sortBy === 'appearances') {
      return second.appearances - first.appearances || first.name.localeCompare(second.name, 'it');
    }
    if (sortBy === 'number') {
      const firstNumber = first.number ?? Number.POSITIVE_INFINITY;
      const secondNumber = second.number ?? Number.POSITIVE_INFINITY;
      return firstNumber - secondNumber || first.name.localeCompare(second.name, 'it');
    }
    return first.name.localeCompare(second.name, 'it');
  }), [players, sortBy]);

  return (
    <>
      <div className="roster-toolbar">
        <p><strong>{players.length}</strong> giocatori</p>
        <label>
          <span>Ordina per</span>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="filter-trigger"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Ordine alfabetico</SelectItem>
              <SelectItem value="number">Numero di maglia</SelectItem>
              <SelectItem value="appearances">Presenze</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>

      <div className="roster-grid">
        {sortedPlayers.map((player) => (
          <Link href={sitePath(`/giocatori/${player.id}`)} className="player-card" key={player.id}>
            <figure className={player.photo ? '' : 'player-placeholder'}>
              <img src={assetPath(player.photo || '/assets/logo-bianco.png')} alt={player.photo ? player.name : ''} />
            </figure>
            <div className="player-card-meta">
              <span className="player-card-number">{player.number ?? '—'}</span>
              <span className="player-card-name"><strong>{player.name}</strong></span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
