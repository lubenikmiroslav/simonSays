const round = document.getElementById('round');
const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');
const nicknameInput = document.getElementById('nickname');
const submitNicknameButton = document.getElementById('submitNickname');
const introScreen = document.querySelector('.intro');
const simonGameScreen = document.querySelector('.simon');
const leaderboardScreen = document.querySelector('.leaderboard');
const leaderboardTableBody = document.querySelector('#leaderboardTable tbody');
const playAgainButton = document.getElementById('playAgainButton');

let nickname = '';

submitNicknameButton.addEventListener('click', () => {
    nickname = nicknameInput.value.trim();
    if (nickname) {
        introScreen.classList.add('hidden');
        simonGameScreen.classList.remove('hidden');
    }
});

playAgainButton.addEventListener('click', () => {
    leaderboardScreen.classList.add('hidden');
    introScreen.classList.remove('hidden');
    nicknameInput.value = '';
});

class Simon {
    constructor(simonButtons, startButton, round) {
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 10;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.display = {
            startButton,
            round
        }
        this.errorSound = new Audio('./sounds/error.wav');
        this.buttonSounds = [
            new Audio('./sounds/1.mp3'),
            new Audio('./sounds/2.mp3'),
            new Audio('./sounds/3.mp3'),
            new Audio('./sounds/4.mp3'),
        ]
    }

    init() {
        this.display.startButton.onclick = () => this.startGame();
    }

    startGame() {
        this.display.startButton.disabled = true; 
        this.updateRound(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner');
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

    updateRound(value) {
        this.round = value;
        this.display.round.textContent = `Round ${this.round}`;
    }

    createSequence() {
        return Array.from({length: this.totalRounds}, () =>  this.getRandomColor());
    }

    getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

    buttonClick(value) {
        if (!this.blockedButtons) {
            this.validateChosenColor(value);
        }
    }

    validateChosenColor(value) {
        if(this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].play();
            if(this.userPosition === this.round) {
                this.updateRound(this.round + 1);
                this.speed /= 1.02;
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.gameLost();
        }
    }

    isGameOver() {
        if (this.round === this.totalRounds) {
            this.gameWon();
        } else {
            this.userPosition = 0;
            this.showSequence();
        };
    }

    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            this.toggleButtonStyle(button);
            setTimeout(() => this.toggleButtonStyle(button), this.speed / 2);
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

    toggleButtonStyle(button) {
        button.classList.toggle('active');
    }

    gameLost() {
        this.errorSound.play();
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
        this.saveScore();
    }

    gameWon() {
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
        this.buttons.forEach(element =>{
            element.classList.add('winner');
        });
        this.updateRound('🏆');
        this.saveScore();
    }

    saveScore() {
        const score = this.round;
        fetch('/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname, score }),
        })
        .then(response => response.json())
        .then(data => {
            this.updateLeaderboard(data);
            this.showLeaderboard();
        });
    }

    updateLeaderboard(leaderboard) {
        leaderboardTableBody.innerHTML = '';
        leaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            const nameCell = document.createElement('td');
            nameCell.textContent = entry.nickname;
            const scoreCell = document.createElement('td');
            scoreCell.textContent = entry.score;
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            leaderboardTableBody.appendChild(row);
        });
    }

    showLeaderboard() {
        simonGameScreen.classList.add('hidden');
        leaderboardScreen.classList.remove('hidden');
    }
}

const simon = new Simon(simonButtons, startButton, round);
simon.init();

// Přidání události, která spustí hudbu při změně barvy čtverce
simonButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        simon.buttonSounds[index].play();
    });
});
