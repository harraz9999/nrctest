const TIMER_LIMIT = 2 * 60 * 1000; 
const blocks = document.querySelectorAll('.point-block');
const totalDisplay = document.getElementById('total');
const timerDisplay = document.getElementById('timer');

// Toggle style blocks – only one active per mission
document.querySelectorAll('.mission').forEach(mission => {
  const toggleBlocks = mission.querySelectorAll('.point-block.toggle');
  toggleBlocks.forEach(block => {
    block.addEventListener('click', () => {
      toggleBlocks.forEach(b => b.classList.remove('active')); // deactivate others
      block.classList.add('active'); // activate clicked
      updateTotal();
      startTimer(); // Optional: starts timer on first interaction
    });
  });
});

// Counter style blocks
document.querySelectorAll('.point-block.counter').forEach(block => {
  const plus = block.querySelector('.plus');
  const minus = block.querySelector('.minus');
  const countElem = block.querySelector('.count');
  const max = parseInt(block.dataset.max) || 0;

  plus.addEventListener('click', (e) => {
    e.stopPropagation();
    let count = parseInt(countElem.textContent) || 0;
    if (count < max) {
      countElem.textContent = ++count;
      block.classList.add('active');
      updateTotal();
      startTimer(); // Optional
    }
  });

  minus.addEventListener('click', (e) => {
    e.stopPropagation();
    let count = parseInt(countElem.textContent) || 0;
    if (count > 0) {
      countElem.textContent = --count;
      if (count === 0) block.classList.remove('active');
      updateTotal();
    }
  });
});

function updateTotal() {
  let total = 0;
  blocks.forEach(block => {
    const pointValue = parseInt(block.dataset.points) || 0;
    if (block.classList.contains('toggle') && block.classList.contains('active')) {
      total += pointValue;
    }
    if (block.classList.contains('counter')) {
      const count = parseInt(block.querySelector('.count')?.textContent) || 0;
      total += pointValue * count;
    }
  });
  totalDisplay.textContent = total;
}

function resetScore() {
  blocks.forEach(block => {
    block.classList.remove('active');
    if (block.classList.contains('counter')) {
      const countElem = block.querySelector('.count');
      if (countElem) countElem.textContent = '0';
    }
  });
  totalDisplay.textContent = '0';
  resetTimer();
}

// Timer functionality
let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;

function updateTimerDisplay() {
  const total = elapsedTime + (Date.now() - startTime);
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
  if (!timerInterval) {
    startTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 1000);
  }
}

function stopTimer() {
  if (timerInterval) {
    elapsedTime += Date.now() - startTime;
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  elapsedTime = 0;
  timerDisplay.textContent = '00:00';
}
