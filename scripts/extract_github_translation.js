import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GITA_JSON_PATH = path.join(__dirname, '../public/gita.json');

/**
 * GitHub 오픈소스 레포지토리 (gita API json) 에서 번역 데이터 fetch
 */
async function syncFromGithub() {
    console.log('🚀 메타 디자인 최적화를 위한 GitHub Raw JSON 연동 파이프라인 시작');

    try {
        const rawData = await fs.readFile(GITA_JSON_PATH, 'utf-8');
        const gitaData = JSON.parse(rawData);

        // 오픈소스 Gita JSON 데이터 (전체 구절 포함)
        const response = await fetch('https://raw.githubusercontent.com/vedicscriptures/bhagavad-gita-api/master/data/translation.json');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const translations = await response.json();
        // translations 구조: [{ "id": 16, "description": "...", "authorName": "Swami Sivananda", "lang": "english", "verseNumber": "1.1" }]
        // JKYog 번역에 가장 가까운 거나 Swami Sivananda 등 영어 해석본 필터링
        const engTranslations = translations.filter(t => t.lang === 'english');

        // 매핑 딕셔너리 최적화 (O(1) 룩업)
        const transMap = {};
        for (const t of engTranslations) {
            // 여러 저자가 있을 수 있으므로 첫 번째 해설이나 특정 저자 선호
            if (!transMap[t.verseNumber]) {
                transMap[t.verseNumber] = t.description;
            }
        }

        let updatedCount = 0;

        // 데이터 정규화 및 병합 (O(N))
        for (const chapterKey of Object.keys(gitaData)) {
            const chapterObj = gitaData[chapterKey];

            for (const verse of chapterObj.verses) {
                if (!verse.translation_en || verse.translation_en.includes('।।')) {
                    // 단일 구절 번호 (예: "1.1") 매핑
                    const exactMatch = transMap[verse.id];

                    if (exactMatch) {
                        verse.translation_en = exactMatch;
                        console.log(`✅ ${verse.id} 매핑 완료: ${exactMatch.substring(0, 30)}...`);
                        updatedCount++;
                    } else if (verse.audio) {
                        // "4-6" 같이 합쳐진 구절의 경우 4번 구절 해석이라도 넣기
                        const match = verse.audio.match(/_(\d+(?:-\d+)?)\.mp3$/);
                        if (match) {
                            const baseVerse = match[1].split('-')[0]; // "4-6" -> "4"
                            const fallbackMatch = transMap[`${verse.chapter}.${baseVerse}`];
                            if (fallbackMatch) {
                                verse.translation_en = fallbackMatch;
                                console.log(`⚠️ ${verse.id} (그룹 구절) 매핑 완료: ${fallbackMatch.substring(0, 30)}...`);
                                updatedCount++;
                            } else {
                                console.log(`❌ ${verse.id} 추출 실패 (매핑 데이터 없음)`);
                            }
                        }
                    }
                } else {
                    console.log(`⏩ ${verse.id} 스킵 (이미 번역됨)`);
                }
            }
        }

        // 추출 완료 후 무결성 갖춘 데이터로 덮어쓰기
        await fs.writeFile(GITA_JSON_PATH, JSON.stringify(gitaData, null, 2), 'utf-8');
        console.log(`\n🎉 총 ${updatedCount}개 구절 영문 번역 매핑 및 gita.json 업데이트 완료`);

    } catch (e) {
        console.error('크래시 발생:', e);
    }
}

syncFromGithub();
