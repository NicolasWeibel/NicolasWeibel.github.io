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
      case -1: // Prediction not made
        break;
      default: // points === 0 (incorrect)
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
        b.points - a.points || // Sort by points (descending)
        b.exactHits - a.exactHits || // Then by exact hits (descending)
        a.incorrects - b.incorrects || // Then by incorrects (ascending)
        a.name.localeCompare(b.name) // Finally by name (ascending)
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
    return ""; // Match not played yet
  }
  if (predictionScoreTeam1 === "" || predictionScoreTeam2 === "") {
    return -1; // Prediction not made
  }
  if (
    scoreTeam1 == predictionScoreTeam1 &&
    scoreTeam2 == predictionScoreTeam2
  ) {
    return 3; // Exact hit
  }
  if (
    (scoreTeam1 > scoreTeam2 && predictionScoreTeam1 > predictionScoreTeam2) ||
    (scoreTeam1 < scoreTeam2 && predictionScoreTeam1 < predictionScoreTeam2) ||
    (scoreTeam1 == scoreTeam2 && predictionScoreTeam1 == predictionScoreTeam2)
  ) {
    return 1; // Partial hit (correct outcome)
  }
  return 0; // Incorrect
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

const createAndAppendElement = (
  tag,
  classesArray,
  fatherElement = null,
  textContent = ""
) => {
  const element = document.createElement(tag);
  if (classesArray && classesArray.length > 0) {
    element.classList.add(...classesArray);
  }
  if (textContent) {
    element.textContent = textContent;
  }
  if (fatherElement) {
    fatherElement.appendChild(element);
  }
  return element;
};

const createMatchDateDiv = (dateString) => {
  const date = new Date(dateString);
  const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const dateDiv = createAndAppendElement("div", ["match__date"]);

  createAndAppendElement(
    "div",
    ["match__date-day"],
    dateDiv,
    `${weekday} ${day}/${month}`
  );
  createAndAppendElement(
    "div",
    ["match__date-time"],
    dateDiv,
    `${hours}:${minutes}`
  );

  return dateDiv;
};

const createMatchScoreDiv = (scoreTeam1, scoreTeam2) => {
  const scoreDiv = createAndAppendElement("div", ["match__score"]);
  createAndAppendElement(
    "div",
    ["match__score-team"],
    scoreDiv,
    scoreTeam1.toString()
  );
  createAndAppendElement(
    "div",
    ["match__score-team"],
    scoreDiv,
    scoreTeam2.toString()
  );
  return scoreDiv;
};

const createMatchExpandPredictionsDiv = () => {
  const expandPredictionsDiv = createAndAppendElement("div", [
    "match__expand-predictions",
  ]);
  createAndAppendElement(
    "div",
    ["match__expand-predictions-arrow"],
    expandPredictionsDiv
  );
  return expandPredictionsDiv;
};

const createMatchDiv = (matchObject) => {
  const matchDiv = createAndAppendElement("div", ["match"]);
  addMatchEventListeners(matchDiv);

  matchDiv.appendChild(createMatchDateDiv(matchObject["matchDate"]));
  createAndAppendElement(
    "div",
    ["match__team"],
    matchDiv,
    matchObject["team1"]
  );
  matchDiv.appendChild(
    createMatchScoreDiv(matchObject["scoreTeam1"], matchObject["scoreTeam2"])
  );
  createAndAppendElement(
    "div",
    ["match__team"],
    matchDiv,
    matchObject["team2"]
  );
  matchDiv.appendChild(createMatchExpandPredictionsDiv());

  return matchDiv;
};

