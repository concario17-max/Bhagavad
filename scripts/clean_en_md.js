import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPath = path.join(__dirname, '../translation_en.md');

async function cleanMd() {
    const txt = await fs.readFile(mdPath, 'utf8');
    const lines = txt.split('\n');

    const cleanedLines = [];
    let removedCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Remove lines that just contain $15
        if (line.includes('$15')) {
            removedCount++;
            continue;
        }

        // Remove lines that contain Hindi characters and aren't standard translation lines
        const hasHindi = /[\u0900-\u097F]/.test(line);
        if (hasHindi && line.trim() !== '') {
            removedCount++;
            continue;
        }

        cleanedLines.push(line);
    }

    // Remove double empty lines created by deleting text
    const finalText = cleanedLines.join('\n').replace(/\n{3,}/g, '\n\n');

    await fs.writeFile(mdPath, finalText, 'utf8');
    console.log(`✅ Completely wiped ${removedCount} corrupted translation lines from translation_en.md`);
}

cleanMd().catch(console.error);
