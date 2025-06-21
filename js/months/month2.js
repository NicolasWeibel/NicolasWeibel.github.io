const isCurrentMonth = false;
const matchdayTextUrl = "../data/matchdays-month2.json";
const players = ["Juany", "Franco", "Ulises", "Nicolás"];
const referencesList = [
  {
    text: "- 1° gana el valor de un mes de Gimnasio",
    positions: [1],
    // Usará clase --first
  },
  {
    text: "- 2° paga el 25%",
    positions: [2],
  },
  {
    text: "- 3° paga el 35%",
    positions: [3],
    color: "#d68526",
  },
  {
    text: "- 4° paga el 40%",
    positions: [4],
    color: "#f00",
  },
];
initializeMainPage(isCurrentMonth, matchdayTextUrl, players, referencesList);
