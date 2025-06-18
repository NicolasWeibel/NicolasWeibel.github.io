/**
 * @file Main script for football prediction game management
 * @description Handles matchday display, leaderboard generation, and user interactions
 *
 * Main functionality groups:
 * 1. Core Classes (Player, LeaderboardPositions)
 * 2. Prediction Logic Functions
 * 3. DOM Creation Utilities
 * 4. Text Formatting Utilities
 * 5. Event Handlers & Initialization
 * 6. Clipboard Operations
 */
"use strict";

let showedMatchdayIndex;
let matchdays;
let leaderboardPositions;

// ======================
// 1. CORE CLASSES
// ======================

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
        this.playedMatches += 1;
        break;
      case 1:
        this.points += 1;
        this.partialHits += 1;
        this.playedMatches += 1;
        break;
      case -1:
        break;
      default:
        this.incorrects += 1;
        this.playedMatches += 1;
        break;
    }
  }
}

class LeaderboardPositions {
  constructor(players) {
    this.leaderboardPlayers = players.map((name) => new Player(name));
  }

  sortPositions() {
    this.leaderboardPlayers.sort((a, b) => {
      return (
        b.points - a.points || // Ordenar por puntos (descendente)
        b.exactHits - a.exactHits || // Luego por aciertos exactos (descendente)
        a.incorrects - b.incorrects || // Luego por incorrectos (ascendente)
        a.name.localeCompare(b.name) // Finalmente por nombre (ascendente)
      );
    });
  }
}

// ======================
// 2. PREDICTION LOGIC
// ======================

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
    return -1;
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
    return "✅ (+3)";
  }
  if (points === 1) {
    return "🟰 (+1)";
  }
  return "❌";
};

// ======================
// 3. DOM CREATION UTILS
// ======================

const createAndAppendDiv = (classesArray, fatherDiv = "", text = "") => {
  const createdDiv = document.createElement("div");
  createdDiv.classList.add(...classesArray);
  createdDiv.textContent = text;
  if (fatherDiv) fatherDiv.appendChild(createdDiv);
  return createdDiv;
};

