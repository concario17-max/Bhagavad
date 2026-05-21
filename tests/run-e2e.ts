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

const runE2EChecks = async (): Promise<void> => {
    const server = await startStaticServer();
    const browser = await launchBrowser();

    try {
        const rootPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await goto(rootPage, `${server.baseUrl}/`);
        await rootPage.waitForURL(/\/#\/chapter\/1\/verse\/1$/);
        assert.match(rootPage.url(), /\/#\/chapter\/1\/verse\/1$/);
        await rootPage.waitForSelector('text=Chapter 1, Verse 1');
        await rootPage.waitForSelector('text=Primary Verse');
        await rootPage.waitForSelector('text=Commentary');
        await rootPage.close();

        const desktopPage = await browser.newPage({ viewport: { width: 1600, height: 960 } });
        await goto(desktopPage, `${server.baseUrl}/#/chapter/1/verse/1`);
        await desktopPage.waitForSelector('text=Chapter 1, Verse 1');
        await desktopPage.waitForSelector('text=Primary Verse');
        await desktopPage.waitForSelector('text=Commentary');

        const desktopToggle = desktopPage.locator('button[aria-pressed]');
        await desktopToggle.waitFor({ state: 'visible' });
        await assert.equal(await desktopToggle.isEnabled(), true);
        const desktopInitialPressed = await desktopToggle.getAttribute('aria-pressed');
        const desktopInitialLabel = (await desktopToggle.textContent())?.trim();
        assert.equal(desktopInitialPressed, 'true');
        assert.match(desktopInitialLabel ?? '', /Comic/);
        await desktopToggle.click();
        await desktopPage.waitForFunction(() => {
            const button = document.querySelector<HTMLButtonElement>('button[aria-pressed]');
            return button?.getAttribute('aria-pressed') === 'false' && (button.textContent ?? '').includes('Commentary');
        });
        assert.equal(await desktopToggle.getAttribute('aria-pressed'), 'false');
        assert.match((await desktopToggle.textContent())?.trim() ?? '', /Commentary/);
        await desktopPage.close();

        const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
        await goto(mobilePage, `${server.baseUrl}/#/chapter/1/verse/1`);
        await mobilePage.waitForSelector('text=Chapter 1, Verse 1');
        await mobilePage.waitForSelector('text=Primary Verse');
        await mobilePage.waitForSelector('text=Commentary');

        const mobileToggle = mobilePage.locator('button[aria-pressed]');
        if (await mobileToggle.count()) {
            await mobileToggle.waitFor({ state: 'visible' });
            await assert.equal(await mobileToggle.isEnabled(), true);
        } else {
            await mobilePage.waitForSelector('img[alt="1.1 comic page"]');
            await assert.equal(await mobilePage.locator('img[alt="1.1 comic page"]').isVisible(), true);
        }
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
