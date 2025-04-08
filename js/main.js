"use strict";

let showedMatchdayIndex;
let matchdays;
let leaderboardPositions;

class Player {
  constructor(name) {
    this.name = name;
    this.points = 0;
    this.exactHits = 0;
    this.partialHits = 0;
    this.incorrects = 0;
    this.playedMatches = 0;
  }

  sumPoints(points) {
    switch (points) {
      case 3:
        this.points += 3;
        this.exactHits += 1;
        break;
      case 1:
        this.points += 1;
        this.partialHits += 1;
        break;
      default:
        this.incorrects += 1;
        break;
    }
    this.playedMatches += 1;
  }
}

class LeaderboardPositions {
  constructor(players) {
    this.leaderboardPlayers = players.map((name) => new Player(name));
  }

  sortPositions() {
    this.leaderboardPlayers.sort((a, b) => {
      return b.points - a.points || b.exactHits - a.exactHits || 0;
    });
  }
}

const predictionHit = (
  scoreTeam1,
  scoreTeam2,
  predictionScoreTeam1,
  predictionScoreTeam2
) => {
  if (scoreTeam1 === "" || scoreTeam2 === "") {
    return "";
  }
  if (predictionScoreTeam1 === "" || predictionScoreTeam2 === "") {
    return 0;
  }
  if (
    scoreTeam1 == predictionScoreTeam1 &&
    scoreTeam2 == predictionScoreTeam2
  ) {
    return 3;
  }
  if (
    (scoreTeam1 > scoreTeam2 && predictionScoreTeam1 > predictionScoreTeam2) ||
    (scoreTeam1 < scoreTeam2 && predictionScoreTeam1 < predictionScoreTeam2) ||
    (scoreTeam1 == scoreTeam2 && predictionScoreTeam1 == predictionScoreTeam2)
  ) {
    return 1;
  }
  return 0;
};

const predictionEmoji = (
  scoreTeam1,
  scoreTeam2,
  predictionScoreTeam1,
  predictionScoreTeam2
) => {
  const points = predictionHit(
    scoreTeam1,
    scoreTeam2,
    predictionScoreTeam1,
    predictionScoreTeam2
  );

  if (points === "") {
    return "";
  }
  if (points === 3) {
    return "✅";
  }
  if (points === 1) {
    return "🟰";
  }
  return "❌";
};

const createAndAppendDiv = (classesArray, fatherDiv = "", text = "") => {
  const createdDiv = document.createElement("div");
  createdDiv.classList.add(...classesArray);
  createdDiv.textContent = text;
  if (fatherDiv) fatherDiv.appendChild(createdDiv);
  return createdDiv;
};

function dateFormatToCopyFormat(dateString, isMatchFormat) {
  const date = new Date(dateString);

  const weekdays = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIÉRCOLES",
    "JUEVES",
    "VIERNES",
    "SÁBADO",
  ];

  const weekday = weekdays[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  let formattedDate;

  if (isMatchFormat) {
    formattedDate = `| ${dayOfMonth}/${month} | ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}hs`;
  } else {
    formattedDate = `${weekday} ${dayOfMonth}/${month} a las ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}hs`;
  }

  return formattedDate;
}

const matchdayTextToCopy = () => {
  let copiedText = "";
  let isPronostic = true;
  let matchIndex = 0;
  let copyDateFormat = "";

  for (const match of matchdays[showedMatchdayIndex]["matchdayMatchs"]) {
    let team1 = match["team1"];
    let team2 = match["team2"];
    let scoreTeam1 = match["scoreTeam1"];
    let scoreTeam2 = match["scoreTeam2"];
    let matchdayDate = dateFormatToCopyFormat(match["matchDate"], true);

    if (matchIndex === 0) {
      copyDateFormat = dateFormatToCopyFormat(match["matchDate"], false);
    }

    copiedText += `\n\n${team1.toUpperCase()} ${scoreTeam1} - ${scoreTeam2} ${team2.toUpperCase()} `;

    if (scoreTeam1 !== "" && scoreTeam2 !== "") {
      isPronostic = false;
    } else {
      copiedText += matchdayDate;
    }

    for (const prediction of match["predictions"]) {
      let predictionScoreTeam1 = prediction["scoreTeam1"];
      let predictionScoreTeam2 = prediction["scoreTeam2"];
      let emojiCode = predictionEmoji(
        scoreTeam1,
        scoreTeam2,
        predictionScoreTeam1,
        predictionScoreTeam2
      );
      copiedText += `\n${prediction["name"]}: ${predictionScoreTeam1} - ${predictionScoreTeam2} ${emojiCode}`;
    }

    matchIndex += 1;
  }

  if (isPronostic)
    copiedText =
      `*${matchdays[showedMatchdayIndex][
        "matchdayName"
      ].toUpperCase()} PRONÓSTICO*\n\n*Decir resultados antes del ${copyDateFormat}*` +
      copiedText;
  else
    copiedText =
      `*${matchdays[showedMatchdayIndex]["matchdayName"].toUpperCase()}*` +
      copiedText;

  return copiedText;
};

