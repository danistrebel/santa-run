import { GROUND_Y, GRAVITY, JUMP_FORCE } from '../constants.js';

export class Santa {
    constructor(sprite) {
        this.sprite = sprite;
        this.w = 64;
        this.h = 64;
        this.x = 50;
        this.originalY = GROUND_Y - this.h;
        this.y = this.originalY;
        this.dy = 0;
        this.grounded = true;

        // Animation
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 8;
        this.runFrameStart = 0;
        this.runFrameEnd = 1;
    }

    reset() {
        this.y = this.originalY;
        this.dy = 0;
        this.grounded = true;
        this.frameIndex = 0;
    }

    jump() {
        if (this.grounded) {
            this.dy = JUMP_FORCE;
            this.grounded = false;
        }
    }

    update() {
        // Apply Gravity
        if (!this.grounded) {
            this.dy += GRAVITY;
            this.y += this.dy;
        }

        // Ground Collision
        if (this.y > this.originalY) {
            this.y = this.originalY;
            this.dy = 0;
            this.grounded = true;
        }

        // Animation
        if (this.grounded) {
            this.tickCount++;
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                this.frameIndex = (this.frameIndex === this.runFrameStart) ? this.runFrameEnd : this.runFrameStart;
            }
        } else {
            this.frameIndex = 2; // Jump frame
        }
    }

    draw(ctx) {
        if (!this.sprite) return;

        const cols = 2;
        const spriteW = this.sprite.width / cols;
        const spriteH = this.sprite.height / 2;

        const col = this.frameIndex % cols;
        const row = Math.floor(this.frameIndex / cols);

        const sx = col * spriteW;
        const sy = row * spriteH;

        ctx.drawImage(this.sprite, sx, sy, spriteW, spriteH, this.x, this.y, this.w, this.h);
    }
}