const createPredictionScoreDiv = (scoreTeam1, scoreTeam2) => {
  const predictionScoreDiv = createAndAppendElement("div", [
    "prediction__score",
  ]);
  createAndAppendElement(
    "div",
    ["prediction__score-team"],
    predictionScoreDiv,
    scoreTeam1
  );
  createAndAppendElement(
    "div",
    ["prediction__score-separator"],
    predictionScoreDiv
  );
  createAndAppendElement(
    "div",
    ["prediction__score-team"],
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
  const classes = ["prediction__result"];
  let text = "";

  if (predictionResult === 3) {
    classes.push("prediction__result--exact-hit");
    text = "+3";
  } else if (predictionResult === 1) {
    classes.push("prediction__result--partial-hit");
    text = "+1";
  } else if (predictionResult === 0 || predictionResult === -1) {
    classes.push("prediction__result--incorrect");
    text = "0";
  }

  return createAndAppendElement("div", classes, undefined, text);
};

const createSinglePredictionDiv = (singlePredictionObject, teamsArray) => {
  const singlePredictionDiv = createAndAppendElement("div", [
    "prediction",
    `prediction--${singlePredictionObject["cleanName"]}`,
  ]);

  createAndAppendElement(
    "div",
    ["prediction__name"],
    singlePredictionDiv,
    singlePredictionObject["name"]
  );
  createAndAppendElement(
    "div",
    ["prediction__team"],
    singlePredictionDiv,
    teamsArray[0][0]
  );
  singlePredictionDiv.appendChild(
    createPredictionScoreDiv(
      singlePredictionObject["scoreTeam1"],
      singlePredictionObject["scoreTeam2"]
    )
  );
  createAndAppendElement(
    "div",
    ["prediction__team"],
    singlePredictionDiv,
    teamsArray[1][0]
  );
  singlePredictionDiv.appendChild(
    createPredictionResultDiv(
      [
        singlePredictionObject["scoreTeam1"],
        singlePredictionObject["scoreTeam2"],
      ],
      [teamsArray[0][1], teamsArray[1][1]]
    )
  );

  return singlePredictionDiv;
};

const createPredictionsDiv = (predictionsArray, teamsArray) => {
  const predictionContainerDiv = createAndAppendElement("div", [
    "prediction-container",
  ]);
  const predictionsDiv = createAndAppendElement("div", ["predictions"]);

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
  const matchdayTableUl = document.querySelector(".matchday__list");
  matchdayTableUl.textContent = ""; // Clear existing content

  for (
    let iMatchs = 0;
    iMatchs < matchdayObject["matchdayMatchs"].length;
    iMatchs++
  ) {
    const matchObject = matchdayObject["matchdayMatchs"][iMatchs];
    const matchLi = document.createElement("li");

    matchLi.appendChild(createMatchDiv(matchObject));
    matchLi.appendChild(
      createPredictionsDiv(matchObject["predictions"], [
        [matchObject["team1"], matchObject["scoreTeam1"]],
        [matchObject["team2"], matchObject["scoreTeam2"]],
      ])
    );

    matchdayTableUl.appendChild(matchLi);
  }
};

const getPositionClassNameByIndex = (index) => {
  const names = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
  ];
  return names[index] || "default";
};

/**
 * @function completeLeaderboard
 * @description Renders the leaderboard table in the DOM using the provided player data.
 *
 * - Dynamically creates and appends table rows for each player.
 * - Displays position, name, and stats: total points, exact hits, partial hits, incorrects, and played matches.
 * - Handles shared rankings: if multiple players have identical stats, they share the same displayed position.
 * - For each row:
 *      - Applies a position-based class to the position cell:
 *          - If the reference for that position includes a custom color, a dynamic class (e.g., --custom-2) is applied.
 *          - Otherwise, a default class is applied based on position order (e.g., --first, --second, --third...).
 * - The applied classes allow styling consistency between the leaderboard table and the reference display.
 *
 * @param {Array<Object>} orderedLeaderboardPlayers - Array of player objects sorted by ranking criteria.
 *      Each player object includes: name, points, exactHits, partialHits, incorrects, playedMatches.
 * @param {Array<Object>} referencesList - Optional array of reference objects:
 *      {
 *          text: string,              // Displayed text
 *          positions: number[],       // Array of affected positions
 *          color?: string,            // Optional custom background color
 *          textColorLight?: boolean   // Optional flag for light text on dark background
 *      }
 */
