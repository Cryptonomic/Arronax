export interface ConseilFilter {
    limit: number;
}

function queryNautilus(network: string, command: string, payload: string, callback: (s: string) => void) {
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

export function getBlockHead(network: string, callback: (s: string) => void) {
    queryNautilus(network, 'blocks/head', '', callback);
}

export function getBlock(network: string, hash: string, callback: (s: string) => void) {
    queryNautilus(network, 'blocks/${hash}', '', callback);
}