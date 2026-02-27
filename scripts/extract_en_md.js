import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MD_PATH = path.join(__dirname, '../translation_en.md');
const JSON_PATH = path.join(__dirname, '../public/gita.json');

async function syncFromMd() {
    console.log('🚀 메타 디자인 최적화를 위한 translation_en.md 로컬 파싱 파이프라인 시작');
    try {
        const mdData = await fs.readFile(MD_PATH, 'utf-8');
        const rawJson = await fs.readFile(JSON_PATH, 'utf-8');
        const gitaData = JSON.parse(rawJson);

        const lines = mdData.split('\n');
        let currentVerseId = null;
        let currentTranslation = [];
        const translationMap = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // "## [1.1]" 또는 "## [1.4]" 같은 패턴 찾기
            const verseMatch = line.match(/^##\s*\[(.*?)\]/);
            if (verseMatch) {
                if (currentVerseId && currentTranslation.length > 0) {
                    translationMap[currentVerseId] = currentTranslation.join('\n').trim();
                }
                currentVerseId = verseMatch[1];
                currentTranslation = [];
                continue;
            }

            if (currentVerseId && line) {
                currentTranslation.push(line);
            }
        }

        if (currentVerseId && currentTranslation.length > 0) {
            translationMap[currentVerseId] = currentTranslation.join('\n').trim();
        }

        let updatedCount = 0;

        for (const chapterKey of Object.keys(gitaData)) {
            const chapterObj = gitaData[chapterKey];
            for (const verse of chapterObj.verses) {
                const vid = verse.id; // "1.4"
                let newText = translationMap[vid];

                if (vid === '1.4' || vid === '13.35') {
                    console.log(`[DEBUG] ${vid} newText: ${newText}`);
                    console.log(`[DEBUG] ${vid} originText: ${verse.translation_en}`);
                }

                // 만약 verse_id로 매칭 안되는 경우, "1.4-6" 식의 그룹 구절일 수도 있음.
                // gita.json 에는 verse.id 가 "1.4", "1.5", "1.6" 혹은 "1.4-6" 일 수 있음.
                // 기본적으로 translation_en.md의 키와 gita.json의 verse.id 값이 일치하면 적용.
                if (newText && verse.translation_en !== newText) {
                    verse.translation_en = newText;
                    updatedCount++;
                    console.log(`✅ ${vid} 업데이트: ${newText.substring(0, 30)}...`);
                }
            }
        }

        await fs.writeFile(JSON_PATH, JSON.stringify(gitaData, null, 2), 'utf-8');
        console.log(`\n🎉 총 ${updatedCount}개 구절 영문 번역 매핑 및 gita.json 업데이트 완료`);
    } catch (err) {
        console.error('크래시 발생:', err);
    }
}

syncFromMd();
