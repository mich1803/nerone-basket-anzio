'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type PlayerSeasonStats = {
  season: string;
  games: number;
  minutes: number;
  points: number;
  threePointersMade: number;
  twoPointersMade: number;
  freeThrowsMade: number;
  fouls: number;
  reboundsOff: number;
  reboundsDef: number;
  assists: number;
  turnovers: number;
};

function formatNumber(value: number, games: number, totals: boolean) {
  if (!totals && games === 0) return '—';
  return totals ? String(value) : (value / games).toFixed(1);
}

function formatMinutes(seconds: number, games: number, totals: boolean) {
  if (!totals && games === 0) return '—';
  const value = totals ? seconds : seconds / games;
  const roundedValue = Math.round(value);
  const minutes = Math.floor(roundedValue / 60);
  const remainingSeconds = roundedValue % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function PlayerStats({ rows }: { rows: PlayerSeasonStats[] }) {
  const [showTotals, setShowTotals] = useState(false);

  return (
    <div className="player-stats-block">
      <div className="player-stats-mode">
        <span className={!showTotals ? 'active' : ''}>Per partita</span>
        <Switch
          checked={showTotals}
          onCheckedChange={setShowTotals}
          aria-label="Mostra le statistiche totali"
        />
        <span className={showTotals ? 'active' : ''}>Totali</span>
      </div>

      <Table className="player-stats-table">
        <TableHeader>
          <TableRow>
            <TableHead>Stagione</TableHead>
            <TableHead>PG</TableHead>
            <TableHead>MIN</TableHead>
            <TableHead>PT</TableHead>
            <TableHead title="Tiri da 3 realizzati">T3</TableHead>
            <TableHead title="Tiri da 2 realizzati">T2</TableHead>
            <TableHead title="Tiri liberi realizzati">TL</TableHead>
            <TableHead>FAL</TableHead>
            <TableHead>RO</TableHead>
            <TableHead>RD</TableHead>
            <TableHead>AST</TableHead>
            <TableHead>PP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.season}>
              <TableCell><strong>{row.season.replace('-', '/')}</strong></TableCell>
              <TableCell>{row.games}</TableCell>
              <TableCell>{formatMinutes(row.minutes, row.games, showTotals)}</TableCell>
              <TableCell>{formatNumber(row.points, row.games, showTotals)}</TableCell>
              <TableCell>{formatNumber(row.threePointersMade, row.games, showTotals)}</TableCell>
              <TableCell>{formatNumber(row.twoPointersMade, row.games, showTotals)}</TableCell>
              <TableCell>{formatNumber(row.freeThrowsMade, row.games, showTotals)}</TableCell>
              <TableCell>{formatNumber(row.fouls, row.games, showTotals)}</TableCell>
              <TableCell>{formatNumber(row.reboundsOff, row.games, showTotals)}</TableCell>
              <TableCell>{formatNumber(row.reboundsDef, row.games, showTotals)}</TableCell>
              <TableCell>{formatNumber(row.assists, row.games, showTotals)}</TableCell>
              <TableCell>{formatNumber(row.turnovers, row.games, showTotals)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