const createMatchDateDiv = (dateString) => {
  const date = new Date(dateString);
  const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const dateDiv = createAndAppendDiv(["match-date"]);

  createAndAppendDiv(["match-day"], dateDiv, `${weekday} ${day}/${month}`);

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
  } else if (predictionResult === 0 || predictionResult === -1) {
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

/**
 * @function completeLeaderboard
 * @description Renders the leaderboard table in the DOM using the provided player data.
 *
 * - Dynamically creates and appends table rows for each player.
 * - Displays position, name, and stats (points, exact hits, partial hits, incorrects, played matches).
 * - Supports shared rankings when players tie in points, exact hits, and incorrects.
 * - Adds position-based classes (first to seventh) to position cells based on available references.
 *
 * @param {Array<Object>} orderedLeaderboardPlayers - Array of player objects sorted by ranking criteria.
 * @param {Array} referencesList - Optional array of references to determine the maximum position for applying position-based classes.
 */
const completeLeaderboard = (orderedLeaderboardPlayers, referencesList) => {
  // Determine the maximum position for applying position-based classes
  const maxPositionWithClass = referencesList ? referencesList.length : 0;

  /**
   * @function createAndAppendTd
   * @description Creates a table cell (td) element, sets its content, and appends it to the provided table row.
   *              Optionally applies a position-based class to the cell if within the valid range.
   * @param {HTMLElement} trElement - The table row element to append the cell to.
   * @param {string|number} content - The content to display in the cell.
   * @param {number|null} position - The position value for applying position-based classes (optional).
   */
  const createAndAppendTd = (trElement, content, position = null) => {
    const tdElement = document.createElement("td");
    tdElement.textContent = content;

    // Apply position-based class if the position is within the valid range
    if (position !== null && position <= maxPositionWithClass) {
      const positionClass =
        position === 1
          ? "first"
          : position === 2
          ? "second"
          : position === 3
          ? "third"
          : position === 4
          ? "fourth"
          : position === 5
          ? "fifth"
          : position === 6
          ? "sixth"
          : "seventh";
      tdElement.classList.add(positionClass);
    }

    trElement.appendChild(tdElement);
  };

  // Select the table body element and clear its existing content
  const tableBodyElement = document.querySelector(
    ".leaderboard-container tbody"
  );
  tableBodyElement.innerHTML = ""; // Clear table before rendering

  let positionCounter = 1; // Initialize position counter
  let previous = null; // Store previous player object for tie comparison

  // Iterate through the sorted player data to build the leaderboard
  for (let i = 0; i < orderedLeaderboardPlayers.length; i++) {
    const playerObject = orderedLeaderboardPlayers[i];

    // Determine position: increment only if the current player does not tie with the previous
    if (
      !(
        previous &&
        playerObject.points === previous.points &&
        playerObject.exactHits === previous.exactHits &&
        playerObject.incorrects === previous.incorrects
      )
    ) {
      positionCounter = i + 1;
    }

    // Create a new table row for the player
    const trElement = document.createElement("tr");

    // Append cells for position, name, and stats
    createAndAppendTd(trElement, positionCounter, positionCounter); // Position cell with position-based class
    createAndAppendTd(trElement, playerObject.name); // Name cell
    createAndAppendTd(trElement, playerObject.points); // Points cell
    createAndAppendTd(trElement, playerObject.exactHits); // Exact hits cell
    createAndAppendTd(trElement, playerObject.partialHits); // Partial hits cell
    createAndAppendTd(trElement, playerObject.incorrects); // Incorrects cell
    createAndAppendTd(trElement, playerObject.playedMatches); // Played matches cell

    // Append the row to the table body
    tableBodyElement.appendChild(trElement);
    previous = playerObject; // Update previous player for the next iteration
  }
};

/**
 * @function addReferencesToLeaderboard
 * @description Dynamically adds a list of reference notes (e.g., prize distribution) to the leaderboard section in the DOM.
 *
 * - Creates a <div> with class "references" inside the leaderboard container.
 * - Appends each reference as a <p> element with class "reference".
 * - Optionally assigns ranking-based classes ("first", "second", "third", etc.) to the first items for custom styling.
 * - If the leaderboard container is not found, the function exits silently.
 *
 * @param {Array<string>} referencesArray - An array of reference text strings to be displayed under the leaderboard (e.g., ["- 1° wins $12,000", "- 2° wins $8,000"]).
 */
const addReferencesToLeaderboard = (referencesArray) => {
  const leaderboardContainer = document.querySelector(".leaderboard-container");

  if (!leaderboardContainer) return;

  const referencesDiv = document.createElement("div");
  referencesDiv.classList.add("references");

  const classNames = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
  ];

  referencesArray.forEach((referenceText, index) => {
    const pElement = document.createElement("p");
    pElement.classList.add("reference");
    if (classNames[index]) {
      pElement.classList.add(classNames[index]);
    }
    pElement.textContent = referenceText;
    referencesDiv.appendChild(pElement);
  });

  leaderboardContainer.appendChild(referencesDiv);
};

// ======================
// 4. TEXT FORMATTING UTILS
// ======================

