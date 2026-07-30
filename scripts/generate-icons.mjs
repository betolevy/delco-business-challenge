import sharp from "sharp";
import { readFileSync, copyFileSync, mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const svg = readFileSync("public/logo/icon-source.svg");
const sizes = [16, 32, 180, 192, 512];

await Promise.all(
  sizes.map((size) =>
    sharp(svg, { density: 300 })
      .resize(size, size)
      .png()
      .toFile(`public/icons/icon-${size}.png`)
  )
);

copyFileSync("public/icons/icon-180.png", "public/icons/apple-touch-icon.png");

console.log("Icons generated in public/icons/");
