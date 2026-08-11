import QRCode from "qrcode";
import { mkdirSync } from "fs";

const URL = process.env.QR_URL ?? "https://delco-business-challenge.vercel.app";
const OUT_DIR = "qr";

mkdirSync(OUT_DIR, { recursive: true });

// "H" survives a logo overlay, a scuffed table tent, or a bad camera angle —
// worth the denser pattern for something that gets printed once.
const common = { errorCorrectionLevel: "H", margin: 4 };

await QRCode.toFile(`${OUT_DIR}/qr-black-on-white.png`, URL, {
  ...common,
  width: 3000,
  color: { dark: "#0a0a0aff", light: "#ffffffff" },
});

await QRCode.toFile(`${OUT_DIR}/qr-white-on-black.png`, URL, {
  ...common,
  width: 3000,
  color: { dark: "#ffffffff", light: "#0a0a0aff" },
});

await QRCode.toFile(`${OUT_DIR}/qr-black-transparent.png`, URL, {
  ...common,
  width: 3000,
  color: { dark: "#0a0a0aff", light: "#00000000" },
});

await QRCode.toFile(`${OUT_DIR}/qr-vector.svg`, URL, {
  ...common,
  color: { dark: "#0a0a0aff", light: "#ffffffff" },
});

console.log(`QR assets for ${URL} written to ./${OUT_DIR}/`);
