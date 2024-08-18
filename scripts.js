document.addEventListener('DOMContentLoaded', () => {
    const lettersButton = document.getElementById('generate-letters');
    const numbersButton = document.getElementById('generate-numbers');
    const lettersOutput = document.getElementById('letters-output');
    const numbersOutput = document.getElementById('numbers-output');
    const targetOutput = document.getElementById('target-output');
    const timerOutput = document.getElementById('timer');
    const timerSlider = document.getElementById('timer-slider');
    const timerValue = document.getElementById('timer-value');
    const resetTimerButton = document.getElementById('reset-timer');
    const addPlayerButton = document.getElementById('add-player');
    const scoreboardTable = document.getElementById('scoreboard-table');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const switchNlButton = document.getElementById('switch-nl');
    const switchFrButton = document.getElementById('switch-fr');

    let timerInterval;
    let timeLeft = parseInt(timerSlider.value);
    let isTimerRunning = false;
    let currentLanguage = 'NL';

    const letterDistributions = {
        'NL': {
            'A': 7.49, 'B': 1.58, 'C': 1.24, 'D': 5.93, 'E': 18.91,
            'F': 0.81, 'G': 3.40, 'H': 2.38, 'I': 6.50, 'J': 1.46,
            'K': 2.25, 'L': 3.57, 'M': 2.21, 'N': 10.03, 'O': 6.06,
            'P': 1.57, 'Q': 0.01, 'R': 6.41, 'S': 3.73, 'T': 6.79,
            'U': 1.99, 'V': 2.85, 'W': 1.52, 'X': 0.04, 'Y': 0.03,
            'Z': 1.39
        },
        'FR': {
            'A': 7.636, 'B': 0.901, 'C': 3.260, 'D': 3.669, 'E': 14.715,
            'F': 1.066, 'G': 0.866, 'H': 0.737, 'I': 7.529, 'J': 0.545,
            'K': 0.049, 'L': 5.456, 'M': 2.968, 'N': 7.095, 'O': 5.378,
            'P': 3.021, 'Q': 1.362, 'R': 6.553, 'S': 7.948, 'T': 7.244,
            'U': 6.311, 'V': 1.628, 'W': 0.114, 'X': 0.387, 'Y': 0.308,
            'Z': 0.136
        }
    };

    const generateLetters = () => {
        let result = '';
        for (let i = 0; i < 9; i++) {
            result += weightedRandom(letterDistributions[currentLanguage]) + ' ';
        }
        lettersOutput.textContent = result.trim();
        resetTimer();
    };

    const generateNumbers = () => {
        let numbers = [];
        for (let i = 0; i < 6; i++) {
            if (i < 4) {
                numbers.push(Math.floor(Math.random() * 10) + 1);
            } else {
                numbers.push((Math.floor(Math.random() * 4) + 1) * 25);
            }
        }
        const target = Math.floor(Math.random() * 900) + 100;
        numbersOutput.textContent = numbers.join(' ');
        targetOutput.textContent = `Target: ${target}`;
        resetTimer();
    };

    const resetTimer = () => {
        clearInterval(timerInterval);
        timeLeft = parseInt(timerSlider.value);
        timerOutput.textContent = `Timer: ${timeLeft}`;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerOutput.textContent = `Timer: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showModal();
            }
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
    };

    const weightedRandom = (distribution) => {
        let total = 0;
        for (let key in distribution) {
            total += distribution[key];
        }
        let threshold = Math.random() * total;
        total = 0;
        for (let key in distribution) {
            total += distribution[key];
            if (total >= threshold) {
                return key;
            }
        }
    };

    const updateScores = () => {
        const playerRows = document.querySelectorAll('.player-row');
        playerRows.forEach(row => {
            const scoreCell = row.querySelector('.player-score');
            const incrementButton = row.querySelector('.increment-score');
            const decrementButton = row.querySelector('.decrement-score');
            const deleteButton = row.querySelector('.delete-player');
            incrementButton.onclick = () => {
                scoreCell.textContent = parseInt(scoreCell.textContent) + 1;
            };
            decrementButton.onclick = () => {
                scoreCell.textContent = parseInt(scoreCell.textContent) - 1;
            };
            deleteButton.onclick = () => {
                row.remove();
            };
        });
    };

    const addPlayer = () => {
        const newRow = document.createElement('tr');
        newRow.classList.add('player-row');
        newRow.innerHTML = `
            <td contenteditable="true" class="player-name">Nieuwe Speler</td>
            <td class="player-score">0</td>
            <td>
                <button class="increment-score">+</button>
                <button class="decrement-score">-</button>
                <button class="delete-player">&#128465;</button>
            </td>
        `;
        scoreboardTable.appendChild(newRow);
        updateScores();
    };

    const showModal = () => {
        modal.style.display = 'block';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    const switchLanguage = (language) => {
        currentLanguage = language;
        if (language === 'NL') {
            switchNlButton.classList.add('selected');
            switchFrButton.classList.remove('selected');
        } else {
            switchNlButton.classList.remove('selected');
            switchFrButton.classList.add('selected');
        }
    };

    lettersButton.addEventListener('click', generateLetters);
    numbersButton.addEventListener('click', generateNumbers);
    resetTimerButton.addEventListener('click', resetTimer);
    timerSlider.addEventListener('input', () => {
        timerValue.textContent = timerSlider.value;
        if (!isTimerRunning) {
            timerOutput.textContent = `Timer: ${timerSlider.value}`;
        }
    });
    addPlayerButton.addEventListener('click', addPlayer);
    modalClose.addEventListener('click', closeModal);

    switchNlButton.addEventListener('click', () => switchLanguage('NL'));
    switchFrButton.addEventListener('click', () => switchLanguage('FR'));

    updateScores();
    switchLanguage('NL'); // Set default language to Dutch
});