const playerAlinedName = (playerName) => {
  switch (playerName) {
    case "Juany":
      return "••Juany";
    case "Franco":
      return "•Franco";
    case "Ulises":
      return "••Ulises";
    case "Lautaro":
      return "Lautaro";
    case "Nicolás":
      return "•Nicolás";
    case "Alejo":
      return "•••Alejo";
    case "Vilchez":
      return "Vilchez";
    default:
      return "";
  }
};

const leaderboardTextToCopy = () => {
  let copiedText = "*TABLA*\n*Nombre* | *Pts* | AT | AP | E | PJ";

  for (const player of leaderboardPositions.leaderboardPlayers) {
    let playerName = playerAlinedName(player.name);
    let playerPoints = player.points.toString().padStart(2, "0");
    let playerExactHits = player.exactHits.toString().padStart(2, "0");
    let playerPartialHits = player.partialHits.toString().padStart(2, "0");
    let playerIncorrect = player.incorrects.toString().padStart(2, "0");
    let playerPlayedMatches = player.playedMatches.toString().padStart(2, "0");
    copiedText += `\n*${playerName}* | *${playerPoints}* | ${playerExactHits} | ${playerPartialHits} | ${playerIncorrect} | ${playerPlayedMatches}`;
  }

  copiedText += "\n\nhttps://nicolasweibel.github.io";

  return copiedText;
};

const matchdayAndLeaderboardTextToCopy = () => {
  let copiedText = matchdayTextToCopy() + "\n\n" + leaderboardTextToCopy();
  return copiedText;
};

document.addEventListener("DOMContentLoaded", () => {
  const previusMatchdayDiv = document.getElementById("previous-matchday");
  previusMatchdayDiv.addEventListener("click", () => {
    createSpecificMatchdayTable(showedMatchdayIndex - 1);
  });

  const nextMatchdayDiv = document.getElementById("next-matchday");
  nextMatchdayDiv.addEventListener("click", () => {
    createSpecificMatchdayTable(showedMatchdayIndex + 1);
  });

  const monthSelectorSelect = document.getElementById("month-select-id");
  monthSelectorSelect.addEventListener("change", () => {
    window.location.href = monthSelectorSelect.value;
  });

  const matchdayAndLeaderboardCopyButton = document.getElementById(
    "matchday-and-leaderboard-copy-button"
  );
  matchdayAndLeaderboardCopyButton.addEventListener("click", async () => {
    const copyInfoDiv = document.getElementById("copy-edit-save-info");

    try {
      const permissionStatus = await navigator.permissions.query({
        name: "clipboard-write",
      });

      if (
        permissionStatus.state === "granted" ||
        permissionStatus.state === "prompt"
      ) {
        const copiedText = matchdayAndLeaderboardTextToCopy();
        await navigator.clipboard.writeText(copiedText);
        copyInfoDiv.textContent = "¡Texto copiado al portapapeles!";
        copyInfoDiv.classList.add("green-info");
        copyInfoDiv.classList.remove("red-info");
      } else {
        copyInfoDiv.textContent =
          "No se otorgaron permisos para copiar al portapapeles.";
        copyInfoDiv.classList.add("red-info");
        copyInfoDiv.classList.remove("green-info");
      }
    } catch (error) {
      copyInfoDiv.textContent = "Ocurrió un error al copiar al portapapeles.";
      copyInfoDiv.classList.add("red-info");
      copyInfoDiv.classList.remove("green-info");
    }

    setTimeout(function () {
      copyInfoDiv.textContent = "";
    }, 1000);
  });
});

