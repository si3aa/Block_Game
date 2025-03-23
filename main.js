"use strict";

// Select Elements
const splashScreen = document.querySelector(".splash");
const splashSpan = document.querySelector(".splash span");
const infoContainer = document.querySelector(".info-container");
const name = document.querySelector(".info-container .name span");
const tries = document.querySelector(".info-container .tries span");
const blockContainer = document.querySelector(".memory-game-blocks"); 
const cards = document.querySelectorAll(".memory-game-blocks .game-block");

splashSpan.onclick = function () {
  let yourName = prompt("Please Enter Your Name");
  if (yourName == null || yourName == "") {
    name.innerHTML = "Unknown";
  } else {
    name.innerHTML = yourName;
  }
  splashScreen.remove();
};

const duration = 750; 

// Create Array From Game Blocks
let blocks = Array.from(cards);
let orderRange = Array.from(Array(blocks.length).keys());
shuffle(orderRange);

// Add Order Css Property To Game Blocks
blocks.forEach((block, index) => {
  block.style.order = orderRange[index];
  block.addEventListener("click", () => {
    flipBlock(block);
  });
});

// Flip Block Function
function flipBlock(selectedBlock) {
  selectedBlock.classList.add("is-flipped");

  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );

  if (allFlippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// Shuffle Function
function shuffle(array) {
  let current = array.length,
    temp,
    random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
  return array;
}

// Stop Clicking Function
function stopClicking() {
  blockContainer.classList.add("no-clicking");
  setTimeout(() => {
    blockContainer.classList.remove("no-clicking");
  }, duration);
}

// Check Matched Blocks Function
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");
  } else {
    tries.innerHTML = parseInt(tries.innerHTML) + 1;
    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);
  }
}