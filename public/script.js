// Výběr prvků z DOMu
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

// Přidání události na tlačítko pro zadání přezdívky
submitNicknameButton.addEventListener('click', () => {
    nickname = nicknameInput.value.trim(); // Získání přezdívky a odstranění mezer
    if (nickname) { // Pokud je přezdívka zadána
        introScreen.classList.add('hidden'); // Skrytí úvodní obrazovky
        simonGameScreen.classList.remove('hidden'); // Zobrazení herní obrazovky
    }
});

// Přidání události na tlačítko pro opětovné hraní
playAgainButton.addEventListener('click', () => {
    leaderboardScreen.classList.add('hidden'); // Skrytí obrazovky žebříčku
    introScreen.classList.remove('hidden'); // Zobrazení úvodní obrazovky
    nicknameInput.value = ''; // Vymazání inputu pro přezdívku
});

class Simon {
    constructor(simonButtons, startButton, round) {
        this.round = 0; // Aktuální kolo
        this.userPosition = 0; // Pozice uživatele v sekvenci
        this.totalRounds = 10; // Celkový počet kol
        this.sequence = []; // Sekvence barev
        this.speed = 1500; // Rychlost přehrávání sekvence (3 sekundy pauza)
        this.blockedButtons = true; // Stav, zda jsou tlačítka blokována
        this.buttons = Array.from(simonButtons); // Tlačítka hry
        this.display = {
            startButton,
            round
        };
        this.errorSound = new Audio('./sounds/error2.wav'); // Zvuk při chybě
        this.buttonSounds = [
            new Audio('./sounds/1.wav'),
            new Audio('./sounds/2.wav'),
            new Audio('./sounds/3.wav'),
            new Audio('./sounds/42.wav'),
        ];
    }

    // Inicializace hry
    init() {
        // Přidání události na startovací tlačítko
        this.display.startButton.onclick = () => this.startGame();
    }

