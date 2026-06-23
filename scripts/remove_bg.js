import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';

async function main() {
  const inputPath = 'C:/Users/ADHIL CP/.gemini/antigravity-ide/brain/3edc4dd6-58b0-41c9-93dd-70ca18258ad9/media__1781343139406.jpg';
  const outputPath = 'public/logo.png';

  console.log(`Reading source image from: ${inputPath}`);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found at ${inputPath}`);
    process.exit(1);
  }

  const image = await Jimp.read(inputPath);
  
  // Scan pixels and turn close-to-white pixels transparent
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    if (r > 240 && g > 240 && b > 240) {
      this.bitmap.data[idx + 3] = 0; // Set Alpha to 0 (transparent)
    }
  });

  // Ensure public directory exists
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  await image.write(outputPath);
  console.log(`Success! Saved transparent logo to ${outputPath}`);
}

main().catch(err => {
  console.error('Error processing logo:', err);
  process.exit(1);
});
