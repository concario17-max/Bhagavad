const fs = require('fs');

// 1. Read the JSON and TXT files
const jsonPath = './public/gita.json';
const txtPath = './6.jimong.txt';

let gitaData;
try {
    gitaData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (e) {
    console.error("Failed to read gita.json:", e);
    process.exit(1);
}

let jimongText;
try {
    jimongText = fs.readFileSync(txtPath, 'utf8');
} catch (e) {
    console.error("Failed to read 6.jimong.txt:", e);
    process.exit(1);
}

// 2. Parse the TXT file
// The typical format is:
// 1.1 드리타라쉬트라 말하기를 다르마의 들녘...
// or 1.4-6 전투에 있어 ...
const lines = jimongText.split('\n');
const jimongMap = {};

const verseRegex = /^(\d+)\.\s*([\d\-]+)\s+(.*)$/;

for (const line of lines) {
    const match = line.trim().match(verseRegex);
    if (match) {
        const chapter = match[1];
        let verseStr = match[2];
        const translation = match[3].trim();

        // Handle ranges like "4-6" -> just map it to the first verse, or all of them.
        // In gita.json, it's often better to just attach the combined translation to the first verse ID.
        // If we want to be safe, let's map it to the string exactly as matched, e.g., "1.4" if "4-6"

        // For range e.g., "4-6", we'll identify the base verse
        const verseParts = verseStr.split('-');
        const baseVerse = verseParts[0];

        const key = `${chapter}.${baseVerse}`;
        jimongMap[key] = translation;
    }
}

// 3. Update the JSON Data
let updatedCount = 0;
for (const chapterKey in gitaData) {
    const chapterData = gitaData[chapterKey];
    if (chapterData && chapterData.verses) {
        for (let i = 0; i < chapterData.verses.length; i++) {
            const verseObj = chapterData.verses[i];
            const verseId = verseObj.id; // e.g. "1.1"

            if (jimongMap[verseId]) {
                verseObj.translation_jimong = jimongMap[verseId];
                updatedCount++;
            }
        }
    }
}

// 4. Write back to gita.json
try {
    fs.writeFileSync(jsonPath, JSON.stringify(gitaData, null, 2), 'utf8');
    console.log(`Successfully updated ${updatedCount} verses in gita.json with jimong translations.`);
} catch (e) {
    console.error("Failed to write to gita.json", e);
}
