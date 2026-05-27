import assert from 'node:assert/strict';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { Browser, chromium, Page } from 'playwright';

const distRoot = join(process.cwd(), 'dist');

const mimeTypes: Record<string, string> = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mp3': 'audio/mpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8'
};

const createStaticHandler = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const requestPath = request.url === '/' || request.url === undefined ? '/index.html' : request.url.split('?')[0];
    const normalizedPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
    const relativePath = normalizedPath === '/' ? 'index.html' : normalizedPath.replace(/^[/\\]/, '');
    const filePath = join(distRoot, relativePath);

    try {
        const fileBuffer = await readFile(filePath);
        response.statusCode = 200;
        response.setHeader('Content-Type', mimeTypes[extname(filePath)] ?? 'application/octet-stream');
        response.end(fileBuffer);
    } catch {
        const indexBuffer = await readFile(join(distRoot, 'index.html'));
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(indexBuffer);
    }
};

const startStaticServer = async (): Promise<{ baseUrl: string; close: () => Promise<void> }> => {
    const server = createServer((request, response) => {
        void createStaticHandler(request, response);
    });

    await new Promise<void>((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => resolve());
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
        throw new Error('Failed to determine the local test server address.');
    }

    return {
        baseUrl: `http://127.0.0.1:${address.port}`,
        close: () => new Promise<void>((resolve, reject) => {
            server.close(error => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        })
    };
};

const launchBrowser = async (): Promise<Browser> => {
    try {
        return await chromium.launch({ channel: 'chrome', headless: true });
    } catch {
        return chromium.launch({ headless: true });
    }
};

const goto = async (page: Page, url: string): Promise<void> => {
    await page.goto(url, { waitUntil: 'networkidle' });
};

const assertVerseControls = async (page: Page): Promise<void> => {
    const chapterSelect = page.locator('select[aria-label="Select chapter"]');
    const verseSelect = page.locator('select[aria-label="Select verse"]');

    await chapterSelect.waitFor({ state: 'visible' });
    await verseSelect.waitFor({ state: 'visible' });
    await assert.equal(await chapterSelect.inputValue(), '1');
    await assert.equal(await verseSelect.inputValue(), '1');
};

const runE2EChecks = async (): Promise<void> => {
    const server = await startStaticServer();
    const browser = await launchBrowser();

    try {
        const rootPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await goto(rootPage, `${server.baseUrl}/`);
        await rootPage.waitForURL(/\/#\/chapter\/1\/verse\/1$/);
        assert.match(rootPage.url(), /\/#\/chapter\/1\/verse\/1$/);
        await assertVerseControls(rootPage);
        await rootPage.waitForSelector('text=Commentary');
        await rootPage.close();

        const desktopPage = await browser.newPage({ viewport: { width: 1600, height: 960 } });
        await goto(desktopPage, `${server.baseUrl}/#/chapter/1/verse/1`);
        await assertVerseControls(desktopPage);
        await desktopPage.waitForSelector('text=Commentary');
        await desktopPage.getByTitle('Switch to text').click();
        await desktopPage.waitForSelector('text=Primary Verse');
        await desktopPage.close();

        const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
        await goto(mobilePage, `${server.baseUrl}/#/chapter/1/verse/1`);
        await assertVerseControls(mobilePage);
        await mobilePage.waitForSelector('text=Commentary');

        const mobileToggle = mobilePage.getByTitle('Switch to text');
        await mobileToggle.waitFor({ state: 'visible' });
        await assert.equal(await mobileToggle.isEnabled(), true);
        await mobilePage.close();
    } finally {
        await browser.close();
        await server.close();
    }
};

void runE2EChecks()
    .then(() => {
        console.log('E2E checks passed.');
    })
    .catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
