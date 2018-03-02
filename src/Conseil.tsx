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

function queryNautilus(network: string, command: string, payload: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let url = `https://localhost:1337/tezos/${network}/${command}`;
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', url, true);
        xmlHttp.onload = () => resolve(xmlHttp.responseText);
        xmlHttp.onerror = () => reject(xmlHttp.statusText);
        xmlHttp.send(payload);
    });
}

function queryNautilusWithFilter(network: string, command: string, filter: ConseilFilter) {
    let params = querystring.stringify(filter);
    let cmdWithParams = '${command}?${params}';
    return queryNautilus(network, cmdWithParams, '');
}

export function getBlockHead(network: string) {
    return queryNautilus(network, 'blocks/head', '');
}

export function getBlock(network: string, hash: String) {
    return queryNautilus(network, 'blocks/${hash}', '');
}

export function getBlocks(network: string, filter: ConseilFilter) {
    return queryNautilusWithFilter(network, 'blocks', filter);
}