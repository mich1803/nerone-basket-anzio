export const season = {
  id: '2026-27',
  label: '2026/27',
};

export const competitions = [
  {
    slug: 'platinum',
    name: 'Amatori UISP',
    shortName: 'Amatori UISP',
    code: 'UISP',
    teamName: 'Nerone Basket Anzio',
  },
] as const;

export const clubTeams = [
  { id: 'nerone', name: 'Nerone Basket Anzio', shortName: 'Nerone' },
  { id: 'nerone-bounganvillae', name: 'Nerone Basket Bounganvillae Anzio', shortName: 'Bounganvillae' },
] as const;

export type ClubTeamId = (typeof clubTeams)[number]['id'];

export function isClubTeam(teamId: string): teamId is ClubTeamId {
  return clubTeams.some((team) => team.id === teamId);
}

export type Competition = (typeof competitions)[number];

export function getCompetition(slug: string) {
  return competitions.find((competition) => competition.slug === slug);
}

export function seasonRouteId(seasonId: string) {
  return seasonId.split('-')[1]?.slice(-2) ?? seasonId;
}

export function archivePath(section: 'campionato' | 'partite', competition: string, seasonId: string) {
  return `/${section}/${competition}/${seasonRouteId(seasonId)}`;
}
