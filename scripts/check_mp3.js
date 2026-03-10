import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitaJsonPath = path.join(__dirname, '../public/gita.json');

const gitaData = JSON.parse(fs.readFileSync(gitaJsonPath, 'utf8'));

const semanticMismatches = [];

for (const chapterNumStr in gitaData) {
    const chapterNum = parseInt(chapterNumStr, 10);
    const chapter = gitaData[chapterNumStr];

    for (const verse of chapter.verses) {
        if (!verse.audio) continue;

        const filename = verse.audio.split('/').pop();
        // filename format: 001_001.mp3 or 001_004-006.mp3
        const match = filename.match(/^(\d{3})_(\d{3})(?:-(\d{3}))?\.mp3$/);

        if (!match) {
            semanticMismatches.push(`Chapter ${chapterNum} Verse ${verse.verse} has weird audio format: ${filename}`);
            continue;
        }

        const fileChapter = parseInt(match[1], 10);
        const fileStartVerse = parseInt(match[2], 10);
        const fileEndVerse = match[3] ? parseInt(match[3], 10) : fileStartVerse;

        if (fileChapter !== chapterNum) {
            semanticMismatches.push(`Chapter ${chapterNum} Verse ${verse.verse}: Chapter mismatch in audio '${filename}'`);
        }

        if (verse.verse < fileStartVerse || verse.verse > fileEndVerse) {
            semanticMismatches.push(`Chapter ${chapterNum} Verse ${verse.verse}: Verse number mismatch in audio '${filename}' (File covers ${fileStartVerse}-${fileEndVerse})`);
        }
    }
}

if (semanticMismatches.length > 0) {
    console.log(`Found ${semanticMismatches.length} semantic mismatches:`);
    semanticMismatches.forEach(m => console.log(m));
} else {
    console.log('No semantic mismatches found. All audio filenames correctly match their verse numbers.');
}
