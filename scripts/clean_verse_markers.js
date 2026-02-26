import fs from 'fs';

const JSON_FILE = 'public/gita.json';

async function cleanMarkers() {
    try {
        const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
        let cleanedSanskritCount = 0;
        let cleanedTranslationCount = 0;

        // Pattern for verse markers like ।।1.1।। or 1.1।। or ।।1.1
        // Handles ranges like 1.4-6 too.
        // It also handles trailing newlines or spaces.
        const markerRegex = /।*\s*।।\d+\.\d+(?:-\d+)?।।\s*।*/g;
        const simpleMarkerRegex = /\d+\.\d+(?:-\d+)?।।/g;
        const startMarkerRegex = /।।\d+\.\d+(?:-\d+)?/g;

        for (const chId in data) {
            const ch = data[chId];
            for (const verse of ch.verses) {
                const oldSanskrit = verse.sanskrit;
                const oldTranslation = verse.translation_en;

                // Clean Sanskrit
                // We want to remove the whole line if it's just the marker
                verse.sanskrit = verse.sanskrit
                    .replace(/\n*\s*।।\d+\.\d+(?:-\d+)?।।\s*\n*/g, '\n')
                    .replace(/।।\d+\.\d+(?:-\d+)?।।/g, '')
                    .replace(/\d+\.\d+(?:-\d+)?।।/g, '')
                    .replace(/।।\d+\.\d+(?:-\d+)?/g, '')
                    .trim();

                // Clean Translation_en
                if (verse.translation_en) {
                    verse.translation_en = verse.translation_en
                        .replace(/।।\d+\.\d+(?:-\d+)?।।/g, '')
                        .replace(/\d+\.\d+(?:-\d+)?।।/g, '')
                        .replace(/।।\d+\.\d+(?:-\d+)?/g, '')
                        .trim();
                }

                if (oldSanskrit !== verse.sanskrit) cleanedSanskritCount++;
                if (oldTranslation !== verse.translation_en) cleanedTranslationCount++;
            }
        }

        fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
        console.log(`Cleaned Sanskrit markers in ${cleanedSanskritCount} verses.`);
        console.log(`Cleaned Translation markers in ${cleanedTranslationCount} verses.`);

    } catch (err) {
        console.error('Error:', err);
    }
}

cleanMarkers();
