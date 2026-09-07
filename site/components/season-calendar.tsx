'use client';

import { useState } from 'react';
import { it } from 'date-fns/locale';
import Link from '@/components/site-link';
import { Car, House } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sitePath } from '@/lib/paths';

type CalendarGame = { id: string; date: string; time: string; competition: string; home: string; away: string; homeScore: number | null; awayScore: number | null; isNerone: boolean; isHome: boolean };

export function SeasonCalendar({ games }: { games: CalendarGame[] }) {
  const [date, setDate] = useState<Date | undefined>();
  const selectedDate = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
  const selectedGames = games.filter((game) => game.date === selectedDate);
  const gameDates = games.map((game) => new Date(`${game.date}T12:00:00`));

  return (
    <div className="calendar-layout">
      <div className="calendar-controls">
        <label>
          <span>Campionato</span>
          <Select defaultValue="all">
            <SelectTrigger className="filter-trigger"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le squadre</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
      <Calendar
        mode="single"
        locale={it}
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 8, 1)}
        modifiers={{ hasGame: gameDates }}
        modifiersClassNames={{ hasGame: 'calendar-game-day' }}
        className="season-calendar"
      />
      <aside className="calendar-detail">
        <p className="eyebrow">Agenda</p>
        <h2>{date ? date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Seleziona un giorno'}</h2>
        {selectedGames.length ? <div className="calendar-games">{selectedGames.map((game) => {
          const content = <><span>{game.competition} · {game.time}</span><strong>{game.home} <b>{game.homeScore ?? '–'} : {game.awayScore ?? '–'}</b> {game.away}</strong>{game.isNerone && <em>{game.isHome ? <House size={15} /> : <Car size={15} />}{game.isHome ? 'Casa' : 'Trasferta'}</em>}</>;
          return game.isNerone ? <Link href={sitePath(`/partite/${game.id}`)} key={game.id}>{content}</Link> : <div key={game.id}>{content}</div>;
        })}</div> : <p>Le partite appariranno qui appena sarà pubblicato il calendario ufficiale.</p>}
        <div className="calendar-legend"><span><i className="home-dot" /> Casa</span><span><i className="away-dot" /> Trasferta</span></div>
      </aside>
    </div>
  );
}
