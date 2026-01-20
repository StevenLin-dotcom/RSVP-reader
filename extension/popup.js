/**
 * RSVP Reader Extension - Popup Controller
 * Uses unified playback engine and utilities
 */

// ======================
// Initialize Renderer
// ======================

const container = document.getElementById('rsvp-display');
const renderer = new RSVPRenderer(container, {
  highlightColor: '#ff6b6b',
  fontSize: '36px'
});

// ======================
// Initialize Playback Engine
// ======================

let playerState = "idle";

const engine = new RSVPPlaybackEngine(renderer, {
  speed: 300, // Initial WPM
  onStateChange: (state) => {
    playerState = state;
    updateButtonStates();
    updateStatusDisplay();
  },
  onWordUpdate: (word) => {
    updateWordInfo(word, renderer, document.getElementById('word-info'));
  }
});

// ======================
// State Management
// ======================

function updateStatusDisplay() {
  const statusText = document.getElementById('statusText');
  if (statusText) {
    statusText.textContent = playerState;
    statusText.style.color = 
      playerState === 'playing' ? '#0066cc' :
      playerState === 'paused' ? '#ff9900' :
      playerState === 'finished' ? '#00cc66' : '#666';
  }
}

function updateButtonStates() {
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  
  if (startBtn) {
    startBtn.disabled = (playerState === "playing");
  }
  if (pauseBtn) {
    pauseBtn.disabled = (playerState !== "playing");
  }
}

function resetPlayback() {
  if (playerState === "playing" || playerState === "paused") {
    engine.pause();
  }
  engine.reset();
}

// ======================
// Button Controls
// ======================

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const replayBtn = document.getElementById('replayBtn');

if (startBtn) {
  startBtn.onclick = () => {
    if (playerState === "playing") {
      return;
    }
    // If finished, reset first
    if (playerState === "finished") {
      engine.reset();
    }
    engine.start();
  };
}

if (pauseBtn) {
  pauseBtn.onclick = () => {
    if (playerState !== "playing") {
      return;
    }
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

const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

if (speedSlider && speedValue) {
  // Initialize display
  const initialWpm = Number(speedSlider.value);
  speedValue.textContent = initialWpm;
  engine.setSpeed(initialWpm);

  // Throttle speed updates to avoid too frequent interval recreation
  let speedUpdateTimeout = null;
  speedSlider.addEventListener('input', () => {
    const wpm = Number(speedSlider.value);
    speedValue.textContent = wpm;
    
    // Clear pending update
    if (speedUpdateTimeout) {
      clearTimeout(speedUpdateTimeout);
    }
    
    // Update speed with a small delay to batch rapid changes
    speedUpdateTimeout = setTimeout(() => {
      engine.setSpeed(wpm);
      speedUpdateTimeout = null;
    }, 50); // 50ms throttle
  });
}

// ======================
// Text Input Handling
// ======================

const textInput = document.getElementById('textInput');
if (textInput) {
  textInput.addEventListener('input', () => {
    const text = textInput.value;
    resetPlayback();
    if (text.trim().length > 0) {
      engine.loadText(text);
    }
  });
}

// ======================
// File Input Handling
// ======================

const fileInput = document.getElementById('fileInput');
if (fileInput) {
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Only accept text files
    if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
      alert("Please select a text file (.txt)");
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const fileContent = e.target.result;
      
      // Reset playback and load new text
      resetPlayback();
      
      // Update text input with file content
      if (textInput) {
        textInput.value = fileContent;
      }
      
      if (fileContent.trim().length > 0) {
        engine.loadText(fileContent);
      }
    };

    reader.onerror = () => {
      alert("Error reading file");
      fileInput.value = "";
    };

    reader.readAsText(file);
  });
}

// ======================
// Initialize
// ======================

updateButtonStates();
updateStatusDisplay();

// Load initial text
if (textInput) {
  const initialText = textInput.value || "The quick brown fox jumps over the lazy dog.";
  if (initialText.trim().length > 0) {
    engine.loadText(initialText);
  }
}
