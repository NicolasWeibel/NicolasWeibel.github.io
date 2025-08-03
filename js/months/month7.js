const isCurrentMonth = true;
const matchdayTextUrl = "data/matchdays-month7.jsonc";
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
    text: "- 1° gana $12.000",
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
    text: "- 4° gana $4.000",
    positions: [4],
  },
  {
    text: "- 5° gana $2.000",
    positions: [5],
  },
];

initializeMainPage(isCurrentMonth, matchdayTextUrl, players, referencesList);
