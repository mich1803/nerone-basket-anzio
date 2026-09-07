export const season = {
  id: '2026-27',
  label: '2026/27',
};

export const competitions = [
  {
    slug: 'platinum',
    name: 'Amatori UISP Platinum',
    shortName: 'Platinum',
    code: 'PLT',
    teamName: 'Nerone Basket Anzio',
  },
  {
    slug: 'gold',
    name: 'Amatori UISP Gold',
    shortName: 'Gold',
    code: 'GLD',
    teamName: 'Nerone Basket Anzio',
  },
] as const;

export type Competition = (typeof competitions)[number];

export function getCompetition(slug: string) {
  return competitions.find((competition) => competition.slug === slug);
}
