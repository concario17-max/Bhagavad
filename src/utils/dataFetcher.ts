import { GitaData } from '../types';

let gitaDataPromise: Promise<GitaData> | null = null;

export const fetchGitaData = (): Promise<GitaData> => {
    if (!gitaDataPromise) {
        gitaDataPromise = fetch('/gita.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json() as Promise<GitaData>;
            })
            .catch(error => {
                console.error("Fetch Gita Data Error:", error);
                gitaDataPromise = null;
                throw error;
            });
    }
    return gitaDataPromise;
};
