let timer;
let isRunning = false;
let isBreak = false;
let minutes = 25;
let seconds = 0;
let breakTimeout;

// DOM Elements
const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status");
const audio = document.getElementById("bg-audio");
const alarm = new Audio("audio/click.mp3");
const soundSelect = document.getElementById("sound-select");
const characterImg = document.getElementById("character");
const progressBar = document.getElementById("progressBar");

// Add error handling for audio
alarm.addEventListener('error', (e) => {
  console.error('Error loading alarm sound:', e);
});

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
    try {
      alarm.play().catch(e => console.error('Error playing alarm:', e));
    } catch (e) {
      console.error('Error with alarm:', e);
    }
    if (!isBreak) {
      if (statusText) statusText.textContent = "Break time! ☕";
      clearTimeout(breakTimeout);
      breakTimeout = setTimeout(() => startBreak(), 2000);
    } else {
      if (statusText) statusText.textContent = "Focus Time!!";
      clearTimeout(breakTimeout);
      breakTimeout = setTimeout(() => resetTimer(), 2000);
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
  isBreak = true;
  minutes = 5;
  seconds = 0;
  updateDisplay();
  updateProgressBar();
  startTimer();
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
  if (statusText) statusText.textContent = "Let's focus!";
  if (audio) audio.pause();
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
  const clickSound = document.getElementById("click-sound");
  if (clickSound) {
    clickSound.currentTime = 0; // Reset the audio to the beginning
    clickSound.play().catch(e => console.error('Error playing click sound:', e));
  }
}

// Add event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {
  // Preload audio files
  const clickSound = document.getElementById("click-sound");
  if (clickSound) {
    clickSound.load();
    // Test play and immediately pause to ensure it's loaded
    clickSound.play().then(() => {
      clickSound.pause();
      clickSound.currentTime = 0;
    }).catch(e => console.error('Error preloading click sound:', e));
  }

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

// Task Tracker
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const tasksList = document.getElementById('tasks');
const closePanelBtn = document.querySelector('.close-panel');
const taskManagerPanel = document.querySelector('.side-panel');

// Session History
const todaySessions = document.getElementById('today-sessions');
const weekSessions = document.getElementById('week-sessions');
const totalSessions = document.getElementById('total-sessions');
const recentSessions = document.getElementById('recent-sessions');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let sessions = JSON.parse(localStorage.getItem('sessions')) || [];

// Initialize task list
function initializeTasks() {
  tasksList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskItem = createTaskElement(task, index);
    tasksList.appendChild(taskItem);
  });
}

// Create task element
function createTaskElement(task, index) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTask(index));

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-task';
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.addEventListener('click', () => deleteTask(index));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// Add new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({
      text: taskText,
      completed: false,
      date: new Date().toISOString()
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    initializeTasks();
    onTaskChange();
  }
}

// Toggle task completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  tasks[index].date = new Date().toISOString();
  localStorage.setItem('tasks', JSON.stringify(tasks));
  initializeTasks();
  onTaskChange();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  initializeTasks();
}

// Session History
function updateSessionHistory() {
  const today = new Date().toDateString();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const todayCount = sessions.filter(session =>
    new Date(session.date).toDateString() === today
  ).length;

  const weekCount = sessions.filter(session =>
    new Date(session.date) >= weekStart
  ).length;

  todaySessions.textContent = todayCount;
  weekSessions.textContent = weekCount;
  totalSessions.textContent = sessions.length;

  updateRecentSessions();
}

function updateRecentSessions() {
  recentSessions.innerHTML = '';
  const recent = sessions.slice(-5).reverse();

  recent.forEach(session => {
    const li = document.createElement('li');
    li.className = 'session-item';
    const date = new Date(session.date);
    li.textContent = `${date.toLocaleTimeString()} - ${session.duration} minutes`;
    recentSessions.appendChild(li);
  });
}

function addSession(duration) {
  sessions.push({
    date: new Date().toISOString(),
    duration: duration
  });
  localStorage.setItem('sessions', JSON.stringify(sessions));
  updateSessionHistory();
  onSessionChange();
}

// Panel Toggle
closePanelBtn.addEventListener('click', () => {
  taskManagerPanel.classList.toggle('hidden');
});

// Initialize panel as visible
taskManagerPanel.classList.remove('hidden');

// Add event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initialize
initializeTasks();
updateSessionHistory();

// Modify existing timer completion code to add session
function onTimerComplete() {
  // ... existing completion code ...
  addSession(25); // Add 25-minute session
  updateAnalytics(); // Add analytics update
}

// Mini Stats Elements
const mostCompletedTask = document.getElementById('most-completed-task');
const focusStreak = document.getElementById('focus-streak');
const motivationalQuote = document.getElementById('motivational-quote');

