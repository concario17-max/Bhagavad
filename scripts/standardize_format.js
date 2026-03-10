import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitaJsonPath = path.join(__dirname, '../public/gita.json');
const gitaData = JSON.parse(fs.readFileSync(gitaJsonPath, 'utf8'));

let updatedIastCount = 0;
let updatedSanskritCount = 0;

// Function to combine pairs of lines
const standardizeLines = (text) => {
    if (!text) return text;
    const lines = text.split('\n');

    // Only standardize if there are 4 lines (or even number > 2)
    // Most standard 4-padas are 4 lines, combining them into 2 lines.
    if (lines.length === 4) {
        return `${lines[0]} ${lines[1]}\n${lines[2]} ${lines[3]}`;
    }

    // Handle 6 lines (e.g., 3 ardha-slokas)
    if (lines.length === 6) {
        return `${lines[0]} ${lines[1]}\n${lines[2]} ${lines[3]}\n${lines[4]} ${lines[5]}`;
    }

    return text;
};

for (const chapterKey in gitaData) {
    const chapter = gitaData[chapterKey];
    if (chapter.verses) {
        for (const verse of chapter.verses) {
            // Standardize IAST
            if (verse.iast) {
                const standardizedIast = standardizeLines(verse.iast);
                if (standardizedIast !== verse.iast) {
                    verse.iast = standardizedIast;
                    updatedIastCount++;
                }
            }

            // Standardize Sanskrit
            if (verse.sanskrit) {
                const standardizedSanskrit = standardizeLines(verse.sanskrit);
                if (standardizedSanskrit !== verse.sanskrit) {
                    verse.sanskrit = standardizedSanskrit;
                    updatedSanskritCount++;
                }
            }
        }
    }
}

if (updatedIastCount > 0 || updatedSanskritCount > 0) {
    fs.writeFileSync(gitaJsonPath, JSON.stringify(gitaData, null, 2), 'utf8');
    console.log(`Update complete.`);
    console.log(`Standardized IAST formatting for ${updatedIastCount} verses.`);
    console.log(`Standardized Sanskrit formatting for ${updatedSanskritCount} verses.`);
} else {
    console.log('No updates needed. Everything is already standardized.');
}
