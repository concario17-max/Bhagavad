import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MD_PATH = path.join(__dirname, '../translation_en.md');

async function patchMd() {
    let mdData = await fs.readFile(MD_PATH, 'utf-8');

    // 1.4 Patch
    mdData = mdData.replace(
        /## \[1\.4\]\r?\n\$15/,
        '## [1.4]\nHere are heroes, mighty archers, equal in battle to Bhima and Arjuna, Yuyudhana (Satyaki), Virata, and Drupada—all mighty warriors. Dhrishtaketu, Chekitana, the valiant king of Kasi, Purujit, Kuntibhoja, and Saibya—the best of men. The strong Yudhamanyu and the brave Uttamaujas, the son of Subhadra (Abhimanyu, the son of Subhadra and Arjuna), and the sons of Draupadi, all of them great charioteers (great heroes)."'
    );

    // 13.35 Patch
    mdData = mdData.replace(
        /## \[13\.35\]\r?\nइस प्रकार जो ज्ञानरूपी नेत्रसे क्षेत्र और क्षेत्रज्ञके अन्तर-\(विभाग-\) को तथा कार्य-कारणसहित प्रकृतिसे स्वयंको अलग जानते हैं, वे परमात्माको प्राप्त हो जाते हैं।/,
        '## [13.35]\nThey who, by the eye of knowledge, perceive the distinction between the field and its knower, as well as the liberation from the Nature of being, go to the Supreme.'
    );

    await fs.writeFile(MD_PATH, mdData, 'utf-8');
    console.log('✅ Patched translation_en.md with missing English translations.');
}

patchMd();