    // Zahájení hry
    startGame() {
        this.display.startButton.disabled = true; // Deaktivace startovacího tlačítka
        this.updateRound(0); // Nastavení kola na 0
        this.userPosition = 0; // Resetování pozice uživatele
        this.sequence = this.createSequence(); // Vytvoření nové sekvence
        // Přidání události pro kliknutí na jednotlivá tlačítka
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner'); // Odebrání třídy 'winner'
            element.onclick = () => this.buttonClick(i); // Nastavení události onclick
        });
        this.showSequence(); // Zobrazení sekvence
    }

    // Aktualizace kola
    updateRound(value) {
        this.round = value; // Nastavení hodnoty kola
        this.display.round.textContent = `Round ${this.round}`; // Aktualizace textu pro kolo
    }

    // Vytvoření sekvence náhodných barev
    createSequence() {
        // Vytvoření pole s náhodnými čísly mezi 0 a 3
        return Array.from({length: this.totalRounds}, () => this.getRandomColor());
    }

    // Získání náhodné barvy
    getRandomColor() {
        // Náhodné číslo mezi 0 a 3
        return Math.floor(Math.random() * 4);
    }

    // Kliknutí na tlačítko
    buttonClick(value) {
        if (!this.blockedButtons) { // Pokud nejsou tlačítka blokována
            this.validateChosenColor(value); // Validace vybrané barvy
        }
    }

    // Validace vybrané barvy
    validateChosenColor(value) {
        if(this.sequence[this.userPosition] === value) { // Pokud je vybraná barva správná
            this.buttonSounds[value].play(); // Přehrání zvuku pro vybranou barvu
            if(this.userPosition === this.round) { // Pokud je uživatel na správné pozici
                this.updateRound(this.round + 1); // Aktualizace kola
                //this.speed /= 3; // Zrychlení hry
                this.isGameOver(); // Kontrola, zda hra skončila
            } else {
                this.userPosition++; // Posun na další pozici
            }
        } else {
            this.gameLost(); // Pokud je vybraná barva špatná, hra je ztracena
        }
    }


    // Kontrola, zda hra skončila
    isGameOver() {
        if (this.round === this.totalRounds) { // Pokud je aktuální kolo rovno celkovému počtu kol
            this.gameWon(); // Hra je vyhrána
        } else {
            this.userPosition = 0; // Reset pozice uživatele
            this.showSequence(); // Zobrazení nové sekvence
        };
    }

    // Zobrazení sekvence
    showSequence() {
        this.blockedButtons = true; // Blokování tlačítek
        let sequenceIndex = 0; // Index pro sekvenci
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]]; // Získání tlačítka ze sekvence
            this.buttonSounds[this.sequence[sequenceIndex]].play(); // Přehrání zvuku tlačítka
            this.toggleButtonStyle(button); // Aktivace stylu tlačítka
            setTimeout(() => this.toggleButtonStyle(button), this.speed / 2); // Deaktivace stylu tlačítka
            sequenceIndex++; // Posun na další tlačítko v sekvenci
            if (sequenceIndex > this.round) { // Pokud jsme na konci sekvence
                this.blockedButtons = false; // Odblokování tlačítek
                clearInterval(timer); // Zastavení intervalu
            }
        }, this.speed);
    }

    // Přepínání stylu tlačítka
    toggleButtonStyle(button) {
        button.classList.toggle('active'); // Přepnutí třídy 'active' pro tlačítko
    }

    // Akce při prohře
    gameLost() {
        this.errorSound.play(); // Přehrání zvuku chyby
        this.display.startButton.disabled = false; // Aktivace startovacího tlačítka
        this.blockedButtons = true; // Blokování tlačítek
        this.saveScore(); // Uložení skóre
    }

    // Akce při výhře
    gameWon() {
        this.display.startButton.disabled = false; // Aktivace startovacího tlačítka
        this.blockedButtons = true; // Blokování tlačítek
        this.buttons.forEach(element => {
            element.classList.add('winner'); // Přidání třídy 'winner' všem tlačítkům
        });
        this.updateRound('🏆'); // Aktualizace kola na trofej
        this.saveScore(); // Uložení skóre
    }

    // Uložení skóre
    saveScore() {
        const score = this.round; // Získání skóre (aktuální kolo)
        fetch('/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname, score }), // Odeslání přezdívky a skóre na server
        })
        .then(response => response.json())
        .then(data => {
            this.updateLeaderboard(data); // Aktualizace žebříčku s novými daty
            this.showLeaderboard(); // Zobrazení žebříčku
        });
    }

    // Aktualizace žebříčku
    updateLeaderboard(leaderboard) {
        leaderboardTableBody.innerHTML = ''; // Vyprázdnění tabulky žebříčku
        leaderboard.forEach((entry, index) => { // Pro každý záznam v žebříčku
            const row = document.createElement('tr'); // Vytvoření nového řádku tabulky
            const rankCell = document.createElement('td'); // Buňka pro pořadí
            rankCell.textContent = index + 1; // Nastavení pořadí
            const nameCell = document.createElement('td'); // Buňka pro přezdívku
            nameCell.textContent = entry.nickname; // Nastavení přezdívky
            const scoreCell = document.createElement('td'); // Buňka pro skóre
            scoreCell.textContent = entry.score; // Nastavení skóre
            row.appendChild(rankCell); // Přidání buňky s pořadím do řádku
            row.appendChild(nameCell); // Přidání buňky s přezdívkou do řádku
            row.appendChild(scoreCell); // Přidání buňky se skóre do řádku
            leaderboardTableBody.appendChild(row); // Přidání řádku do tabulky žebříčku
        });
    }

    // Zobrazení žebříčku
    showLeaderboard() {
        simonGameScreen.classList.add('hidden'); // Skrytí herní obrazovky
        leaderboardScreen.classList.remove('hidden'); // Zobrazení obrazovky žebříčku
    }
}

// Inicializace hry Simon
const simon = new Simon(simonButtons, startButton, round);
simon.init(); // Spuštění inicializační funkce

// Přidání události pro přehrávání zvuku při kliknutí na tlačítko
simonButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        simon.buttonSounds[index].play(); // Přehrání zvuku odpovídajícího tlačítku
    });
});
