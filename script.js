let timer = null;
let isRunning = false;
let isBreak = false;
let minutes = 25;
let seconds = 0;
let breakTimeout = null;
let timeLeft;
let initialTime;

// DOM Elements
const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status");
const audio = document.getElementById("bg-audio");
const alarm = new Audio("audio/alarm.mp3");
const clickSound = new Audio("audio/click.mp3");
const soundSelect = document.getElementById("sound-select");
const characterImg = document.getElementById("character");
const progressBar = document.getElementById("progressBar");

const characters = [
  "images/char1.png",
  "images/char2.png",
  "images/char3.png",
  "images/char4.png",
  "images/char5.png"
];
let charIndex = 0;

function updateDisplay() {
  if (timerDisplay) {
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

function updateProgressBar() {
  if (!progressBar) return;

  const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = (currentSeconds / totalSeconds) * 100;

  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", progress);
}

function tick() {
  if (minutes === 0 && seconds === 0) {
    clearInterval(timer);
    if (audio) audio.pause();

    // Play click sound as a simple notification
    clickSound.currentTime = 0;
    clickSound.volume = 1.0;
    clickSound.play().catch(e => console.error('Error playing click:', e));

    if (!isBreak) {
      if (statusText) statusText.textContent = "Break time! ☕";
      isRunning = false;
      startBreak(); // Start break immediately
    } else {
      if (statusText) statusText.textContent = "Focus Time!!";
      isRunning = false;
      resetTimer(); // Reset immediately
    }
    return;
  }

  if (seconds === 0) {
    minutes--;
    seconds = 59;
  } else {
    seconds--;
  }
  updateDisplay();
  updateProgressBar();
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    if (statusText) statusText.textContent = isBreak ? "Break mode 🧘" : "Focus mode! 🔥";
    timer = setInterval(tick, 1000);
    if (audio && audio.src) {
      audio.play().catch(e => console.error('Error playing audio:', e));
    }
  }
}

function startBreak() {
  clearInterval(timer);
  clearTimeout(breakTimeout);

  isBreak = true;
  minutes = 5;
  seconds = 0;
  updateDisplay();
  updateProgressBar();

  startTimer();

  if (statusText) statusText.textContent = "Break mode 🧘";
  if (audio && audio.src) {
    audio.play().catch(e => console.error('Error playing audio:', e));
  }
}

function pauseTimer() {
  clearInterval(timer);
  clearTimeout(breakTimeout);
  isRunning = false;
  if (statusText) statusText.textContent = "Paused ⏸️";
  if (audio) audio.pause();
}

function resetTimer() {
  clearInterval(timer);
  clearTimeout(breakTimeout);
  isRunning = false;
  isBreak = false;
  minutes = 25;
  seconds = 0;
  updateDisplay();
  updateProgressBar();
  const status = document.getElementById('status');
  status.className = '';
  status.textContent = "Let's focus!";
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

function changeCharacter(direction) {
  charIndex = (charIndex + direction + characters.length) % characters.length;
  if (characterImg) {
    characterImg.src = characters[charIndex];
  }
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeLabel = document.querySelector('.theme-label');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'night') {
  body.classList.add('night-mode');
  if (themeToggle) themeToggle.checked = true;
  if (themeLabel) themeLabel.textContent = 'Day Mode';
} else {
  if (themeLabel) themeLabel.textContent = 'Night Mode';
}

// Theme toggle event listener
if (themeToggle) {
  themeToggle.addEventListener('change', () => {
    playClickSound();
    if (themeToggle.checked) {
      body.classList.add('night-mode');
      localStorage.setItem('theme', 'night');
      if (themeLabel) themeLabel.textContent = 'Day Mode';
    } else {
      body.classList.remove('night-mode');
      localStorage.setItem('theme', 'day');
      if (themeLabel) themeLabel.textContent = 'Night Mode';
    }
  });
}

// Function to play click sound
function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.volume = 1.0;
  clickSound.play().catch(e => console.error('Error playing click sound:', e));
}

// Add event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {
  // Preload all audio files
  alarm.load();
  clickSound.load();

  // Test play and immediately pause to ensure audio is loaded
  Promise.all([
    alarm.play().then(() => {
      alarm.pause();
      alarm.currentTime = 0;
    }),
    clickSound.play().then(() => {
      clickSound.pause();
      clickSound.currentTime = 0;
    })
  ]).catch(e => console.error('Error preloading sounds:', e));

  // Timer controls
  const startBtn = document.getElementById("start");
  const pauseBtn = document.getElementById("pause");
  const resetBtn = document.getElementById("reset");
  const closeBtn = document.getElementById("close-btn");

  // Character navigation
  const prevBtn = document.getElementById("prev-character");
  const nextBtn = document.getElementById("next-character");

  // Add event listeners with click sound
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      playClickSound();
      startTimer();
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      playClickSound();
      pauseTimer();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      playClickSound();
      resetTimer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      playClickSound();
      window.close();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      playClickSound();
      changeCharacter(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      playClickSound();
      changeCharacter(1);
    });
  }

  // Sound selection
  if (soundSelect) {
    soundSelect.addEventListener("change", () => {
      playClickSound();
      const selectedSound = soundSelect.value;
      if (audio) {
        if (selectedSound === "none") {
          audio.pause();
          audio.src = "";
        } else {
          audio.src = `audio/${selectedSound}.mp3`;
          if (isRunning) {
            audio.play().catch(e => console.error('Error playing audio:', e));
          }
        }
      }
    });
  }

  // Initialize display
  updateDisplay();
  updateProgressBar();
});

// Add error handling for audio loading
alarm.addEventListener('error', (e) => {
  console.error('Error loading alarm sound:', e);
});
