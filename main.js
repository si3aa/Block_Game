"use strict";

// Select Elements
const elements = {
  splashScreen: document.querySelector(".splash"),
  splashSpan: document.querySelector(".splash span"),
  infoContainer: document.querySelector(".info-container"),
  name: document.querySelector(".info-container .name span"),
  tries: document.querySelector(".info-container .tries span"),
  blockContainer: document.querySelector(".memory-game-blocks"),
  cards: document.querySelectorAll(".memory-game-blocks .game-block"),
  restartBtn: document.querySelector("#restart-btn"),
};

// Audio Elements
const sounds = {
  victory: document.getElementById("win"),
  fail: document.getElementById("fail"),
  success: document.getElementById("success"),
};

// Constants
const DURATION = 750;
let playerName = ""; // Store player's name

// Game State
let blocks = Array.from(elements.cards);
let orderRange = Array.from(Array(blocks.length).keys());

// Initialize Game Blocks
function initializeBlocks() {
  shuffle(orderRange);
  blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
    block.addEventListener("click", () => flipBlock(block));
  });
}

// Splash Screen Setup
function setupSplashScreen() {
  elements.splashSpan.onclick = () => {
    if (!playerName) {
      playerName = prompt("Please Enter Your Name") || "Unknown";
    }
    startGame();
  };
}

// Start Game Function
function startGame() {
  elements.name.innerHTML = playerName;
  elements.tries.innerHTML = "0";
  elements.splashScreen.style.display = "none";
  elements.restartBtn.style.display = "none";
  resetGame();
}

// Flip Block Logic
function flipBlock(selectedBlock) {
  selectedBlock.classList.add("is-flipped");
  const flippedBlocks = blocks.filter(block => block.classList.contains("is-flipped"));

  if (flippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(flippedBlocks[0], flippedBlocks[1]);
  }
}

// Shuffle Algorithm
function shuffle(array) {
  let current = array.length;
  while (current > 0) {
    const random = Math.floor(Math.random() * current);
    current--;
    [array[current], array[random]] = [array[random], array[current]];
  }
  return array;
}

// Prevent Clicking
function stopClicking() {
  elements.blockContainer.classList.add("no-clicking");
  setTimeout(() => elements.blockContainer.classList.remove("no-clicking"), DURATION);
}

// Check Matches
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");
    sounds.success.play();

    if (blocks.every(block => block.classList.contains("has-match"))) {
      celebrateVictory();
    }
  } else {
    elements.tries.innerHTML = parseInt(elements.tries.innerHTML) + 1;
    sounds.fail.play();
    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, DURATION);
  }
}

// Victory Celebration
function celebrateVictory() {
  sounds.victory.play();

  const victoryMessage = document.createElement("div");
  victoryMessage.className = "victory-message";
  victoryMessage.innerHTML = `Congratulations ${playerName}! You won in ${elements.tries.innerHTML} tries!`;
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

// Restart Game
function resetGame() {
  elements.tries.innerHTML = "0";
  blocks.forEach(block => {
    block.classList.remove("has-match", "is-flipped");
  });
  shuffle(orderRange);
  blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
  });
}

// Restart Button Click Event
elements.restartBtn.addEventListener("click", () => {
  startGame(); // Restart game without asking for name again
});

// Initial Setup
setupSplashScreen();
initializeBlocks();
