import assert from 'node:assert/strict';
import {
    DESKTOP_VERSE_COLUMNS_DEFAULT,
    DESKTOP_VERSE_COLUMNS_FULL_WIDTH,
    DESKTOP_VERSE_COLUMNS_LEFT_CLOSED,
    DESKTOP_VERSE_COLUMNS_NO_RIGHT,
    getDesktopVerseColumns
} from '../src/components/ui/desktopVerseLayout';
import { isDisplayableCommentary } from '../src/utils/content';
import { getNextVersePath, getPreviousVersePath, getVerseRange, resolveVerse } from '../src/utils/verse';
import { GitaData } from '../src/types';

const sampleData: GitaData = {
    '1': {
        chapter: 1,
        verses: [
            {
                id: '1.1',
                chapter: 1,
                verse: 1,
                sanskrit: 'verse one',
                iast: 'verse one'
            },
            {
                id: '1.4-6',
                chapter: 1,
                verse: 4,
                sanskrit: 'verse four to six',
                iast: 'verse four to six'
            },
            {
                id: '1.7',
                chapter: 1,
                verse: 7,
                sanskrit: 'verse seven',
                iast: 'verse seven'
            }
        ]
    },
    '2': {
        chapter: 2,
        verses: [
            {
                id: '2.1',
                chapter: 2,
                verse: 1,
                sanskrit: 'chapter two verse one',
                iast: 'chapter two verse one'
            }
        ]
    }
};

const runUnitChecks = (): void => {
    assert.equal(getDesktopVerseColumns(true, true), DESKTOP_VERSE_COLUMNS_DEFAULT);
    assert.equal(getDesktopVerseColumns(false, true), DESKTOP_VERSE_COLUMNS_LEFT_CLOSED);
    assert.equal(getDesktopVerseColumns(true, false), DESKTOP_VERSE_COLUMNS_NO_RIGHT);
    assert.equal(getDesktopVerseColumns(false, false), DESKTOP_VERSE_COLUMNS_FULL_WIDTH);

    assert.equal(resolveVerse(sampleData, '1', '1')?.id, '1.1');
    assert.equal(resolveVerse(sampleData, '1', '4')?.id, '1.4-6');
    assert.equal(resolveVerse(sampleData, '1', '5')?.id, '1.4-6');
    assert.equal(resolveVerse(sampleData, '1', '6')?.id, '1.4-6');
    assert.equal(resolveVerse(sampleData, '1', '7')?.id, '1.7');
    assert.equal(resolveVerse(sampleData, '9', '1'), null);

    const groupedVerse = sampleData['1'].verses[1];
    const singleVerse = sampleData['1'].verses[2];
    assert.equal(getVerseRange(sampleData['1'], groupedVerse), '4-6');
    assert.equal(getVerseRange(sampleData['1'], singleVerse), '7');

    const firstVerse = sampleData['1'].verses[0];
    const lastVerse = sampleData['1'].verses[2];
    assert.equal(getPreviousVersePath(sampleData, '1', firstVerse), null);
    assert.equal(getPreviousVersePath(sampleData, '1', groupedVerse), '/chapter/1/verse/1');
    assert.equal(getNextVersePath(sampleData, '1', groupedVerse), '/chapter/1/verse/7');
    assert.equal(getNextVersePath(sampleData, '1', lastVerse), '/chapter/2/verse/1');

    assert.equal(isDisplayableCommentary('Readable commentary paragraph.'), true);
    assert.equal(isDisplayableCommentary(''), false);
    assert.equal(isDisplayableCommentary('$placeholder block'), false);
    assert.equal(isDisplayableCommentary('Hindi commentary by source metadata'), false);
    assert.equal(isDisplayableCommentary('धर्मक्षेत्रे कुरुक्षेत्रे'), false);
};

runUnitChecks();
console.log('Unit checks passed.');
