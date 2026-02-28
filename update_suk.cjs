const fs = require('fs');
const path = require('path');

const txtFilePath = path.join(__dirname, '7.suk.txt');
const jsonFilePath = path.join(__dirname, 'public', 'gita.json');

console.log('Reading 7.suk.txt...');
const txtContent = fs.readFileSync(txtFilePath, 'utf8');

console.log('Reading gita.json...');
const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
const gitaData = JSON.parse(jsonContent);

let matchCount = 0;
let parsedCount = 0;

console.log('Parsing 7.suk.txt line by line...');

const lines = txtContent.split('\n');
let currentChapter = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect Chapter: "1장.", "18장 " etc.
    const chMatch = line.match(/^(\d+)장\./) || line.match(/^(\d+)장 /);
    if (chMatch) {
        currentChapter = parseInt(chMatch[1], 10);
        continue;
    }

    // Detect Verse: "1. ", "4-6. "
    if (currentChapter > 0) {
        const vMatch = line.match(/^(\d+(?:-\d+)?)\.\s*(.*)/) || line.match(/^(\d+(?:-\d+)?)\s*\n(.*)/);
        // But 7.suk.txt sometimes has "1-2" on one line, and the text on the next line
        // So let's fall back to just matching the number at the start of the line alone
        let verseRef = null;
        let verseText = '';

        if (vMatch) {
            verseRef = vMatch[1];
            verseText = vMatch[2] ? vMatch[2] : "";
        } else if (line.match(/^(\d+(?:-\d+)?)$/)) {
            // "1-2" on its own line
            verseRef = line;
        }

        if (verseRef) {
            parsedCount++;

            let j = i + 1;
            while (j < lines.length) {
                const nextLine = lines[j].trim();
                // break if next line is a chapter
                if (nextLine.match(/^(\d+)장\./) || nextLine.match(/^(\d+)장 /)) {
                    break;
                }
                // break if next line is a verse number
                if (nextLine.match(/^(\d+(?:-\d+)?)\./) || nextLine.match(/^(\d+(?:-\d+)?)$/)) {
                    break;
                }
                if (nextLine) {
                    verseText += (verseText ? ' ' : '') + nextLine;
                }
                j++;
            }

            // advance i
            i = j - 1;

            let verseStart = 0;
            if (verseRef.includes('-')) {
                verseStart = parseInt(verseRef.split('-')[0], 10);
            } else {
                verseStart = parseInt(verseRef, 10);
            }

            const chapterData = gitaData[currentChapter];
            if (chapterData && chapterData.verses) {
                const targetVerse = chapterData.verses.find(v => v.verse === verseStart);
                if (targetVerse) {
                    targetVerse.translation_suk = verseText.trim();
                    matchCount++;
                }
            }
        }
    }
}

console.log(`Parsed ${parsedCount} verse blocks from TXT.`);
console.log(`Successfully merged ${matchCount} translations into JSON.`);

if (matchCount > 0) {
    console.log('Saving updated gita.json...');
    fs.writeFileSync(jsonFilePath, JSON.stringify(gitaData, null, 2), 'utf8');
    console.log('Done!');
} else {
    console.log('No matches found, not saving.');
}
