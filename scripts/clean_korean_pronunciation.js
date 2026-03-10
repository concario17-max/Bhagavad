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
        if (verse.korean_pronunciation) {
            const original = verse.korean_pronunciation;
            // Split by lines, remove trailing '।', '॥', 'I', '|' along with any trailing spaces
            // Rejoin with newline
            const cleaned = original.split('\n').map(line => {
                return line.replace(/[।॥I|]+\s*$/, '').trimEnd();
            }).join('\n');

            if (original !== cleaned) {
                verse.korean_pronunciation = cleaned;
                modifiedCount++;
            }
        }
    }
}

if (modifiedCount > 0) {
    fs.writeFileSync(gitaJsonPath, JSON.stringify(gitaData, null, 2), 'utf8');
    console.log(`Cleaned punctuation from ${modifiedCount} verses in gita.json`);
} else {
    console.log('No verses needed cleaning.');
}
