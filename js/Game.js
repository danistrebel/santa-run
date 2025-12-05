import { GAME_WIDTH, GAME_HEIGHT, SPAWN_RATE_INITIAL, SPEED_INITIAL, MAX_SPEED, HITBOX_PADDING } from './constants.js';
import { createTransparentSprite } from './utils.js';
import { Santa } from './entities/Santa.js';
import { Obstacle } from './entities/Obstacle.js';
import { Background } from './entities/Background.js';
import { ScoreManager } from './ScoreManager.js';
import { InputHandler } from './InputHandler.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        this.gameSpeed = SPEED_INITIAL;
        this.frame = 0;
        this.isGameOver = false;
        this.isPlaying = false;
        this.obstacles = [];
        this.gameOverTime = 0;

        // UI Elements
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.inputContainer = document.getElementById('highscore-input-container');

        // Systems
        this.scoreManager = new ScoreManager();
        this.inputHandler = new InputHandler(this);

        // Assets
        this.santaImg = new Image();
        this.obstacleImg = new Image();
        this.bgImg = new Image();
        
        this.processedSanta = null;
        this.processedObstacles = null;

        this.loadAssets();
    }

    loadAssets() {
        let loaded = 0;
        const total = 3;
        const onAssetLoad = () => {
            loaded++;
            if (loaded === total) {
                this.processedSanta = createTransparentSprite(this.santaImg);
                this.processedObstacles = createTransparentSprite(this.obstacleImg);
                this.initEntities();
                this.initialDraw();
            }
        };

        this.santaImg.onload = onAssetLoad;
        this.obstacleImg.onload = onAssetLoad;
        this.bgImg.onload = onAssetLoad;

        this.santaImg.src = 'assets/santa.png';
        this.obstacleImg.src = 'assets/obstacles.png';
        this.bgImg.src = 'assets/background.png';
    }

    initEntities() {
        this.santa = new Santa(this.processedSanta);
        this.background = new Background(this.bgImg);
    }

    initialDraw() {
        if (!this.isPlaying) {
            this.background.draw(this.ctx);
            // Draw static Santa
            const sW = this.processedSanta.width / 2;
            const sH = this.processedSanta.height / 2;
            this.ctx.drawImage(this.processedSanta, 0, 0, sW, sH, 50, GAME_HEIGHT - 100, 64, 64);
        }
    }

    start() {
        this.isPlaying = true;
        this.startScreen.classList.add('hidden');
        this.loop();
    }

    reset() {
        this.isGameOver = false;
        this.isPlaying = true;
        this.scoreManager.reset();
        this.gameSpeed = SPEED_INITIAL;
        this.obstacles = [];
        this.frame = 0;
        this.santa.reset();
        
        this.gameOverScreen.classList.add('hidden');
        this.startScreen.classList.add('hidden');
        this.inputContainer.classList.add('hidden');
        
        this.loop();
    }

    handleInput() {
        if (!this.isPlaying && !this.isGameOver) {
            this.start();
        } else if (this.isGameOver) {
            const timeSinceGameOver = Date.now() - this.gameOverTime;
            if (timeSinceGameOver >= 500) {
                this.reset();
            }
        } else {
            this.santa.jump();
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.isPlaying = false;
        this.gameOverTime = Date.now();
        this.gameOverScreen.classList.remove('hidden');
        this.scoreManager.finalScoreEl.innerText = this.scoreManager.getScore();

        if (this.scoreManager.isHighScore(this.scoreManager.getScore())) {
            this.inputContainer.classList.remove('hidden');
            const nameInput = document.getElementById('player-name');
            nameInput.value = '';
            setTimeout(() => nameInput.focus(), 100);
        }
        this.scoreManager.updateList();
    }

    saveHighScore() {
        const nameInput = document.getElementById('player-name');
        this.scoreManager.saveHighScore(nameInput.value, this.scoreManager.score);
        this.inputContainer.classList.add('hidden');
    }

    spawnObstacle() {
        if (this.frame > 60 && this.frame % SPAWN_RATE_INITIAL === 0) {
            this.obstacles.push(new Obstacle(this.processedObstacles, this.gameSpeed));
        }
    }

    checkCollisions() {
        const hitBoxPadding = HITBOX_PADDING;
        for (let obstacle of this.obstacles) {
            if (
                this.santa.x + hitBoxPadding < obstacle.x + obstacle.w - hitBoxPadding &&
                this.santa.x + this.santa.w - hitBoxPadding > obstacle.x + hitBoxPadding &&
                this.santa.y + hitBoxPadding < obstacle.y + obstacle.h - hitBoxPadding &&
                this.santa.y + this.santa.h - hitBoxPadding > obstacle.y + hitBoxPadding
            ) {
                this.gameOver();
                return;
            }
        }
    }

    loop() {
        if (!this.isPlaying) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.frame++;
        this.scoreManager.increment(0.1);

        // Speed Progression
        if (this.frame % 600 === 0 && this.gameSpeed < MAX_SPEED) {
            this.gameSpeed += 0.5;
        }

        this.background.update(this.gameSpeed);
        this.background.draw(this.ctx);

        this.santa.update();
        this.santa.draw(this.ctx);

        this.spawnObstacle();

        this.obstacles.forEach(obstacle => {
            obstacle.update(this.gameSpeed);
            obstacle.draw(this.ctx);
        });

        this.checkCollisions();
        this.obstacles = this.obstacles.filter(o => !o.markedForDeletion);

        if (!this.isGameOver) {
            requestAnimationFrame(() => this.loop());
        }
    }
}
