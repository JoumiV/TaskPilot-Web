
const pomodoroBtn = document.getElementById('pomodoro-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const popupSound = document.getElementById('popup-sound');

let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let currentMode = 'pomodoro'; // pomodoro, shortBreak, longBreak

// Load saved state from localStorage
function loadState() {
    const savedState = JSON.parse(localStorage.getItem('pomodoroState'));
    if (savedState) {
        currentMode = savedState.mode;
        timeLeft = savedState.timeLeft;
        const elapsedTime = Math.floor((Date.now() - savedState.startTime) / 1000);
        timeLeft = Math.max(timeLeft - elapsedTime, 0);
        if (savedState.isRunning) {
            startTimer();
        }
    }
    updateButtons();
    updateTimer();
}

// Save state to localStorage
function saveState() {
    const state = {
        mode: currentMode,
        timeLeft: timeLeft,
        startTime: Date.now(),
        isRunning: isRunning,
    };
    localStorage.setItem('pomodoroState', JSON.stringify(state));
}

function updateButtons() {
    pomodoroBtn.classList.remove('active');
    shortBreakBtn.classList.remove('active');
    longBreakBtn.classList.remove('active');
    if (currentMode === 'pomodoro') pomodoroBtn.classList.add('active');
    if (currentMode === 'shortBreak') shortBreakBtn.classList.add('active');
    if (currentMode === 'longBreak') longBreakBtn.classList.add('active');
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        saveState();
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimer();
                saveState();
            } else {
                clearInterval(timer);
                isRunning = false;
                
                popupSound.play();
                switchMode();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    saveState();
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    switch (currentMode) {
        case 'pomodoro':
            timeLeft = 25 * 60;
            break;
        case 'shortBreak':
            timeLeft = 5 * 60;
            break;
        case 'longBreak':
            timeLeft = 15 * 60;
            break;
    }
    updateTimer();
    saveState();
}

function switchMode(mode) {
    if (mode) currentMode = mode;
    updateButtons();
    resetTimer();
}

pomodoroBtn.addEventListener('click', () => switchMode('pomodoro'));
shortBreakBtn.addEventListener('click', () => switchMode('shortBreak'));
longBreakBtn.addEventListener('click', () => switchMode('longBreak'));
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize
loadState();

