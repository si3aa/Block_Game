"use strict";

// DOM Elements
const elements = {
  splashScreen: document.querySelector(".splash"),
  splashSpan: document.querySelector(".splash span"),
  infoContainer: document.querySelector(".info-container"),
  name: document.querySelector(".info-container .name span"),
  tries: document.querySelector(".info-container .tries span"),
  remainingTries: document.querySelector(
    ".info-container .remaining-tries span"
  ),
  blockContainer: document.querySelector(".memory-game-blocks"),
  cards: document.querySelectorAll(".memory-game-blocks .game-block"),
  restartBtn: document.querySelector("#restart-btn"),
};

// Audio Elements
const sounds = {
  victory: document.getElementById("win"),
  fail: document.getElementById("fail"),
  success: document.getElementById("success"),
  gameOver: document.getElementById("game-over"),
};

// Constants
const DURATION = 750;
const MAX_TRIES = 20;

// Game State
const gameState = {
  blocks: Array.from(elements.cards),
  orderRange: null,
  playerName: "",
};

// Game Over Screen
const gameOverScreen = createGameOverScreen();

// Initialize Game
function initializeGame() {
  gameState.orderRange = Array.from(Array(gameState.blocks.length).keys());
  setupSplashScreen();
  initializeBlocks();
}

// Create Game Over Screen
function createGameOverScreen() {
  const screen = document.createElement("div");
  screen.className = "game-over-screen";
  screen.innerHTML = `
    <div class="game-over-message">
      <h2>Game Over</h2>
      <p>You reached ${MAX_TRIES} wrong tries!</p>
      <button id="try-again-btn" class="btn btn-primary">Try Again</button>
    </div>
  `;
  screen.style.display = "none";
  document.body.appendChild(screen);
  screen.querySelector("#try-again-btn").addEventListener("click", startGame);
  return screen;
}

// Setup Splash Screen
function setupSplashScreen() {
  elements.splashSpan.onclick = () => {
    gameState.playerName = prompt("Please Enter Your Name") || "Unknown";
    startGame();
  };
}

// Initialize Blocks
function initializeBlocks() {
  shuffle(gameState.orderRange);
  gameState.blocks.forEach((block, index) => {
    block.style.order = gameState.orderRange[index];
    block.removeEventListener("click", flipBlockHandler);
    block.addEventListener("click", flipBlockHandler);
  });
}

// Flip Block Handler
function flipBlockHandler() {
  flipBlock(this);
}

// Flip Block Logic
function flipBlock(selectedBlock) {
  selectedBlock.classList.add("is-flipped");
  const flippedBlocks = gameState.blocks.filter((block) =>
    block.classList.contains("is-flipped")
  );

  if (flippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(flippedBlocks[0], flippedBlocks[1]);
  }
}

// Shuffle Algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Prevent Clicking
function stopClicking() {
  elements.blockContainer.classList.add("no-clicking");
  setTimeout(
    () => elements.blockContainer.classList.remove("no-clicking"),
    DURATION
  );
}

// Check Matches
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    handleMatch(firstBlock, secondBlock);
  } else {
    handleMismatch(firstBlock, secondBlock);
  }
}

// Handle Successful Match
function handleMatch(firstBlock, secondBlock) {
  firstBlock.classList.add("has-match");
  secondBlock.classList.add("has-match");
  firstBlock.classList.remove("is-flipped");
  secondBlock.classList.remove("is-flipped");
  sounds.success?.play();

  if (
    gameState.blocks.every((block) => block.classList.contains("has-match"))
  ) {
    celebrateVictory();
  }
}

// Handle Mismatch
function handleMismatch(firstBlock, secondBlock) {
  const currentTries = parseInt(elements.tries.innerHTML) + 1;
  const remainingTries = MAX_TRIES - currentTries;

  elements.tries.innerHTML = currentTries;
  elements.remainingTries.innerHTML = remainingTries;

  sounds.fail?.play();
  checkGameOver();

  setTimeout(() => {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");
  }, DURATION);
}

// Check Game Over
function checkGameOver() {
  if (parseInt(elements.remainingTries.innerHTML) <= 0) {
    stopGame();
  }
}

// Stop Game
function stopGame() {
  elements.blockContainer.classList.add("no-clicking");
  gameOverScreen.style.display = "flex";
  sounds.gameOver?.play();
}

// Victory Celebration
function celebrateVictory() {
  sounds.victory?.play();

  const victoryMessage = document.createElement("div");
  victoryMessage.className = "victory-message";
  victoryMessage.innerHTML = `Congratulations ${gameState.playerName}! You won in ${elements.tries.innerHTML} tries!`;
  document.body.appendChild(victoryMessage);

  for (let i = 0; i < 100; i++) {
    createConfetti();
  }

  setTimeout(() => {
    victoryMessage.remove();
    elements.restartBtn.style.display = "block";
  }, 5000);
}

// Create Confetti
function createConfetti() {
  const confetti = document.createElement("div");
  confetti.className = "confetti";
  confetti.style.left = `${Math.random() * 100}vw`;
  confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
  confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 4000);
}

// Reset Game State
function resetGame() {
  elements.tries.innerHTML = "0";
  elements.remainingTries.innerHTML = MAX_TRIES;
  elements.blockContainer.classList.remove("no-clicking");
  gameState.blocks.forEach((block) => {
    block.classList.remove("has-match", "is-flipped");
  });
  shuffle(gameState.orderRange);
  gameState.blocks.forEach((block, index) => {
    block.style.order = gameState.orderRange[index];
  });
}

// Start Game
function startGame() {
  elements.name.innerHTML = gameState.playerName;
  elements.splashScreen.style.display = "none";
  elements.restartBtn.style.display = "none";
  gameOverScreen.style.display = "none";
  resetGame();
}

// Event Listeners
elements.restartBtn.addEventListener("click", startGame);

// Start the game
initializeGame();
