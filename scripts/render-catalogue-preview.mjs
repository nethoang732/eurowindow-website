import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pdfPath = path.join(root, 'public', 'data', 'catalogue-eurowindow-2024.pdf');
const outputDir = path.join(root, 'public', 'catalogue-preview');
const outputScale = 1.35;

await fs.mkdir(outputDir, { recursive: true });
const data = new Uint8Array(await fs.readFile(pdfPath));
const pdf = await pdfjs.getDocument({ data, disableFontFace: true }).promise;

for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: outputScale });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  const image = canvas.toBuffer('image/webp', { quality: 84 });
  await fs.writeFile(path.join(outputDir, `page-${pageNumber}.webp`), image);
  console.log(`Rendered ${pageNumber}/${pdf.numPages}`);
}

await pdf.destroy();
