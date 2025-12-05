import { Game } from './Game.js';

window.addEventListener('load', () => {
    const game = new Game();
    
    // Responsive Scaling
    function resizeGame() {
        const container = document.getElementById('game-container');
        const aspect = 800 / 400;
        const windowAspect = window.innerWidth / window.innerHeight;

        if (windowAspect > aspect) {
            const newHeight = window.innerHeight;
            const newWidth = newHeight * aspect;
            container.style.height = `${newHeight}px`;
            container.style.width = `${newWidth}px`;
        } else {
            const newWidth = window.innerWidth;
            const newHeight = newWidth / aspect;
            container.style.width = `${newWidth}px`;
            container.style.height = `${newHeight}px`;
        }
    }

    window.addEventListener('resize', resizeGame);
    resizeGame();
});
