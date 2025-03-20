"use strict";
const splashScreen = document.querySelector(".splash");
const splashSpan = document.querySelector(".splash span");
const infoContainer = document.querySelector(".info-container");
const name = document.querySelector(".info-container .name span");

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
