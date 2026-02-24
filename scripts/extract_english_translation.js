import fs from 'fs/promises';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GITA_JSON_PATH = path.join(__dirname, '../public/gita.json');

/**
 * JKYog (holy-bhagavad-gita.org)에서 영문 해석 텍스트만 추출하는 순수 함수
 * @param {import('playwright').Page} page
 * @param {number} chapter 
 * @param {string} verseStr - 구절 번호 문자열 (예: "1", "4-6")
 * @returns {Promise<string>}
 */
async function extractEnglishTranslation(page, chapter, verseStr) {
    const url = `https://www.holy-bhagavad-gita.org/chapter/${chapter}/verse/${verseStr}`;
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        // JKYog DOM 구조에 맞춘 셀렉터 (ID 'translation' 하위 텍스트)
        const translationLocator = page.locator('#translation');
        await translationLocator.waitFor({ state: 'attached', timeout: 30000 });
        const translation = await translationLocator.textContent();
        return translation ? translation.trim() : null;
    } catch (error) {
        console.error(`[에러] Chapter ${chapter} Verse ${verseStr} 추출 실패:`, error.message);
        return null;
    }
}

/**
 * 전체 번역 데이터를 크롤링하고 gita.json을 병합하는 메인 파이프라인
 */
async function syncTranslations() {
    console.log('🚀 메타 디자인 최적화를 위한 영문 번역 데이터 추출 파이프라인 시작');

    const rawData = await fs.readFile(GITA_JSON_PATH, 'utf-8');
    /** @type {Record<string, { chapter: number, verses: any[] }>} */
    const gitaData = JSON.parse(rawData);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    // 모든 챕터 순회 O(N)
    for (const chapterKey of Object.keys(gitaData)) {
        const chapterObj = gitaData[chapterKey];
        console.log(`\n📚 Chapter ${chapterObj.chapter} 파싱 시작...`);

        for (const verse of chapterObj.verses) {
            if (!verse.translation_en || verse.translation_en.includes('।।')) {
                // 합쳐진 구절 처리 로직 (오디오 URL 파일명에서 004-006 파싱 -> 4-6 변환)
                let verseStr = verse.verse.toString();
                if (verse.audio) {
                    const match = verse.audio.match(/_(\d+(?:-\d+)?)\.mp3$/);
                    if (match) {
                        verseStr = match[1].split('-').map(Number).join('-'); // '004-006' -> '4-6', '001' -> '1'
                    }
                }

                // 힌디어가 포함된 쓰레기 데이터거나 비어있는 경우 다시 크롤링
                const engText = await extractEnglishTranslation(page, verse.chapter, verseStr);
                if (engText) {
                    verse.translation_en = engText;
                    console.log(`✅ ${verse.id} 업데이트 완료: ${engText.substring(0, 30)}...`);
                } else {
                    console.log(`❌ ${verse.id} 추출 실패 (${verseStr})`);
                }
                // 사이트 부하 방지를 위한 딜레이
                await new Promise(r => setTimeout(r, 1000));
            } else {
                console.log(`⏩ ${verse.id} (이미 최적화된 영문 적용됨) 스킵`);
            }
        }
    }

    await browser.close();

    // 추출 완료 후 무결성 갖춘 데이터로 덮어쓰기
    await fs.writeFile(GITA_JSON_PATH, JSON.stringify(gitaData, null, 2), 'utf-8');
    console.log('\n🎉 전 구절 영문 번역 매핑 및 gita.json 업데이트 완료');
}

// 스크립트 단일 진입점
syncTranslations().catch(console.error);
