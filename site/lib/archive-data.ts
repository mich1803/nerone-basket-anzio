import { sportsData } from '@/lib/generated-data';

export function getLatestSeasonForCompetition(competitionId: string) {
  return sportsData.seasons
    .filter((season) => season.competitions.some((competition) => competition.id === competitionId))
    .sort((first, second) => second.id.localeCompare(first.id))[0];
}

export function getArchiveCompetitionIds() {
  return [...new Set(sportsData.seasons.flatMap((season) => season.competitions.map((competition) => competition.id)))];
}
