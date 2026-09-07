export type Team = { name: string; short_name: string; logo?: string };
export type Player = { id: string; name: string; birth_date?: string; instagram?: string; photo?: string; bio: string };
export type RosterEntry = { season: string; competition: string; player_id: string; number: number | null; role: string; active: boolean };
export type Game = {
  id: string; date: string; time: string; status: string; home_team: string; away_team: string;
  home_score: number | null; away_score: number | null; venue: string; address: string;
  instagram_url: string; competition: string;
};
export type PlayerStat = {
  game_id: string; player_id: string; minutes: string; points: number; fouls: number;
  three_pointers_made: number; two_pointers_made: number; free_throws_made: number;
  rebounds_off: number; rebounds_def: number; assists: number; turnovers: number;
};
export type Standing = {
  team_id: string; name: string; played: number; wins: number; losses: number;
  points_for: number; points_against: number; difference: number; table_points: number | null;
};
export type CompetitionData = {
  id: string; name: string; team: string; standings_points: { win: number | null; loss: number | null };
  games: Game[]; playerStats: PlayerStat[]; standings: Standing[];
};
export type NewsItem = { slug: string; title: string; date: string; cover?: string; players?: string[]; games?: string[]; excerpt?: string; body: string };
export type SportsData = {
  season: string; teams: Record<string, Team>; players: Player[]; rosters: RosterEntry[];
  competitions: CompetitionData[]; news: NewsItem[];
};