// Motivational Quotes
const quotes = [
  "Every minute counts! ⏰",
  "Stay focused, you're doing great! 💪",
  "One step at a time, you've got this! 🚀",
  "Your future self will thank you! 🌟",
  "Keep going, you're making progress! 🌈",
  "Small steps lead to big achievements! 🎯",
  "Focus is your superpower! 🦸‍♂️",
  "You're closer than you think! 🎉",
  "Every session counts! 📈",
  "Stay in the zone! 🎯"
];

// Update Mini Stats
function updateMiniStats() {
  updateMostCompletedTask();
  updateFocusStreak();
  updateMotivationalQuote();
}

// Update Most Completed Task
function updateMostCompletedTask() {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const weeklyTasks = tasks.filter(task => {
    const taskDate = new Date(task.date || new Date());
    return taskDate >= weekStart;
  });

  const taskCounts = {};
  weeklyTasks.forEach(task => {
    if (task.completed) {
      taskCounts[task.text] = (taskCounts[task.text] || 0) + 1;
    }
  });

  const mostCompleted = Object.entries(taskCounts)
    .sort((a, b) => b[1] - a[1])[0];

  if (mostCompleted) {
    mostCompletedTask.textContent = `${mostCompleted[0]} (${mostCompleted[1]} times)`;
  } else {
    mostCompletedTask.textContent = "No tasks completed this week";
  }
}

// Update Focus Streak
function updateFocusStreak() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const hasSession = sessions.some(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === currentDate.getTime();
    });

    if (!hasSession) break;

    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  focusStreak.textContent = `${streak} ${streak === 1 ? 'day' : 'days'}`;
}

// Update Motivational Quote
function updateMotivationalQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  motivationalQuote.textContent = quotes[randomIndex];
}

// Initialize Mini Stats
updateMiniStats();

// Update Mini Stats when tasks or sessions change
function onTaskChange() {
  updateMostCompletedTask();
  updateAnalytics(); // Add analytics update
}

function onSessionChange() {
  updateFocusStreak();
}

// Update quote every hour
setInterval(updateMotivationalQuote, 3600000);

// Task Manager Toggle
const taskManagerToggle = document.getElementById('task-manager-toggle');

taskManagerToggle.addEventListener('click', () => {
  taskManagerPanel.classList.toggle('hidden');
  // Update button text based on panel state
  const isHidden = taskManagerPanel.classList.contains('hidden');
  taskManagerToggle.innerHTML = `<i class="fas fa-tasks"></i> ${isHidden ? 'Show' : 'Hide'} Task Manager`;
});

// Analytics Dashboard
const weeklyChart = new Chart(document.getElementById('weekly-chart'), {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Pomodoro Sessions',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: '#ffcdd2',
      borderColor: '#e91e63',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});

const taskChart = new Chart(document.getElementById('task-chart'), {
  type: 'doughnut',
  data: {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4caf50', '#ff9800', '#f44336']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetTab = button.getAttribute('data-tab');

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(`${targetTab}-tab`).classList.add('active');
  });
});

// Particle Background
function createParticles() {
  const dragArea = document.getElementById('drag-area');
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    dragArea.appendChild(particle);

    // Animate particle
    setInterval(() => {
      particle.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;
    }, 2000);
  }
}

// Character Animation
const character = document.querySelector('.character');
let lastBlink = Date.now();

function updateCharacterAnimation() {
  const now = Date.now();

  if (now - lastBlink > 5000) {
    character.classList.remove('idle', 'blink', 'dance');
    character.classList.add('blink');
    setTimeout(() => {
      character.classList.remove('blink');
      character.classList.add('idle');
    }, 300);
    lastBlink = now;
  }

  if (isBreak) {
    character.classList.remove('idle');
    character.classList.add('dance');
  } else {
    character.classList.remove('dance');
    character.classList.add('idle');
  }
}

// Update Analytics
function updateAnalytics() {
  // Update weekly chart
  const today = new Date().getDay();
  const sessions = weeklyChart.data.datasets[0].data;
  sessions[today] = (sessions[today] || 0) + 1;
  weeklyChart.update();

  // Update task chart
  const tasks = document.querySelectorAll('.task-item');
  const completed = Array.from(tasks).filter(task => task.classList.contains('completed')).length;
  const inProgress = Array.from(tasks).filter(task => task.classList.contains('in-progress')).length;
  const pending = tasks.length - completed - inProgress;

  taskChart.data.datasets[0].data = [completed, inProgress, pending];
  taskChart.update();

  // Update stats
  const totalFocusTime = completed * 25; // Assuming 25 minutes per completed task
  document.getElementById('avg-focus-time').textContent = `${Math.round(totalFocusTime / (completed || 1))} min`;
  document.getElementById('completion-rate').textContent = `${Math.round((completed / (tasks.length || 1)) * 100)}%`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  setInterval(updateCharacterAnimation, 1000);

  // Update analytics initially
  updateAnalytics();

  // Update analytics every minute
  setInterval(updateAnalytics, 60000);
});
