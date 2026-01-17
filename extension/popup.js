console.log("RSVP Controls plugin loaded");

const startBtn = document.getElementById("startBtn");
startBtn.onclick = () => console.log("Start clicked");

const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.onclick = () => console.log("Pause clicked");

const replayBtn = document.getElementById("replayBtn");
replayBtn.onclick = () => console.log("Replay clicked");


const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

// 初始化
let speed = Number(speedSlider.value);
speedValue.textContent = speed;

// slider 改动事件
speedSlider.oninput = () => {
  speed = Number(speedSlider.value);
  speedValue.textContent = speed;
  console.log("Speed changed to", speed, "ms");
};
