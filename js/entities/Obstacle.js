import { GAME_WIDTH, GROUND_Y } from '../constants.js';

export class Obstacle {
    constructor(sprite, gameSpeed) {
        this.sprite = sprite;
        this.w = 52;
        this.h = 80;
        this.x = GAME_WIDTH;
        this.y = GROUND_Y - this.h + 24;
        this.markedForDeletion = false;
        
        // Randomize type: 0 = Tree, 1 = Present, 2 = Stocking
        this.type = Math.floor(Math.random() * 3);
        this.frameCount = 3;
    }

    update(speed) {
        this.x -= speed;
        if (this.x + this.w < 0) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        if (!this.sprite) return;

        const spriteW = this.sprite.width / this.frameCount;
        const spriteH = this.sprite.height;
        const sx = this.type * spriteW;

        ctx.drawImage(this.sprite, sx, 0, spriteW, spriteH, this.x, this.y, this.w, this.h);
    }
}