const addMatchEventListeners = (matchDiv) => {
  matchDiv.addEventListener("click", () => {
    const predictionContainerDiv = matchDiv.nextElementSibling;
    const predictionArrow = matchDiv.lastChild.firstChild;
    const predictionContainerHeight = predictionContainerDiv.offsetHeight;

    if (predictionContainerHeight === 0) {
      const predictionDiv = predictionContainerDiv.firstChild;
      predictionContainerDiv.style.height = predictionDiv.offsetHeight + "px";
      predictionArrow.classList.add("rotate");
    } else {
      predictionContainerDiv.style.height = 0;
      predictionArrow.classList.remove("rotate");
    }
  });
};

const setChooseMatchdayTitle = (
  matchdayName,
  isCurrentMatchday,
  isNextMatchday
) => {
  const matchdayNameDiv = document.getElementById("current-matchday");
  matchdayNameDiv.textContent = "";

  if (isCurrentMatchday) matchdayNameDiv.textContent = "(fecha actual)";
  else if (isNextMatchday) matchdayNameDiv.textContent = "(próxima fecha)";

  const matchdayNameH2 = document.createElement("H2");
  matchdayNameH2.textContent = matchdayName;
  matchdayNameDiv.insertBefore(matchdayNameH2, matchdayNameDiv.firstChild);

  const rightArrowDiv = document.getElementById("next-matchday");
  const leftArrowDiv = document.getElementById("previous-matchday");
  if (showedMatchdayIndex > 0 && showedMatchdayIndex < matchdays.length - 1) {
    rightArrowDiv.classList.remove("no-display-arrow");
    leftArrowDiv.classList.remove("no-display-arrow");
  } else if (matchdays.length === 1) {
    leftArrowDiv.classList.add("no-display-arrow");
    rightArrowDiv.classList.add("no-display-arrow");
  } else if (showedMatchdayIndex === matchdays.length - 1) {
    leftArrowDiv.classList.remove("no-display-arrow");
    rightArrowDiv.classList.add("no-display-arrow");
  } else if (showedMatchdayIndex === 0) {
    rightArrowDiv.classList.remove("no-display-arrow");
    leftArrowDiv.classList.add("no-display-arrow");
  }
};

const createMatchDateDiv = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const dateDiv = createAndAppendDiv(["match-date"]);

  createAndAppendDiv(["match-day"], dateDiv, `${day}/${month}`);

  createAndAppendDiv(["match-time"], dateDiv, `${hours}:${minutes}`);

  return dateDiv;
};

const createMatchScoreDiv = (scoreTeam1, scoreTeam2) => {
  const scoreDiv = createAndAppendDiv(["match-score"]);

  createAndAppendDiv(["score-team1"], scoreDiv, scoreTeam1.toString());

  createAndAppendDiv(["score-team2"], scoreDiv, scoreTeam2.toString());

  return scoreDiv;
};

const createMatchExpandPredictionsDiv = () => {
  const expandPredictionsDiv = createAndAppendDiv([["expand-predictions"]]);

  createAndAppendDiv(["prediction-arrow"], expandPredictionsDiv);

  return expandPredictionsDiv;
};

const createMatchDiv = (matchObject) => {
  const matchDiv = createAndAppendDiv(["match"]);
  addMatchEventListeners(matchDiv);

  const matchDateDiv = createMatchDateDiv(matchObject["matchDate"]);
  matchDiv.appendChild(matchDateDiv);

  createAndAppendDiv(["match-team1"], matchDiv, matchObject["team1"]);

  const matchScoreDiv = createMatchScoreDiv(
    matchObject["scoreTeam1"],
    matchObject["scoreTeam2"]
  );
  matchDiv.appendChild(matchScoreDiv);

  createAndAppendDiv(["match-team2"], matchDiv, matchObject["team2"]);

  const matchExpandPredictionsDiv = createMatchExpandPredictionsDiv();
  matchDiv.appendChild(matchExpandPredictionsDiv);

  return matchDiv;
};

