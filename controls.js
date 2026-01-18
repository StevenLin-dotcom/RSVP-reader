/* ======================
   RSVP Renderer Initialization
====================== */

const displayContainer = document.getElementById("rsvp-display");
const renderer = new RSVPRenderer(displayContainer, {
  highlightColor: '#ff6b6b',
  fontSize: '48px'
});

/* ======================
   Playback Engine (using unified engine)
====================== */

// Convert ms to WPM for the engine (400ms = 150 WPM)
function msToWpm(ms) {
  return 60000 / ms;
}

function wpmToMs(wpm) {
  return 60000 / wpm;
}

// Create engine with state change callback
const engine = new RSVPPlaybackEngine(renderer, {
  speed: msToWpm(400), // Convert initial 400ms to WPM
  onStateChange: (state) => {
    playerState = state;
    setState(state);
  }
});

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

let playerState = "idle";

function setState(newState) {
  playerState = newState;
  
  // Update button states based on player state
  if (newState === "playing") {
    pauseBtn.disabled = false;
  } else {
    pauseBtn.disabled = true;
  }
}

/* ======================
   Button Controls
====================== */

startBtn.onclick = () => {
  if (playerState === "playing") return;

  // If finished, reset first
  if (playerState === "finished") {
    engine.reset();
  }

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
    const ms = Number(speedSlider.value); // 获取当前滑块值（毫秒）
    speedValue.textContent = ms;          // 更新显示
    const wpm = msToWpm(ms);              // 转换为 WPM
    engine.setSpeed(wpm);                  // 通知 engine
  });


/* ======================
   Text Input Handling
====================== */

textInput.onchange = () => {
  const text = textInput.value;
  engine.loadText(text);
  engine.reset();
};

// Initialize with default text and speed
const initialText = textInput.value;
engine.loadText(initialText);
const initialMs = Number(speedSlider.value);
engine.setSpeed(msToWpm(initialMs));
setState("idle");
