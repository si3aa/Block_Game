"use strict";
// Select Elements
const splashScreen = document.querySelector(".splash");
const splashSpan = document.querySelector(".splash span");
const infoContainer = document.querySelector(".info-container");
const name = document.querySelector(".info-container .name span");
const tries = document.querySelector(".info-container .tries span");
const blockContainer = document.querySelectorAll(".memory-game-blocks");
const cards = document.querySelectorAll(".memory-game-blocks .game-block");

splashSpan.onclick = function () {
  let yourName = prompt("Please Enter Your Name");
  if (yourName == null || yourName == "") {
    name.innerHTML = "Unknown";
  } else {
    name.innerHTML = yourName;
  }
  //document.querySelector(".splash").style.display = "none";
  //document.querySelector(".info-container").style.display = "flex";
  splashScreen.remove();
};
let duration = 1000;
// Create Array From Game Blocks
let blocks = Array.from(cards);
// let orderRange = [...Array(blocks.length).keys()];
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
  // Add Class is-flipped
  selectedBlock.classList.add("is-flipped");

  // Collect All Flipped Cards
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );
  // If Theres Two Selected Blocks
  if (allFlippedBlocks.length === 2) {
    // console.log('Two Flipped Blocks Selected');

    // Stop Clicking Function
    stopClicking();

    // Check Matched Block Function
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// Shuffle Function
function shuffle(array) {
  // Settings Vars
  let current = array.length,
    temp,
    random;
  while (current > 0) {
    // Get Random Number
    random = Math.floor(Math.random() * current);
    // Decrease Length By One
    current--;
    // [1] Save Current Element in Stash
    temp = array[current];

    // [2] Current Element = Random Element
    array[current] = array[random];

    // [3] Random Element = Get Element From Stash
    array[random] = temp;
  }
  return array;
}