const createPredictionScoreDiv = (scoreTeam1, scoreTeam2) => {
  const predictionScoreDiv = createAndAppendDiv(["prediction-score"]);

  createAndAppendDiv(
    ["prediction-score-team1"],
    predictionScoreDiv,
    scoreTeam1
  );

  createAndAppendDiv(["separator"], predictionScoreDiv);

  createAndAppendDiv(
    ["prediction-score-team2"],
    predictionScoreDiv,
    scoreTeam2
  );

  return predictionScoreDiv;
};

const createPredictionResultDiv = (scorePredictionsArray, scoreTeamsArray) => {
  const predictionResult = predictionHit(
    scoreTeamsArray[0],
    scoreTeamsArray[1],
    scorePredictionsArray[0],
    scorePredictionsArray[1]
  );
  let classes = ["prediction-result"];
  let text = "";

  if (predictionResult === 3) {
    classes.push("exact-hit");
    text = "+3";
  } else if (predictionResult === 1) {
    classes.push("partial-hit");
    text = "+1";
  } else if (predictionResult === 0) {
    classes.push("incorrect");
    text = "0";
  }

  return createAndAppendDiv(classes, undefined, text);
};

const createSinglePredictionDiv = (singlePredictionObject, teamsArray) => {
  const singlePredictionDiv = createAndAppendDiv([
    "single-prediction",
    `prediction-${singlePredictionObject["cleanName"]}`,
  ]);

  createAndAppendDiv(
    ["prediction-name"],
    singlePredictionDiv,
    singlePredictionObject["name"]
  );

  createAndAppendDiv(
    ["prediction-team1"],
    singlePredictionDiv,
    teamsArray[0][0]
  );

  const predictionScoreDiv = createPredictionScoreDiv(
    singlePredictionObject["scoreTeam1"],
    singlePredictionObject["scoreTeam2"]
  );
  singlePredictionDiv.appendChild(predictionScoreDiv);

  createAndAppendDiv(
    ["prediction-team2"],
    singlePredictionDiv,
    teamsArray[1][0]
  );

  const predictionResultDiv = createPredictionResultDiv(
    [
      singlePredictionObject["scoreTeam1"],
      singlePredictionObject["scoreTeam2"],
    ],
    [teamsArray[0][1], teamsArray[1][1]]
  );
  singlePredictionDiv.appendChild(predictionResultDiv);

  return singlePredictionDiv;
};

const createPredictionsDiv = (predictionsArray, teamsArray) => {
  const predictionContainerDiv = createAndAppendDiv(["prediction-container"]);

  const predictionsDiv = createAndAppendDiv(["predictions"]);

  for (
    let iPrediction = 0;
    iPrediction < predictionsArray.length;
    iPrediction++
  ) {
    const singlePredictionDiv = createSinglePredictionDiv(
      predictionsArray[iPrediction],
      teamsArray
    );
    predictionsDiv.appendChild(singlePredictionDiv);
  }

  predictionContainerDiv.appendChild(predictionsDiv);

  return predictionContainerDiv;
};

const createMatchdayTable = (matchdayObject) => {
  setChooseMatchdayTitle(
    matchdayObject["matchdayName"],
    matchdayObject["isCurrentMatchday"],
    matchdayObject["isNextMatchday"]
  );
  const matchdayTableUl = document.querySelector(".matchday-table");
  matchdayTableUl.textContent = "";

  for (
    let iMatchs = 0;
    iMatchs < matchdayObject["matchdayMatchs"].length;
    iMatchs++
  ) {
    const matchObject = matchdayObject["matchdayMatchs"][iMatchs];
    const matchFragment = document.createDocumentFragment();
    const matchLi = document.createElement("li");

    const matchDiv = createMatchDiv(matchObject);
    matchLi.appendChild(matchDiv);

    const predictionsDiv = createPredictionsDiv(matchObject["predictions"], [
      [matchObject["team1"], matchObject["scoreTeam1"]],
      [matchObject["team2"], matchObject["scoreTeam2"]],
    ]);
    matchLi.appendChild(predictionsDiv);

    matchFragment.appendChild(matchLi);

    matchdayTableUl.appendChild(matchFragment);
  }
};

