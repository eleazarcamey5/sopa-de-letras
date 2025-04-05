const words = [
  "PARED", "CELULAR", "NUCLEO", "CLOROPLASTO", "MITOCONDRIA",
  "VACUOLA", "CITOPLASMA", "RIBOSOMA", "GOLGI", "RETICULO"
];

const solutions = {
  PARED: [77, 78, 79, 80, 81],
  CELULAR: [94, 95, 96, 97, 98, 99, 100],
  NUCLEO: [20, 21, 22, 23, 24, 25],
  CLOROPLASTO: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  MITOCONDRIA: [11, 12, 13, 14, 15, 16, 17, 18, 19, 29, 39],
  VACUOLA: [31, 32, 33, 34, 35, 36, 37],
  CITOPLASMA: [90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
  RIBOSOMA: [42, 43, 44, 45, 46, 47, 48],
  GOLGI: [60, 61, 62, 63, 64],
  RETICULO: [50, 51, 52, 53, 54, 55, 56, 57]
};

const gridLetters = [
  "C", "L", "O", "R", "O", "P", "L", "A", "S", "T",
  "A", "M", "I", "T", "O", "C", "O", "N", "D", "R",
  "N", "U", "C", "L", "E", "O", "P", "E", "Q", "X",
  "R", "V", "A", "C", "U", "O", "L", "A", "E", "C",
  "E", "B", "I", "B", "O", "S", "O", "M", "A", "D",
  "T", "E", "T", "I", "C", "U", "L", "O", "L", "F",
  "G", "O", "L", "G", "I", "A", "R", "E", "S", "Y",
  "Y", "T", "U", "S", "P", "A", "R", "E", "D", "V",
  "P", "I", "C", "I", "T", "O", "P", "L", "A", "S",
  "U", "L", "A", "R", "I", "L", "A", "Z", "M", "A"
];

const grid = document.getElementById("grid");
const wordListItems = document.querySelectorAll("#wordList li");
const finishMessage = document.getElementById("finishMessage");
const timerElement = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");
const endBtn = document.getElementById("endBtn");

let selected = [];
let foundWords = [];
let seconds = 0;
let timer;
let timerRunning = false;
let gameEnded = false;

function createGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = gridLetters[i];
    cell.dataset.index = i;
    grid.appendChild(cell);
  }
}

function clearSelection() {
  selected = [];
  document.querySelectorAll(".cell.selected").forEach(cell =>
    cell.classList.remove("selected")
  );
}

function markWord(word, indexes, found = true) {
  wordListItems.forEach(item => {
    if (item.textContent === word) {
      item.classList.add("found");
    }
  });
  indexes.forEach(i => {
    const cell = grid.children[i];
    cell.classList.add(found ? "found-letter" : "missed-letter");
  });
}

function checkWin() {
  if (foundWords.length === words.length) {
    finishMessage.textContent = "🎉 ¡Has encontrado todas las palabras!";
    finishMessage.classList.remove("hidden");
    stopTimer();
    gameEnded = true;
  }
}

function getSelectedWordAndIndexes() {
  const selectedIndexes = selected.map(i => parseInt(i));
  const selectedLetters = selectedIndexes.map(i => gridLetters[i]).join("");
  const reversed = selectedLetters.split("").reverse().join("");
  return { selectedIndexes, selectedLetters, reversed };
}

grid.addEventListener("click", (e) => {
  if (gameEnded || !timerRunning) return;
  if (e.target.classList.contains("cell")) {
    const idx = e.target.dataset.index;
    if (selected.includes(idx)) {
      selected = selected.filter(i => i !== idx);
      e.target.classList.remove("selected");
    } else {
      selected.push(idx);
      e.target.classList.add("selected");
    }

    const { selectedIndexes, selectedLetters, reversed } = getSelectedWordAndIndexes();
    for (const word of words) {
      if ((selectedLetters === word || reversed === word) && !foundWords.includes(word)) {
        foundWords.push(word);
        markWord(word, selectedIndexes, true);
        clearSelection();
        checkWin();
        break;
      }
    }
  }
});

function startTimer() {
  timerRunning = true;
  timer = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    timerElement.textContent = `⏱ Tiempo: ${mins}:${secs}`;

    if (seconds >= 180 && !gameEnded) {
      finishGame("⏰ ¡Tiempo agotado! Estas eran las respuestas:");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timerRunning = false;
}

function finishGame(message) {
  stopTimer();
  gameEnded = true;
  finishMessage.textContent = message;
  finishMessage.classList.remove("hidden");
  for (const word of words) {
    if (!foundWords.includes(word)) {
      markWord(word, solutions[word], false);
    }
  }
}

restartBtn.addEventListener("click", () => {
  foundWords = [];
  selected = [];
  gameEnded = false;
  seconds = 0;
  finishMessage.classList.add("hidden");
  wordListItems.forEach(item => item.classList.remove("found"));
  createGrid();
  clearInterval(timer);
  timerElement.textContent = "⏱ Tiempo: 00:00";
  startTimer();
});

pauseBtn.addEventListener("click", () => {
  if (timerRunning) {
    stopTimer();
    pauseBtn.textContent = "▶ Reanudar";
  } else {
    startTimer();
    pauseBtn.textContent = "⏸ Pausar";
  }
});

endBtn.addEventListener("click", () => {
  if (!gameEnded) {
    finishGame("🛑 Juego terminado. Estas eran las respuestas:");
  }
});

// Inicializar juego
createGrid();
startTimer();
