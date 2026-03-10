import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitaJsonPath = path.join(__dirname, '../public/gita.json');
const gitaData = JSON.parse(fs.readFileSync(gitaJsonPath, 'utf8'));

// The known verse counts for each chapter
const chapterVerseCounts = {
    1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47, 7: 30, 8: 28, 9: 34,
    10: 42, 11: 55, 12: 20, 13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
};

const issues = [];

for (const chapter in chapterVerseCounts) {
    const chapterNum = parseInt(chapter, 10);
    const expectedVerses = chapterVerseCounts[chapterNum];
    const chapterData = gitaData[chapterNum];

    if (!chapterData) {
        issues.push(`Chapter ${chapterNum} is entirely missing in gita.json`);
        continue;
    }

    let nextExpectedVerse = 1;
    for (const verse of chapterData.verses) {
        if (verse.verse !== nextExpectedVerse) {
            issues.push(`Chapter ${chapterNum} expected verse ${nextExpectedVerse} but found ${verse.verse}`);
        }

        let audioMatch = null;
        if (verse.audio) {
            const filename = verse.audio.split('/').pop();
            audioMatch = filename.match(/^(\d{3})_(\d{3})(?:-(\d{3}))?\.mp3$/);
        }

        let endVerse = verse.verse;
        if (audioMatch) {
            const fileStart = parseInt(audioMatch[2], 10);
            const fileEnd = audioMatch[3] ? parseInt(audioMatch[3], 10) : fileStart;
            endVerse = fileEnd;
        }

        // The next expected verse is after the end of this grouped audio
        nextExpectedVerse = endVerse + 1;
    }

    if (nextExpectedVerse - 1 !== expectedVerses) {
        issues.push(`Chapter ${chapterNum} ended at verse ${nextExpectedVerse - 1}, but should have ${expectedVerses}`);
    }
}

console.log("Sequence check results:");
if (issues.length > 0) {
    issues.forEach(i => console.log(i));
} else {
    console.log("No sequence gaps found. Sequence is perfectly contiguous.");
}
