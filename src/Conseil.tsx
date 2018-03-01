import * as querystring from 'querystring';

export interface ConseilFilter {
    limit: number;
    blockIDs: string[];
    levels: number[];
    netIDs: string[];
    protocols: string[];
    operationIDs: string[];
    operationSources: string[];
    accountIDs: string[];
    accountManagers: string[];
    accountDelegates: string[];
}

function submitDataToNautilus(network: string, command: string, payload: string, callback: (s: string) => void) {
    let url: string = 'http://localhost:1337/tezos/{$network}/${command}';
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.send(payload);
}

function getDataFromNautilus(network: string, command: string, filter: ConseilFilter, callback: (s: string) => void) {
    let params: string = querystring.stringify(filter);
    let url: string = 'http://localhost:1337/tezos/{$network}/${command}?${params}';
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open('GET', url, true);
}

export function getBlockHead(network: string, callback: (s: string) => void) {
    submitDataToNautilus(network, 'blocks/head', '', callback);
}

export function getBlock(network: string, filter: ConseilFilter, callback: (s: string) => void) {
    getDataFromNautilus(network, 'blocks/${hash}', filter, callback);
}