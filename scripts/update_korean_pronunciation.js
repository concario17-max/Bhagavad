import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitaJsonPath = path.join(__dirname, '../public/gita.json');
const textFilePath = path.join(__dirname, '../1.han bal-1.txt');

const gitaData = JSON.parse(fs.readFileSync(gitaJsonPath, 'utf8'));
const textContent = fs.readFileSync(textFilePath, 'utf8');

const lines = textContent.split('\n');

let currentChapter = null;
let currentVerseStart = null;
let currentVerseEnd = null;
let currentTextLines = [];

let updatedCount = 0;

// Function to find the corresponding verse in JSON based on the range matching audio or id
const findVerseInJson = (chapter, start, end) => {
    let chData = gitaData[chapter];
    if (!chData || !chData.verses) return null;

    // Try finding by exact verse start OR end matching the audio URL
    for (const v of chData.verses) {
        if (!v.audio) continue;
        const filenameMatch = v.audio.match(/_(\d{3})(?:-(\d{3}))?\.mp3/);
        if (filenameMatch) {
            const vStart = parseInt(filenameMatch[1], 10);
            const vEnd = filenameMatch[2] ? parseInt(filenameMatch[2], 10) : vStart;

            // If the ranges overlap or match start/end
            if ((start >= vStart && start <= vEnd) || (end && end >= vStart && end <= vEnd)) {
                return v;
            }
        }
    }
    return null;
};

const saveCurrentVerseText = () => {
    if (currentChapter && currentVerseStart && currentTextLines.length > 0) {
        let verseObj = findVerseInJson(currentChapter, currentVerseStart, currentVerseEnd || currentVerseStart);
        if (verseObj) {
            // Re-apply the cleanup to remove any lingering dandas or spaces logic since the src file may have them
            let newText = currentTextLines.join('\n');
            newText = newText.split('\n').map(line => line.replace(/[।॥I|]+\s*$/, '').trimEnd()).join('\n').trim();

            if (verseObj.korean_pronunciation !== newText) {
                verseObj.korean_pronunciation = newText;
                updatedCount++;
            }
        } else {
            console.warn(`Verse ${currentChapter}.${currentVerseStart}${currentVerseEnd ? '-' + currentVerseEnd : ''} not found in JSON.`);
        }
    }
};

for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
        continue;
    }

    // Ignore chapter titles
    if (trimmed.startsWith('제') && trimmed.includes('장')) {
        continue;
    }

    // Match patterns like "1.1 드리타라쉬트라 우바차" or "1.4-6 아트라 수라..."
    // OR bracketed patterns like "[1.1]" or "[1.4-6]"
    const matchInline = trimmed.match(/^(\d+)\.(\d+)(?:-(\d+))?\s+(.+)$/);
    const matchBracket = trimmed.match(/^\[(\d+)\.(\d+)(?:-(\d+))?\]$/);

    if (matchInline) {
        saveCurrentVerseText();

        currentChapter = parseInt(matchInline[1]);
        currentVerseStart = parseInt(matchInline[2]);
        currentVerseEnd = matchInline[3] ? parseInt(matchInline[3]) : null;
        currentTextLines = [matchInline[4]];
    } else if (matchBracket) {
        saveCurrentVerseText();

        currentChapter = parseInt(matchBracket[1]);
        currentVerseStart = parseInt(matchBracket[2]);
        currentVerseEnd = matchBracket[3] ? parseInt(matchBracket[3]) : null;
        currentTextLines = [];
    } else {
        // Continuation of the current verse
        if (currentChapter && currentVerseStart) {
            currentTextLines.push(trimmed);
        }
    }
}

// Save the last verse
saveCurrentVerseText();

if (updatedCount > 0) {
    fs.writeFileSync(gitaJsonPath, JSON.stringify(gitaData, null, 2), 'utf8');
    console.log(`Updated korean_pronunciation for ${updatedCount} verses.`);
} else {
    console.log('No updates needed. The text is already up to date.');
}
