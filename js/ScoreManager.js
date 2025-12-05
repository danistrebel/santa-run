export class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScores = JSON.parse(localStorage.getItem('santaRunHighScores')) || [];
        this.scoreEl = document.getElementById('score');
        this.highScoreEl = document.getElementById('high-score');
        this.finalScoreEl = document.getElementById('final-score');
        this.listEl = document.getElementById('high-score-list');
        
        this.updateHighScoreDisplay();
        this.updateList();
    }

    reset() {
        this.score = 0;
        this.updateDisplay();
    }

    increment(amount) {
        this.score += amount;
        this.updateDisplay();
    }

    getScore() {
        return Math.floor(this.score);
    }

    updateDisplay() {
        if (this.scoreEl) {
            this.scoreEl.innerText = Math.floor(this.score);
        }
    }

    updateHighScoreDisplay() {
        if (this.highScoreEl && this.highScores.length > 0) {
            this.highScoreEl.innerText = this.highScores[0].score;
        }
    }

    isHighScore(score) {
        if (this.highScores.length < 5) return true;
        return score > this.highScores[this.highScores.length - 1].score;
    }

    saveHighScore(name, score) {
        const newScore = { name: name.toUpperCase().trim() || 'AAA', score: Math.floor(score) };
        this.highScores.push(newScore);
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 5);
        
        localStorage.setItem('santaRunHighScores', JSON.stringify(this.highScores));
        this.updateHighScoreDisplay();
        this.updateList();
    }

    updateList() {
        if (this.listEl) {
            this.listEl.innerHTML = this.highScores.map((s, i) =>
                `<li><span>${i + 1}. ${s.name}</span><span>${s.score}</span></li>`
            ).join('');
        }
    }
}
