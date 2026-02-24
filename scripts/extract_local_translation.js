import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TXT_PATH = path.join(__dirname, '../3.eng.txt');
const JSON_PATH = path.join(__dirname, '../public/gita.json');

async function syncFromText() {
    console.log('🚀 메타 디자인 최적화를 위한 3.eng.txt 로컬 파싱 파이프라인 시작');
    try {
        const textData = await fs.readFile(TXT_PATH, 'utf-8');
        const rawJson = await fs.readFile(JSON_PATH, 'utf-8');
        const gitaData = JSON.parse(rawJson);

        // 1. 텍스트 파싱을 위한 맵핑 딕셔너리 구축 (챕터별 구절)
        // 패턴 매칭: "Verse 1-2\n내용" 또는 "Verse 1\n내용"
        const lines = textData.split('\n');
        let currentChapter = null;
        let currentVerseStr = null;
        let currentTranslation = [];

        // 구조: { "1": { "1": "text", "2": "text", "4-6": "text" } }
        const translationMap = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // 챕터 감지
            const chapterMatch = line.match(/^Chapter\s+(\d+):/i);
            if (chapterMatch) {
                currentChapter = chapterMatch[1];
                translationMap[currentChapter] = {};
                currentVerseStr = null;
                continue;
            }

            // Verse 감지
            const verseMatch = line.match(/^Verse\s+([\d-]+)/i);
            if (verseMatch) {
                // 이전 번역 저장
                if (currentChapter && currentVerseStr && currentTranslation.length > 0) {
                    translationMap[currentChapter][currentVerseStr] = currentTranslation.join(' ').trim();
                }
                currentVerseStr = verseMatch[1];
                currentTranslation = [];
                continue;
            }

            // 구절 텍스트 수집 (Verse 이후 내용들)
            if (currentChapter && currentVerseStr) {
                currentTranslation.push(line);
            }
        }

        // 마지막 구절 저장
        if (currentChapter && currentVerseStr && currentTranslation.length > 0) {
            translationMap[currentChapter][currentVerseStr] = currentTranslation.join(' ').trim();
        }

        let updatedCount = 0;

        // 2. gita.json에 매핑 (O(N))
        for (const chapterKey of Object.keys(gitaData)) {
            const chapterObj = gitaData[chapterKey];
            const transChapter = translationMap[chapterKey];

            if (!transChapter) continue;

            for (const verse of chapterObj.verses) {
                const verseStr = verse.verse.toString();
                let englishText = null;

                // 단일 구절 매칭
                if (transChapter[verseStr]) {
                    englishText = transChapter[verseStr];
                }
                // 묶음 구절 (예: 4 -> "4-6" 맵에서 찾기)
                else {
                    // transChapter 키들을 순회하며 해당 구절 번호가 범위 안에 있는지 확인
                    for (const key of Object.keys(transChapter)) {
                        if (key.includes('-')) {
                            const [start, end] = key.split('-').map(Number);
                            if (verse.verse >= start && verse.verse <= end) {
                                englishText = transChapter[key];
                                break;
                            }
                        }
                    }
                }

                if (englishText && (!verse.translation_en || verse.translation_en.includes('।।'))) {
                    verse.translation_en = englishText;
                    updatedCount++;
                    console.log(`✅ ${verse.id} 업데이트: ${englishText.substring(0, 30)}...`);
                }
            }
        }

        // 3. 파일 저장
        await fs.writeFile(JSON_PATH, JSON.stringify(gitaData, null, 2), 'utf-8');
        console.log(`\n🎉 총 ${updatedCount}개 구절 영문 번역 매핑 및 gita.json 업데이트 완료`);

    } catch (err) {
        console.error('크래시 발생:', err);
    }
}

syncFromText();
