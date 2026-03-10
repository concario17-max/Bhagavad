import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitaJsonPath = path.join(__dirname, '../public/gita.json');
const gitaData = JSON.parse(fs.readFileSync(gitaJsonPath, 'utf8'));

let modifiedCount = 0;

for (const chapterNum in gitaData) {
    const chapter = gitaData[chapterNum];
    for (const verse of chapter.verses) {
        if (verse.sanskrit) {
            const original = verse.sanskrit;

            // 1. Remove Devanagari Danda '।' and Double Danda '।।' globally
            // 2. Remove any other pipe-like characters '|' or '||' if they exist
            let cleaned = original.replace(/[।॥|]+/g, '');

            // 3. Remove empty lines (split, filter, trim, rejoin)
            cleaned = cleaned.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n');

            if (original !== cleaned) {
                verse.sanskrit = cleaned;
                modifiedCount++;
            }
        }
    }
}

if (modifiedCount > 0) {
    fs.writeFileSync(gitaJsonPath, JSON.stringify(gitaData, null, 2), 'utf8');
    console.log(`Cleaned Sanskrit text from ${modifiedCount} verses in gita.json`);
} else {
    console.log('No verses needed Sanskrit cleaning.');
}
