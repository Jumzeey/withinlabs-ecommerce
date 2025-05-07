const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = {
  "favicon.ico": [16, 32],
  "icon.png": [32],
  "apple-icon.png": [180],
  "android-chrome-192x192.png": [192],
  "android-chrome-512x512.png": [512],
};

async function generateFavicons() {
  const svgBuffer = fs.readFileSync(
    path.join(__dirname, "../public/favicon.svg")
  );

  for (const [filename, sizeList] of Object.entries(sizes)) {
    const outputPath = path.join(__dirname, "../public", filename);

    if (filename === "favicon.ico") {
      // Generate ICO file with multiple sizes
      const pngBuffers = await Promise.all(
        sizeList.map((size) =>
          sharp(svgBuffer).resize(size, size).png().toBuffer()
        )
      );

      // Combine PNG buffers into ICO
      await sharp(pngBuffers[0]).joinChannel(pngBuffers[1]).toFile(outputPath);
    } else {
      // Generate single-size PNG
      await sharp(svgBuffer)
        .resize(sizeList[0], sizeList[0])
        .png()
        .toFile(outputPath);
    }

    console.log(`Generated ${filename}`);
  }
}

generateFavicons().catch(console.error);
