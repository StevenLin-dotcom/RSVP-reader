/**
 * RSVP Reader Controls
 * Uses unified playback engine and utilities
 */

// ======================
// Initialize Renderer
// ======================

const displayContainer = document.getElementById("rsvp-display");
const renderer = new RSVPRenderer(displayContainer, {
  highlightColor: '#ff6b6b',
  fontSize: '48px'
});

// ======================
// Utility Functions
// ======================

// Convert milliseconds to WPM (for speed slider that uses ms)
function msToWpm(ms) {
  return 60000 / ms;
}

// ======================
// Initialize Playback Engine
// ======================

let playerState = "idle";

const engine = new RSVPPlaybackEngine(renderer, {
  speed: msToWpm(400), // Convert initial 400ms to WPM
  onStateChange: (state) => {
    playerState = state;
    updateButtonStates();
  }
});

// ======================
// DOM Elements
// ======================

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const replayBtn = document.getElementById("replayBtn");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const textInput = document.getElementById("textInput");

// ======================
// State Management
// ======================

function updateButtonStates() {
  if (pauseBtn) {
    pauseBtn.disabled = (playerState !== "playing");
  }
}

// ======================
// Button Controls
// ======================

if (startBtn) {
  startBtn.onclick = () => {
    if (playerState === "playing") return;

    // If finished, reset first
    if (playerState === "finished") {
      engine.reset();
    }

    engine.start();
  };
}

if (pauseBtn) {
  pauseBtn.onclick = () => {
    if (playerState !== "playing") return;
    engine.pause();
  };
}

if (replayBtn) {
  replayBtn.onclick = () => {
    engine.reset();
    engine.start();
  };
}

// ======================
// Speed Control
// ======================

if (speedSlider && speedValue) {
  speedSlider.addEventListener("input", () => {
    const ms = Number(speedSlider.value); // Get current slider value (milliseconds)
    speedValue.textContent = ms;          // Update display
    const wpm = msToWpm(ms);              // Convert to WPM
    engine.setSpeed(wpm);                  // Update engine speed
  });
}

// ======================
// Text Input Handling
// ======================

if (textInput) {
  textInput.addEventListener("input", () => {
    const text = textInput.value;
    engine.loadText(text);
    engine.reset();
  });
}

// ======================
// Initialize
// ======================

// Load initial text and speed
if (textInput) {
  const initialText = textInput.value;
  if (initialText.trim().length > 0) {
    engine.loadText(initialText);
  }
}

if (speedSlider) {
  const initialMs = Number(speedSlider.value);
  engine.setSpeed(msToWpm(initialMs));
}

updateButtonStates();
