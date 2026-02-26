import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitaJsonPath = path.join(__dirname, '..', 'public', 'gita.json');
const lexiconJsonPath = path.join(__dirname, '..', 'public', 'lexicon.json');

try {
    const rawData = fs.readFileSync(gitaJsonPath, 'utf-8');
    const gitaData = JSON.parse(rawData);

    // lexiconMap: { 'A': [ { word: 'ABHAVA', meaning: '...' }, ... ], ... }
    const lexiconMap = {};

    for (const chapterKey in gitaData) {
        const chapter = gitaData[chapterKey];
        if (chapter && Array.isArray(chapter.verses)) {
            for (const verse of chapter.verses) {
                if (Array.isArray(verse.words)) {
                    for (const wordObj of verse.words) {
                        if (wordObj.s && wordObj.m) {
                            // Clean up word (remove punctuation, trim)
                            let cleanWord = wordObj.s.replace(/[.,:;।॥?!()"]/g, '').trim().toUpperCase();

                            // Normalize transliteration to basic latin char for category grouping
                            // Removing macrons, dots, etc to find base alphabetical letter
                            let normalizedLetter = cleanWord.charAt(0).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

                            // fallback for non-letters (if any)
                            if (!/^[A-Z]$/.test(normalizedLetter)) {
                                continue;
                            }

                            if (!lexiconMap[normalizedLetter]) {
                                lexiconMap[normalizedLetter] = [];
                            }

                            // Check if word already exists to avoid duplicates
                            const exists = lexiconMap[normalizedLetter].find(w => w.word === cleanWord);
                            if (!exists) {
                                lexiconMap[normalizedLetter].push({
                                    word: cleanWord,
                                    meaning: wordObj.m.trim()
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    // Sort words within each letter category alphabetically
    for (const letter in lexiconMap) {
        lexiconMap[letter].sort((a, b) => a.word.localeCompare(b.word));
    }

    fs.writeFileSync(lexiconJsonPath, JSON.stringify(lexiconMap, null, 2), 'utf-8');
    console.log(`Successfully generated lexicon.json with ${Object.keys(lexiconMap).length} letter categories.`);

} catch (error) {
    console.error("Error processing lexicon data:", error);
}
