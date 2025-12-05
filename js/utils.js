/**
 * Helper to remove white/greenish background from images
 * @param {HTMLImageElement} image 
 * @returns {HTMLCanvasElement | HTMLImageElement}
 */
export function createTransparentSprite(image) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(image, 0, 0);

    try {
        const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // If pixel is green (approx #00FF00), make it transparent
            if (g > 180 && r < 80 && b < 80) {
                data[i + 3] = 0;
            }
        }

        tempCtx.putImageData(imgData, 0, 0);
        return tempCanvas;
    } catch (e) {
        console.error("Could not process image transparency (likely CORS/tainted canvas):", e);
        return image; // Fallback to raw image
    }
}
