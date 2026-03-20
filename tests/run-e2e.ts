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

const readWidths = async (page: Page): Promise<{ left: number; main: number; right: number }> => {
    return page.evaluate(() => {
        const leftPanel = document.querySelector<HTMLElement>('[data-testid="left-panel"]');
        const mainPanel = document.querySelector<HTMLElement>('[data-testid="main-scroll-container"]');
        const rightPanel = document.querySelector<HTMLElement>('[data-testid="right-panel"]');

        return {
            left: leftPanel ? Math.round(leftPanel.getBoundingClientRect().width) : 0,
            main: mainPanel ? Math.round(mainPanel.getBoundingClientRect().width) : 0,
            right: rightPanel ? Math.round(rightPanel.getBoundingClientRect().width) : 0
        };
    });
};

const waitForWidths = async (
    page: Page,
    expected: { left: number; main: number; right: number }
): Promise<void> => {
    await page.waitForFunction(
        dims => {
            const leftPanel = document.querySelector<HTMLElement>('[data-testid="left-panel"]');
            const mainPanel = document.querySelector<HTMLElement>('[data-testid="main-scroll-container"]');
            const rightPanel = document.querySelector<HTMLElement>('[data-testid="right-panel"]');

            const current = {
                left: leftPanel ? Math.round(leftPanel.getBoundingClientRect().width) : 0,
                main: mainPanel ? Math.round(mainPanel.getBoundingClientRect().width) : 0,
                right: rightPanel ? Math.round(rightPanel.getBoundingClientRect().width) : 0
            };

            return current.left === dims.left && current.main === dims.main && current.right === dims.right;
        },
        expected
    );
};

const runE2EChecks = async (): Promise<void> => {
    const server = await startStaticServer();
    const browser = await launchBrowser();

    try {
        const homePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await goto(homePage, `${server.baseUrl}/`);
        await homePage.waitForSelector('text=BHAGAVAD GITA');
        await homePage.waitForSelector('select');
        const chapterOptionCount = await homePage.locator('select').first().locator('option').count();
        assert.equal(chapterOptionCount, 19);
        await homePage.close();

        const desktopPage = await browser.newPage({ viewport: { width: 1600, height: 960 } });
        await goto(desktopPage, `${server.baseUrl}/#/chapter/1/verse/1`);
        await desktopPage.waitForSelector('text=Chapter 1, Verse 1');
        await desktopPage.waitForSelector('text=Primary Verse');
        await desktopPage.getByRole('button', { name: /hide commentary panel/i }).click();
        await desktopPage.waitForFunction(() => document.querySelector('[data-testid="right-panel"]')?.getAttribute('data-desktop-open') === 'false');
        await desktopPage.getByRole('button', { name: /show commentary panel/i }).click();
        await desktopPage.waitForFunction(() => document.querySelector('[data-testid="right-panel"]')?.getAttribute('data-desktop-open') === 'true');
        await desktopPage.waitForSelector('[data-testid="right-panel"] h2');

        await waitForWidths(desktopPage, { left: 320, main: 960, right: 320 });
        assert.deepEqual(await readWidths(desktopPage), { left: 320, main: 960, right: 320 });
        await desktopPage.getByRole('button', { name: /toggle chapter navigation/i }).click();
        await waitForWidths(desktopPage, { left: 0, main: 960, right: 640 });
        assert.deepEqual(await readWidths(desktopPage), { left: 0, main: 960, right: 640 });
        await desktopPage.getByRole('button', { name: /toggle chapter navigation/i }).click();
        await desktopPage.getByRole('button', { name: /hide commentary panel/i }).click();
        await waitForWidths(desktopPage, { left: 320, main: 1280, right: 0 });
        assert.deepEqual(await readWidths(desktopPage), { left: 320, main: 1280, right: 0 });
        await desktopPage.getByRole('button', { name: /toggle chapter navigation/i }).click();
        await waitForWidths(desktopPage, { left: 0, main: 1600, right: 0 });
        assert.deepEqual(await readWidths(desktopPage), { left: 0, main: 1600, right: 0 });
        await desktopPage.close();

        const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
        await goto(mobilePage, `${server.baseUrl}/#/chapter/1/verse/1`);
        await mobilePage.waitForSelector('text=Chapter 1, Verse 1');
        await mobilePage.getByRole('button', { name: /toggle chapter navigation/i }).click();
        await mobilePage.waitForFunction(() => document.querySelector('[data-testid="left-panel"]')?.getAttribute('data-mobile-open') === 'true');
        assert.equal(await mobilePage.locator('[data-testid="left-panel"]').getAttribute('data-panel-position'), 'left');
        await mobilePage.getByRole('button', { name: /close chapters/i }).click();
        await mobilePage.getByRole('button', { name: /show commentary panel|hide commentary panel/i }).click();
        await mobilePage.waitForFunction(() => document.querySelector('[data-testid="right-panel"]')?.getAttribute('data-mobile-open') === 'true');
        assert.equal(await mobilePage.locator('[data-testid="right-panel"]').getAttribute('data-panel-position'), 'right');
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
