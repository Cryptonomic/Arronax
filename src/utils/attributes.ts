export const getLocalAttributes = () => {
    const attributes = localStorage.getItem('attributes');
    if (attributes) {
        return JSON.parse(attributes);
    }
    return {};
};

export const saveAttributes = (attributes, timestamp, version) => {
    localStorage.setItem('attributes', JSON.stringify(attributes));
    localStorage.setItem('timestamp', timestamp);
    localStorage.setItem('version', version);
};


export const getTimeStampFromLocal = () => {
    const timestamp = localStorage.getItem('timestamp');
    if (timestamp) {
        return Number(timestamp);
    }
    return 0;
};

export function validateCache(version: number) {
    if (!localStorage.getItem('version')) {
        localStorage.clear();
        return;
    }

    if (Number(localStorage.getItem('version')) < version) {
        localStorage.clear();
        return;
    }
}
