const isCurrentMonth = false;
const matchdayTextUrl = "data/matchdays-month1.json";
const players = ["Juany", "Franco", "Ulises", "Nicolás"];
const referencesList = [
  {
    text: "- 1° gana el valor de un mes de Gimnasio",
    positions: [1],
    // Usará clase --first
  },
  {
    text: "- 2° al 4° paga el 33,3%",
    positions: [2, 3, 4],
    color: "#d68526",
  },
];
initializeMainPage(isCurrentMonth, matchdayTextUrl, players, referencesList);