const completeLeaderboard = (
  orderedLeaderboardPlayers,
  referencesList = []
) => {
  const tableBody = document.querySelector(".leaderboard__table-body");
  tableBody.innerHTML = "";

  let positionCounter = 1;
  let previous = null;

  for (let i = 0; i < orderedLeaderboardPlayers.length; i++) {
    const player = orderedLeaderboardPlayers[i];
    if (
      !(
        previous &&
        player.points === previous.points &&
        player.exactHits === previous.exactHits &&
        player.incorrects === previous.incorrects
      )
    ) {
      positionCounter = i + 1;
    }

    const tr = document.createElement("tr");

    const matchingRefIndex = referencesList.findIndex((ref) =>
      ref.positions.includes(positionCounter)
    );
    const matchingRef =
      matchingRefIndex !== -1 ? referencesList[matchingRefIndex] : null;

    let className = null;
    if (matchingRef) {
      if (matchingRef.color) {
        className = `leaderboard__position--custom-${positionCounter}`;
      } else {
        const classBase = getPositionClassNameByIndex(matchingRefIndex);
        className = `leaderboard__position--${classBase}`;
      }
    }

    const appendCell = (content, extraClass = null) => {
      const td = document.createElement("td");
      td.textContent = content;
      if (extraClass) td.classList.add(extraClass);
      tr.appendChild(td);
    };

    appendCell(positionCounter, className);
    appendCell(player.name);
    appendCell(player.points);
    appendCell(player.exactHits);
    appendCell(player.partialHits);
    appendCell(player.incorrects);
    appendCell(player.playedMatches);

    tableBody.appendChild(tr);
    previous = player;
  }
};

/**
 * @function addReferencesToLeaderboard
 * @description Dynamically renders the leaderboard references section based on the provided data.
 *
 * - Creates a <div> with class "leaderboard__references" and appends it to the leaderboard container.
 * - For each reference object:
 *      - Appends a <p> element with class "leaderboard__reference".
 *      - If a custom color is defined:
 *          - Applies it as background-color.
 *          - Dynamically generates custom BEM-based CSS classes for each referenced position (e.g., .leaderboard__position--custom-2).
 *          - Applies custom text color based on `textColorLight`.
 *      - If no custom color is defined:
 *          - Assigns a default BEM-based class (e.g., --first, --second, ...) based on the reference index.
 *          - Uses the default background and text color from the stylesheet.
 * - Supports shared references across multiple ranking positions.
 * - If the leaderboard container is not found in the DOM, the function exits silently.
 *
 * @param {Array<Object>} referencesArray - An array of reference objects, each with the structure:
 *      {
 *          text: string,             // Text to display in the reference
 *          positions: number[],      // Ranking positions this reference applies to
 *          color?: string,           // Optional custom background color (hex, rgb, etc.)
 *          textColorLight?: boolean  // Optional text color mode: true = light text, false (default) = dark text
 *      }
 */
const addReferencesToLeaderboard = (referencesArray = []) => {
  const container = document.querySelector(".leaderboard__container");
  if (!container) return;

  const div = createAndAppendElement("div", ["leaderboard__references"]);

  referencesArray.forEach((ref, i) => {
    const isCustomColor = !!ref.color;
    const useLightText = ref.textColorLight === true;
    const textColor = useLightText ? "rgba(235, 235, 235, 0.9)" : "#222";

    const classBase = isCustomColor
      ? `leaderboard__reference--custom-${i + 1}`
      : `leaderboard__reference--${getPositionClassNameByIndex(i)}`;

    const p = createAndAppendElement(
      "p",
      ["leaderboard__reference", classBase],
      div,
      ref.text
    );

    // Aplica color personalizado a referencia
    if (isCustomColor) {
      p.style.backgroundColor = ref.color;
      p.style.color = textColor;

      ref.positions.forEach((pos) => {
        const style = document.createElement("style");
        style.textContent = `
                    .leaderboard__position--custom-${pos} {
                        background-color: ${ref.color};
                        color: ${textColor};
                    }
                `;
        document.head.appendChild(style);
      });
    }
  });

  container.appendChild(div);
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
    const team1 = match["team1"];
    const team2 = match["team2"];
    const scoreTeam1 = match["scoreTeam1"];
    const scoreTeam2 = match["scoreTeam2"];
    const matchdayDate = dateFormatToCopyFormat(match["matchDate"], true);

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
      const predictionScoreTeam1 = prediction["scoreTeam1"];
      const predictionScoreTeam2 = prediction["scoreTeam2"];
      const emojiCode = predictionEmoji(
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
  copiedText += `\n${"#".padEnd(positionDigits + 1)}〡${"Nombre".padEnd(
    longestNameLength
  )}〡Pts〡AT〡AP〡Er〡PJ`;

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

    copiedText += `\n${positionStr}〡${name}〡${pts}〡${at}〡${ap}〡${e}〡${pj}`;

    previous = player;
  });

  copiedText += "\n```\n\nhttps://nicolasweibel.github.io";
  return copiedText;
};

