import fs from 'fs';
import path from 'path';

const TXT_FILE = '1.han bal-1.txt';
const JSON_FILE = 'public/gita.json';

async function updatePronunciation() {
    try {
        const txtData = fs.readFileSync(TXT_FILE, 'utf8');
        const gitaJson = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

        const lines = txtData.split('\n');
        let currentChapter = 0;
        const pronunciations = {}; // { "ch.v": "text" }

        let currentVerseKey = null;
        let currentText = [];

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Chapter marker: 제N장
            const chMatch = line.match(/^제(\d+)장/);
            if (chMatch) {
                currentChapter = parseInt(chMatch[1]);
                continue;
            }

            // Verse marker: N.M or N.M-K
            const vMatch = line.match(/^(\d+)\.(\d+)(?:-(\d+))?/);
            if (vMatch) {
                // Save previous
                if (currentVerseKey) {
                    pronunciations[currentVerseKey] = currentText.join('\n');
                }

                const chId = parseInt(vMatch[1]);
                const vStart = parseInt(vMatch[2]);
                // We use the start verse as the key to match gita.json structure
                currentVerseKey = `${chId}.${vStart}`;
                currentText = [];
                
                // If there's content after the marker on the same line, though usually it's just name
                // In your file, 1.1 has "드리타라쉬트라 우바차" which is not pronunciation
                // The actual pronunciation follows on the next line
                continue;
            }

            if (currentVerseKey) {
                currentText.push(line);
            }
        }

        // Save last
        if (currentVerseKey) {
            pronunciations[currentVerseKey] = currentText.join('\n');
        }

        // Apply to JSON
        let updatedCount = 0;
        for (const chId in gitaJson) {
            const ch = gitaJson[chId];
            for (const verse of ch.verses) {
                const key = `${chId}.${verse.verse}`;
                if (pronunciations[key]) {
                    verse.korean_pronunciation = pronunciations[key];
                    updatedCount++;
                }
            }
        }

        fs.writeFileSync(JSON_FILE, JSON.stringify(gitaJson, null, 2));
        console.log(`Successfully updated ${updatedCount} verses.`);

    } catch (err) {
        console.error('Error:', err);
    }
}

updatePronunciation();
