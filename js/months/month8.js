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
  {
    text: "- 1° gana $14.000",
    positions: [1],
    // Usará clase --first
  },
  {
    text: "- 2° gana $10.000",
    positions: [2],
  },
  {
    text: "- 3° gana $8.000",
    positions: [3],
  },
  {
    text: "- 4° gana $6.000",
    positions: [4],
  },
  {
    text: "- 5° gana $4.000",
    positions: [5],
  },
  {
    text: "- 6° gana $2.000",
    positions: [6],
  },
];

initializeMainPage(isCurrentMonth, matchdayTextUrl, players, referencesList);
