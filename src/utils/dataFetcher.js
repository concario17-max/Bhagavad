let gitaDataPromise = null;

export const fetchGitaData = () => {
    if (!gitaDataPromise) {
        gitaDataPromise = fetch('/gita.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .catch(error => {
                console.error("Fetch Gita Data Error:", error);
                // Reset promise on error so it can be retried if needed
                gitaDataPromise = null;
                throw error;
            });
    }
    return gitaDataPromise;
};
