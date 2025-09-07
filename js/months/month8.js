/**
 * month8.js
 *
 * Example month configuration that demonstrates how to choose the
 * per-month tie-breaker chain.
 *
 * CRITERION FOR THIS MONTH:
 *  1) point (desc)            -> more points is better
 *  2) exactHits (desc)        -> more exact hits is better
 *  3) goalsErrorSum (asc)     -> lower sum of per-team goal error is better
 *  4) incorrects (asc)        -> fewer incorrects is better
 */

const isCurrentMonth = true;
const matchdayTextUrl = "data/matchdays-month8.jsonc";
const players = [
  "Juany",
  "Toto",
  "Ulises",
  "Nicolás",
  "Alejo",
  "Vilchez",
  "Seba",
  "Mati",
  "Joaco",
  "Lucho",
  "Pelado",
];

const referencesList = [
  { text: "- 1° gana $14.000", positions: [1] },
  { text: "- 2° gana $10.000", positions: [2] },
  { text: "- 3° gana $8.000", positions: [3] },
  { text: "- 4° gana $6.000", positions: [4] },
  { text: "- 5° gana $4.000", positions: [5] },
  { text: "- 6° gana $2.000", positions: [6] },
];

// Tie-breaker criteria specific for month 8
const tieBreakerCriteria = [
  { key: "points", order: "desc" },
  { key: "exactHits", order: "desc" },
  { key: "incorrects", order: "asc" },
];

initializeMainPage(
  isCurrentMonth,
  matchdayTextUrl,
  players,
  referencesList,
  tieBreakerCriteria
);
