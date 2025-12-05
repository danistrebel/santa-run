export class InputHandler {
    constructor(game) {
        this.game = game;
        this.setupListeners();
    }

    setupListeners() {
        const handleInput = (e) => {
            // Prevent default scrolling for Space
            if (e.code === 'Space') e.preventDefault();
            
            if ((e.code === 'Space' || e.type === 'touchstart' || e.type === 'click') && !e.repeat) {
                this.game.handleInput();
            }
        };

        window.addEventListener('keydown', handleInput);
        window.addEventListener('touchstart', handleInput, { passive: false });
        window.addEventListener('click', handleInput);
        
        // Name input handling
        const nameInput = document.getElementById('player-name');
        if (nameInput) {
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.game.saveHighScore();
                }
            });
        }
    }
}