const matchdayAndLeaderboardTextToCopy = () => {
  const copiedText = matchdayTextToCopy() + "\n\n" + leaderboardTextToCopy();
  return copiedText;
};

// ======================
// 5. EVENT HANDLERS & INIT
// ======================

const addMatchEventListeners = (matchDiv) => {
  matchDiv.addEventListener("click", () => {
    const predictionContainerDiv = matchDiv.nextElementSibling;
    const predictionArrow = matchDiv.querySelector(
      ".match__expand-predictions-arrow"
    );
    const predictionDiv = predictionContainerDiv.querySelector(".predictions");

    if (predictionContainerDiv.offsetHeight === 0) {
      predictionContainerDiv.style.height = predictionDiv.offsetHeight + "px";
      predictionArrow.classList.add("match__expand-predictions-arrow--rotate");
    } else {
      predictionContainerDiv.style.height = 0;
      predictionArrow.classList.remove(
        "match__expand-predictions-arrow--rotate"
      );
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
    rightArrowDiv.classList.remove("matchday__arrow--no-display");
    leftArrowDiv.classList.remove("matchday__arrow--no-display");
  } else if (matchdays.length === 1) {
    leftArrowDiv.classList.add("matchday__arrow--no-display");
    rightArrowDiv.classList.add("matchday__arrow--no-display");
  } else if (showedMatchdayIndex === matchdays.length - 1) {
    leftArrowDiv.classList.remove("matchday__arrow--no-display");
    rightArrowDiv.classList.add("matchday__arrow--no-display");
  } else if (showedMatchdayIndex === 0) {
    rightArrowDiv.classList.remove("matchday__arrow--no-display");
    leftArrowDiv.classList.add("matchday__arrow--no-display");
  }
};

const createSpecificMatchdayTable = (matchdayIndex) => {
  showedMatchdayIndex = matchdayIndex;
  createMatchdayTable(matchdays[matchdayIndex]);
};

const completeLeaderboardPositions = (iMatchdays, leaderboardPositions) => {
  for (const match of matchdays[iMatchdays]["matchdayMatchs"]) {
    const scoreTeam1 = match["scoreTeam1"];
    const scoreTeam2 = match["scoreTeam2"];

    if (scoreTeam1 !== "" && scoreTeam2 !== "") {
      for (const iPredictions in match["predictions"]) {
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
  isCurrentMonth,
  players,
  referencesList
) => {
  leaderboardPositions = new LeaderboardPositions(players);

  for (const iMatchdays in matchdays) {
    if (
      (isCurrentMonth && matchdays[iMatchdays]["isCurrentMatchday"]) ||
      (!isCurrentMonth && Number.parseInt(iMatchdays) === matchdays.length - 1)
    ) {
      createSpecificMatchdayTable(Number.parseInt(iMatchdays));
    }

    completeLeaderboardPositions(iMatchdays, leaderboardPositions);
  }

  leaderboardPositions.sortPositions();
  completeLeaderboard(leaderboardPositions.leaderboardPlayers, referencesList);

  if (referencesList) {
    addReferencesToLeaderboard(referencesList);
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
  matchdays = await fetchFiles(matchdayTextUrl);

  initializeMatchdayLeaderboardTable(isCurrentMonth, players, referencesList);
};

// ======================
// 6. CLIPBOARD OPERATIONS
// ======================

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

  document.getElementById("year").textContent = new Date().getFullYear();

  // const monthSelectorSelect = document.getElementById("month-select-id");
  // monthSelectorSelect.addEventListener("change", () => {
  //   window.location.href = monthSelectorSelect.value;
  // });

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
        copyInfoDiv.classList.add("action-buttons__info--green");
        copyInfoDiv.classList.remove("action-buttons__info--red");
      } else {
        copyInfoDiv.textContent =
          "No se otorgaron permisos para copiar al portapapeles.";
        copyInfoDiv.classList.add("action-buttons__info--red");
        copyInfoDiv.classList.remove("action-buttons__info--green");
      }
    } catch (error) {
      copyInfoDiv.textContent = "Ocurrió un error al copiar al portapapeles.";
      copyInfoDiv.classList.add("action-buttons__info--red");
      copyInfoDiv.classList.remove("action-buttons__info--green");
    }

    setTimeout(() => {
      copyInfoDiv.textContent = "";
    }, 1000);
  });
});
