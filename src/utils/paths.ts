const trimSlashes = (value: string): string => value.replace(/^\/+|\/+$/g, '');

export const getBasePath = (): string => {
    const base = import.meta.env.BASE_URL || '/';
    return base.endsWith('/') ? base : `${base}/`;
};

export const withBasePath = (path: string): string => {
    const normalizedPath = trimSlashes(path);
    const base = getBasePath();
    return normalizedPath ? `${base}${normalizedPath}` : base;
};

export const scrollAppContainerToTop = (): void => {
    const scrollContainer = document.getElementById('app-scroll-container');
    if (scrollContainer instanceof HTMLElement) {
        scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
        return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
};
