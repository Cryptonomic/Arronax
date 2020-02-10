import { ProcessedValue } from '../types';
export const getLocalAttributes = () => {
    const attributes = localStorage.getItem('attributes');
    if (attributes) {
        return JSON.parse(attributes);
    }
    return {};
};

export const saveAttributes = (attributes: any, timestamp: any, version: any) => {
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

export function getNoEmptyFields(attributes: any, item: any): ProcessedValue[] {
    return attributes
        .filter((c: any) => item[c.name] != null && item[c.name] !== undefined)
        .sort((a: any, b: any) => {
            if (a.displayOrder === undefined && b.displayOrder === undefined) {
                if(a.displayName < b.displayName) { return -1; }
                if(a.displayName > b.displayName) { return 1; }
            }

            if (a.displayOrder === undefined && b.displayOrder !== undefined){
                return 1;
            }

            if (a.displayOrder !== undefined && b.displayOrder === undefined){
                return -1;
            }

            return a.displayOrder - b.displayOrder;
        }).map((c: any) => {
            return { displayName: c.displayName, value: item[c.name], name: c.name, entity: c.entity };
        });
}