const createSpecificMatchdayTable = (matchdayIndex) => {
  showedMatchdayIndex = matchdayIndex;
  createMatchdayTable(matchdays[matchdayIndex]);
};

const completeLeaderboard = (orderedLeaderboardPlayers) => {
  function createAndAppendTd(trElement, content) {
    const tdElement = document.createElement("td");
    tdElement.textContent = content;
    trElement.appendChild(tdElement);
  }

  const tableBodyElement = document.querySelector(
    ".leaderboard-container tbody"
  );
  let positionCounter = 1;
  for (let playerObject of orderedLeaderboardPlayers) {
    const trElement = document.createElement("tr");

    createAndAppendTd(trElement, positionCounter);

    createAndAppendTd(trElement, playerObject.name);

    createAndAppendTd(trElement, playerObject.points);

    createAndAppendTd(trElement, playerObject.exactHits);

    createAndAppendTd(trElement, playerObject.partialHits);

    createAndAppendTd(trElement, playerObject.incorrects);

    createAndAppendTd(trElement, playerObject.playedMatches);

    tableBodyElement.appendChild(trElement);

    positionCounter += 1;
  }
};

const completeLeaderboardPositions = (iMatchdays, leaderboardPositions) => {
  for (let match of matchdays[iMatchdays]["matchdayMatchs"]) {
    const scoreTeam1 = match["scoreTeam1"];
    const scoreTeam2 = match["scoreTeam2"];

    if (scoreTeam1 !== "" && scoreTeam2 !== "") {
      for (let iPredictions in match["predictions"]) {
        const predictionScoreTeam1 =
          match["predictions"][iPredictions]["scoreTeam1"];
        const predictionScoreTeam2 =
          match["predictions"][iPredictions]["scoreTeam2"];
        const points = predictionHit(
          scoreTeam1,
          scoreTeam2,
          predictionScoreTeam1,
          predictionScoreTeam2
        );
        leaderboardPositions.leaderboardPlayers[iPredictions].sumPoints(points);
      }
    }
  }
};

const initializeMatchdayLeaderboardTable = (isCurrentMatchday, players) => {
  leaderboardPositions = new LeaderboardPositions(players);

  for (let iMatchdays in matchdays) {
    if (
      (isCurrentMatchday && matchdays[iMatchdays]["isCurrentMatchday"]) ||
      (!isCurrentMatchday && parseInt(iMatchdays) === matchdays.length - 1)
    ) {
      createSpecificMatchdayTable(parseInt(iMatchdays));
    }

    completeLeaderboardPositions(iMatchdays, leaderboardPositions);
  }

  leaderboardPositions.sortPositions();
  completeLeaderboard(leaderboardPositions.leaderboardPlayers);
};

const checkLoginStatus = (usersObject) => {
  if (document.cookie) {
    const cookieValue = document.cookie.split("!");
    const cookieUsername = cookieValue[0].split("=")[1];
    const cookieToken = cookieValue[1];
    if (
      usersObject[cookieUsername] &&
      cookieToken === usersObject[cookieUsername]["token"]
    ) {
      let elementHTML = `
      <div class="login-succesfully">
        <p>Hola ${encodeURIComponent(usersObject[cookieUsername]["name"])}</p>
        <img src="../imagenes/usuario.png" alt="Sesion Iniciada">
      </div>
      `;
      const sesionDiv = document.querySelector(".sesion");
      sesionDiv.innerHTML = elementHTML;
    }
  }
};

const fetchFiles = async (filePath) => {
  const response = await fetch(filePath);
  const data = response.json();
  return data;
};

const initializeMainPage = async (
  isCurrentMatchday,
  matchdayTextUrl,
  players
) => {
  const users = await fetchFiles("../text/users.txt");
  matchdays = await fetchFiles(matchdayTextUrl);

  checkLoginStatus(users);

  initializeMatchdayLeaderboardTable(isCurrentMatchday, players);
};
