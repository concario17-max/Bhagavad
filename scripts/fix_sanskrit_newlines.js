import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitaJsonPath = path.join(__dirname, '..', 'public', 'gita.json');

try {
    const rawData = fs.readFileSync(gitaJsonPath, 'utf-8');
    const gitaData = JSON.parse(rawData);

    let updatedCount = 0;

    for (const chapterKey in gitaData) {
        const chapter = gitaData[chapterKey];
        if (chapter && Array.isArray(chapter.verses)) {
            for (const verse of chapter.verses) {
                if (verse.sanskrit) {
                    const original = verse.sanskrit;

                    // Replace single Danda (।) with Danda + Newline, 
                    // ONLY IF it's not followed by another Danda (to avoid splitting double Danda ।।)
                    // and ONLY IF it's not already followed by a newline.
                    const updated = verse.sanskrit.replace(/।(?!।|\n)/g, '।\n');

                    if (original !== updated) {
                        verse.sanskrit = updated;
                        updatedCount++;
                    }
                }
            }
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(gitaJsonPath, JSON.stringify(gitaData, null, 2), 'utf-8');
        console.log(`Successfully updated ${updatedCount} verses with proper line breaks in Sanskrit text.`);
    } else {
        console.log(`No updates needed. Everything looks fine.`);
    }

} catch (error) {
    console.error("Error processing gita.json:", error);
}
