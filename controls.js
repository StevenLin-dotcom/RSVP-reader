console.log("Controls loaded");

/* ======================
   Player State
====================== */

let playerState = "idle";
// possible: idle | playing | paused

/* ======================
   Fake Engine (stub)
   later replaced by real engine
====================== */

const engine = {
  start() {
    console.log("ENGINE → start");
  },

  pause() {
    console.log("ENGINE → pause");
  },

  reset() {
    console.log("ENGINE → reset");
  },

  setSpeed(ms) {
    console.log("ENGINE → speed set to", ms);
  },

  loadText(words) {
    console.log("ENGINE → text loaded:", words);
  }
};

/* ======================
   DOM Elements
====================== */

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const replayBtn = document.getElementById("replayBtn");

const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

const textInput = document.getElementById("textInput");

/* ======================
   Helpers
====================== */

function parseText(text) {
  return text.trim().split(/\s+/);
}

function setState(newState) {
  playerState = newState;
  console.log("STATE →", playerState);
}

/* ======================
   Button Controls
====================== */

startBtn.onclick = () => {
  if (playerState === "playing") return;

  engine.start();
  setState("playing");
};

pauseBtn.onclick = () => {
  if (playerState !== "playing") return;

  engine.pause();
  setState("paused");
};

replayBtn.onclick = () => {
  engine.reset();
  engine.start();
  setState("playing");
};

/* ======================
   Speed Control
====================== */

speedSlider.addEventListener("input", () => {
    const ms = Number(speedSlider.value); // 获取当前滑块值
    speedValue.textContent = ms;          // 更新显示
    engine.setSpeed(ms);                   // 通知 engine
  });


/* ======================
   Text Input Handling
====================== */

textInput.onchange = () => {
  const words = parseText(textInput.value);
  engine.reset();
  engine.loadText(words);
  setState("idle");
};
