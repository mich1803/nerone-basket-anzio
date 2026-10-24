'use client';

import { useState, type ComponentProps } from 'react';
import { it } from 'date-fns/locale';
import type { DayButton } from 'react-day-picker';
import Link from '@/components/site-link';
import { Car, House, MapPin } from 'lucide-react';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sitePath } from '@/lib/paths';

type CalendarGame = { id: string; date: string; time: string; competition: string; home: string; away: string; homeScore: number | null; awayScore: number | null; venue: string; address: string; clubTeamId: string; isNerone: boolean; isHome: boolean; isFriendly: boolean; hasDetailPage: boolean; calendarLabel: string };

function dateKey(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

export function SeasonCalendar({ games }: { games: CalendarGame[] }) {
  const [date, setDate] = useState<Date | undefined>();
  const [team, setTeam] = useState('all');
  const selectedDate = date ? dateKey(date) : '';
  const filteredGames = team === 'all' ? games : games.filter((game) => game.clubTeamId === team);
  const selectedGames = filteredGames.filter((game) => game.date === selectedDate);
  const gameDates = filteredGames.map((game) => new Date(`${game.date}T12:00:00`));
  const gamesByDate = new Map<string, CalendarGame[]>();
  filteredGames.forEach((game) => gamesByDate.set(game.date, [...(gamesByDate.get(game.date) ?? []), game]));

  function GameDayButton(props: ComponentProps<typeof DayButton>) {
    const dayGames = gamesByDate.get(dateKey(props.day.date)) ?? [];
    const title = dayGames.map((game) => `${game.calendarLabel}${game.time ? ` · ${game.time}` : ''}`).join('\n');
    return (
      <CalendarDayButton {...props} title={title || undefined}>
        <span className="calendar-day-number">{props.day.date.getDate()}</span>
        {dayGames.length > 0 && <span className="calendar-day-previews" aria-hidden="true">
          {dayGames.slice(0, 2).map((game) => <span className="calendar-day-preview" key={game.id}>{game.calendarLabel}</span>)}
          {dayGames.length > 2 && <span className="calendar-day-more">+{dayGames.length - 2}</span>}
        </span>}
      </CalendarDayButton>
    );
  }

  return (
    <div className="calendar-layout">
      <div className="calendar-controls">
        <label>
          <span>Squadra</span>
          <Select value={team} onValueChange={(value) => value && setTeam(value)}>
            <SelectTrigger className="filter-trigger"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Entrambe le squadre</SelectItem>
              <SelectItem value="nerone">Nerone Basket Anzio</SelectItem>
              <SelectItem value="nerone-bounganvillae">Nerone BGV</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
      <Calendar
        mode="single"
        locale={it}
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date()}
        modifiers={{ hasGame: gameDates }}
        modifiersClassNames={{ hasGame: 'calendar-game-day' }}
        components={{ DayButton: GameDayButton }}
        className="season-calendar"
      />
      <aside className="calendar-detail">
        <p className="eyebrow">Agenda</p>
        <h2>{date ? date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Seleziona un giorno'}</h2>
        {selectedGames.length ? <div className="calendar-games">{selectedGames.map((game) => {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(game.address || game.venue)}`;
          const content = <><span>{game.competition} · {game.time || 'Orario da definire'}</span><strong>{game.home} <b className={game.isFriendly ? 'calendar-versus' : 'calendar-score'}>{game.isFriendly ? 'vs' : `${game.homeScore ?? '–'} : ${game.awayScore ?? '–'}`}</b> {game.away}</strong>{game.isNerone && <em>{game.isHome ? <House size={15} /> : <Car size={15} />}{game.isHome ? 'Casa' : 'Trasferta'}</em>}</>;
          return <div key={game.id}>
            {game.isNerone && game.hasDetailPage ? <Link href={sitePath(`/partite/${game.id}`)}>{content}</Link> : content}
            {(game.address || game.venue) && <a className="calendar-venue" href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={14} />{game.venue}</a>}
          </div>;
        })}</div> : <p>Le partite appariranno qui appena sarà pubblicato il calendario ufficiale.</p>}
        <div className="calendar-legend"><span><i className="home-dot" /> Casa</span><span><i className="away-dot" /> Trasferta</span></div>
      </aside>
    </div>
  );
}
