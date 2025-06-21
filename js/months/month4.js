const isCurrentMonth = false;
const matchdayTextUrl = "data/matchdays-month4.json";
const players = ["Juany", "Franco", "Ulises", "Nicolás", "Alejo", "Vilchez"];
const referencesList = [
  {
    text: "- 1° gana $12.000",
    positions: [1],
    // Usará clase --first
  },
  {
    text: "- 2° gana $8.000",
    positions: [2],
  },
  {
    text: "- 3° gana $4.000",
    positions: [3],
  },
];
initializeMainPage(isCurrentMonth, matchdayTextUrl, players, referencesList);
