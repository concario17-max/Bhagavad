import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TXT4_PATH = path.join(__dirname, '../4.ham.txt');
const TXT5_PATH = path.join(__dirname, '../5.gil.txt');
const JSON_PATH = path.join(__dirname, '../public/gita.json');

async function parseTxt(filePath) {
    const textData = await fs.readFile(filePath, 'utf-8');
    const lines = textData.split('\n');
    let currentChapter = 0;
    const translationMap = {}; // { chapter: { verseStr: text } }

    let currentVerseStr = null;
    let currentTranslation = [];

    const saveCurrent = () => {
        if (currentChapter && currentVerseStr && currentTranslation.length > 0) {
            translationMap[currentChapter][currentVerseStr] = currentTranslation.join(' ').trim();
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // 제1장 아르주나의 고민 / 제 2장 ...
        const chapterMatch = line.match(/^제\s*(\d+)\s*장/);
        if (chapterMatch) {
            saveCurrent();
            currentChapter = chapterMatch[1];
            if (!translationMap[currentChapter]) {
                translationMap[currentChapter] = {};
            }
            currentVerseStr = null;
            currentTranslation = [];
            continue;
        }

        // 1. 텍스트 / 4-6. 텍스트
        const verseMatch = line.match(/^(\d+(?:-\d+)?)\.\s*(.*)/);
        if (verseMatch) {
            saveCurrent();
            currentVerseStr = verseMatch[1];
            currentTranslation = [verseMatch[2]];
            continue;
        }

        if (currentChapter && currentVerseStr) {
            // 필터링: 5.gil.txt에 있는 안내 메시지 등 불필요한 텍스트 제외
            if (line.startsWith('좋아요') || line.includes('정리하면')) {
                continue;
            }
            currentTranslation.push(line);
        }
    }
    saveCurrent();

    return translationMap;
}

async function syncTranslations() {
    console.log('🚀 메타 디자인 최적화를 위한 4번, 5번 로컬 파싱 파이프라인 시작');
    try {
        const map4 = await parseTxt(TXT4_PATH);
        const map5 = await parseTxt(TXT5_PATH);

        const rawJson = await fs.readFile(JSON_PATH, 'utf-8');
        const gitaData = JSON.parse(rawJson);

        let count4 = 0;
        let count5 = 0;

        for (const chapterKey of Object.keys(gitaData)) {
            const chapterObj = gitaData[chapterKey];
            const t4Chap = map4[chapterKey];
            const t5Chap = map5[chapterKey];

            for (const verse of chapterObj.verses) {
                const verseStr = verse.verse.toString();

                // Helper to find match
                const findMatch = (mapChap, vStr, vNum) => {
                    if (!mapChap) return null;
                    // 완전 일치
                    if (mapChap[vStr]) return mapChap[vStr];

                    // 범위 구절 (예: 4-6) 안에 포함되는지 확인
                    for (const key of Object.keys(mapChap)) {
                        if (key.includes('-')) {
                            const [start, end] = key.split('-').map(Number);
                            if (vNum >= start && vNum <= end) {
                                return mapChap[key];
                            }
                        }
                    }
                    return null;
                };

                const ext4 = findMatch(t4Chap, verseStr, verse.verse);
                if (ext4) {
                    verse.translation_ham = ext4;
                    count4++;
                }

                const ext5 = findMatch(t5Chap, verseStr, verse.verse);
                if (ext5) {
                    verse.translation_gil = ext5;
                    count5++;
                }
            }
        }

        await fs.writeFile(JSON_PATH, JSON.stringify(gitaData, null, 2), 'utf-8');
        console.log(`\n🎉 4번 번역(ham) ${count4}개, 5번 번역(gil) ${count5}개 업데이트 완료!`);

    } catch (e) {
        console.error('크래시 발생:', e);
    }
}

syncTranslations();
