const isCurrentMonth = false;
const matchdayTextUrl = "data/matchdays-month3.json";
const players = ["Juany", "Franco", "Ulises", "Nicolás", "Lautaro"];
const referencesList = [
  {
    text: "- 1° gana el valor de un mes de Gimnasio",
    positions: [1],
    // Usará clase --first
  },
  {
    text: "- 2° paga el 15%",
    positions: [2],
  },
  {
    text: "- 3° paga el 20%",
    positions: [3],
  },
  {
    text: "- 4° paga el 30%",
    positions: [4],
    color: "#d68526",
  },
  {
    text: "- 5° paga el 35%",
    positions: [5],
    color: "#f00",
  },
];
initializeMainPage(isCurrentMonth, matchdayTextUrl, players, referencesList);
