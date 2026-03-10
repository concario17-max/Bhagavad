import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitaJsonPath = path.join(__dirname, '../public/gita.json');
const mp3Dir = path.join(__dirname, '../public/mp3');

const gitaData = JSON.parse(fs.readFileSync(gitaJsonPath, 'utf8'));
const filesInMp3Dir = new Set(fs.readdirSync(mp3Dir).filter(f => f.endsWith('.mp3')));

const usedMp3s = new Set();
for (const chapterNum in gitaData) {
    for (const verse of gitaData[chapterNum].verses) {
        if (verse.audio) {
            usedMp3s.add(verse.audio.split('/').pop());
        }
    }
}

const unusedMp3s = [];
for (const mp3 of filesInMp3Dir) {
    if (!usedMp3s.has(mp3)) {
        unusedMp3s.push(mp3);
    }
}

console.log(`\nFound ${unusedMp3s.length} unused MP3 files:`);
if (unusedMp3s.length > 0) {
    unusedMp3s.sort().forEach(m => console.log(m));
} else {
    console.log("All MP3 files in the folder are properly linked in gita.json.");
}

const missingMp3s = [];
for (const mp3 of usedMp3s) {
    if (!filesInMp3Dir.has(mp3)) {
        missingMp3s.push(mp3);
    }
}
console.log(`\nFound ${missingMp3s.length} missing MP3 files (referenced but not found):`);
if (missingMp3s.length > 0) {
    missingMp3s.sort().forEach(m => console.log(m));
}
