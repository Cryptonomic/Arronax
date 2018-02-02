/*

function queryNautilus(network: string, command: string, payload: string, callback: (s: any) => any) {
    let url: string = 'http://localhost:1337/tezos/{$network}/${command}'
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(payload);
}

export function getBlockHead(network: string, callback: (s: any) => any) {
    queryNautilus(network, 'blocks/head', "", callback)
}

export function getBlock(network: string, hash: string, callback: (s: any) => any) {
    queryNautilus(network, 'blocks/${hash}', "", callback)
}*/