import { GitaData } from '../types';
import { withBasePath } from './paths';

let gitaDataCache: GitaData | null = null;
let gitaDataPromise: Promise<GitaData> | null = null;

const requestGitaData = async (): Promise<GitaData> => {
    const response = await fetch(withBasePath('gita.json'));
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json() as GitaData;
    gitaDataCache = data;
    return data;
};

export const fetchGitaData = (): Promise<GitaData> => {
    if (gitaDataCache) {
        return Promise.resolve(gitaDataCache);
    }

    if (!gitaDataPromise) {
        gitaDataPromise = requestGitaData()
            .catch(error => {
                console.error('Fetch Gita Data Error:', error);
                gitaDataPromise = null;
                throw error;
            });
    }

    return gitaDataPromise;
};

export const getCachedGitaData = (): GitaData | null => gitaDataCache;

export const preloadGitaData = (): void => {
    void fetchGitaData();
};