const dateFormatToCopyFormat = (dateString, isMatchFormat) => {
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
  const weekdaysMatchFormat = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const weekday = weekdays[date.getDay()];
  const weekdayMatchFormat = weekdaysMatchFormat[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  let formattedDate;

  if (isMatchFormat) {
    formattedDate = `| ${weekdayMatchFormat} ${dayOfMonth}/${month} | ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}hs`;
  } else {
    formattedDate = `${weekday} ${dayOfMonth}/${month} a las ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}hs`;
  }

  return formattedDate;
};

const matchdayTextToCopy = () => {
  let copiedText = "";
  let isPronostic = true;
  let matchIndex = 0;
  let copyDateFormat = "";
  let wasDateCopied = false;
  let wasDateCopiedFirstMatch = false;

  for (const match of matchdays[showedMatchdayIndex]["matchdayMatchs"]) {
    let team1 = match["team1"];
    let team2 = match["team2"];
    let scoreTeam1 = match["scoreTeam1"];
    let scoreTeam2 = match["scoreTeam2"];
    let matchdayDate = dateFormatToCopyFormat(match["matchDate"], true);

    if (scoreTeam1 === "" && scoreTeam2 === "" && !wasDateCopied) {
      copyDateFormat = dateFormatToCopyFormat(match["matchDate"], false);
      wasDateCopied = true;

      if (matchIndex === 0) {
        wasDateCopiedFirstMatch = true;
      }
    }

    copiedText += `\n\n${team1.toUpperCase()} ${scoreTeam1} - ${scoreTeam2} ${team2.toUpperCase()} `;

    if (scoreTeam1 !== "" && scoreTeam2 !== "") {
      isPronostic = false;
    } else {
      copiedText += matchdayDate;
      isPronostic = true;
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
      if (predictionScoreTeam1 !== "" && predictionScoreTeam2 !== "") {
        copiedText += `\n${prediction["name"]}: ${predictionScoreTeam1} - ${predictionScoreTeam2} ${emojiCode}`;
      } else if (scoreTeam1 !== "" && scoreTeam2 !== "") {
        copiedText += `\n${prediction["name"]}: ${emojiCode}`;
      } else {
        copiedText += `\n${prediction["name"]}:`;
      }
    }

    matchIndex += 1;
  }

  if (isPronostic)
    copiedText =
      `*${matchdays[showedMatchdayIndex][
        "matchdayName"
      ].toUpperCase()} PRONÓSTICO*\n\n` +
      `*${
        wasDateCopiedFirstMatch
          ? "Decir resultados"
          : "Decir el resto de resultados (solo si todavía no dijeron ninguno)"
      } antes del ${copyDateFormat}*` +
      copiedText;
  else
    copiedText =
      `*${matchdays[showedMatchdayIndex]["matchdayName"].toUpperCase()}*` +
      copiedText;

  return copiedText;
};

/**
 * @function leaderboardTextToCopy
 * @description Generates a formatted leaderboard table as plain text,
 * aligned for sharing via messaging apps like WhatsApp.
 *
 * - Aligns columns dynamically based on player name length and position digits.
 * - Supports shared rankings when players tie in points, exact hits, and incorrects.
 *
 * @returns {string} Formatted leaderboard table.
 */
const leaderboardTextToCopy = () => {
  const players = leaderboardPositions.leaderboardPlayers;

  const longestNameLength = players.reduce(
    (max, player) => Math.max(max, player.name.length),
    0
  );

  const positionDigits = players.length.toString().length;

  let copiedText = "*TABLA*\n```";
  copiedText += `\n${"#".padEnd(positionDigits + 1)}〡 ${"Nombre".padEnd(
    longestNameLength
  )} 〡Pts〡AT〡AP〡Er〡PJ`;

  let displayPosition;
  let previous = null;

  players.forEach((player, index) => {
    // Keep same position number if tied with previous player in points, exact hits, and incorrects
    if (
      !(
        previous &&
        player.points === previous.points &&
        player.exactHits === previous.exactHits &&
        player.incorrects === previous.incorrects
      )
    ) {
      displayPosition = index + 1;
    }

    const positionStr = `${displayPosition}°`.padEnd(positionDigits + 1);
    const name = player.name.padEnd(longestNameLength);
    const pts = player.points.toString().padEnd(3);
    const at = player.exactHits.toString().padEnd(2);
    const ap = player.partialHits.toString().padEnd(2);
    const e = player.incorrects.toString().padEnd(2);
    const pj = player.playedMatches.toString().padEnd(2);

    copiedText += `\n${positionStr}〡 ${name} 〡${pts}〡${at}〡${ap}〡${e}〡${pj}`;

    previous = player;
  });

  copiedText += "\n```\n\nhttps://nicolasweibel.github.io";
  return copiedText;
};

const matchdayAndLeaderboardTextToCopy = () => {
  let copiedText = matchdayTextToCopy() + "\n\n" + leaderboardTextToCopy();
  return copiedText;
};

// ======================
// 5. EVENT HANDLERS & INIT
// ======================

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

const createSpecificMatchdayTable = (matchdayIndex) => {
  showedMatchdayIndex = matchdayIndex;
  createMatchdayTable(matchdays[matchdayIndex]);
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

const initializeMatchdayLeaderboardTable = (
  isCurrentMatchday,
  players,
  referencesList
) => {
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
  completeLeaderboard(leaderboardPositions.leaderboardPlayers, referencesList);

  if (referencesList) {
    addReferencesToLeaderboard(referencesList);
  }
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
  isCurrentMonth,
  matchdayTextUrl,
  players,
  referencesList = null
) => {
  const users = await fetchFiles("../text/users.txt");
  matchdays = await fetchFiles(matchdayTextUrl);

  checkLoginStatus(users);

  initializeMatchdayLeaderboardTable(isCurrentMonth, players, referencesList);
};

// ======================
// 6. CLIPBOARD OPERATIONS
// ======================

// Note: Clipboard event handlers are included in the DOMContentLoaded section
// as they're directly tied to button elements

// Main initialization
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
