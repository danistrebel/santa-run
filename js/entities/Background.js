import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export class Background {
    constructor(image) {
        this.image = image;
        this.x = 0;
        this.width = GAME_WIDTH;
    }

    update(speed) {
        this.x -= speed * 0.5; // Parallax effect
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            const x = Math.floor(this.x);
            ctx.drawImage(this.image, x, 0, this.width, GAME_HEIGHT);
            // Draw overlap
            ctx.drawImage(this.image, x + this.width - 1, 0, this.width, GAME_HEIGHT);
        }
    }
}
