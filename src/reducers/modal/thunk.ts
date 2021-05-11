import { JSONPath } from 'jsonpath-plus';
import { BigNumber } from 'bignumber.js';

import {
    ConseilDataClient,
    ConseilQueryBuilder,
    ConseilOperator,
    ConseilSortDirection,
    TezosConseilClient,
    BabylonDelegationHelper,
    Tzip7ReferenceTokenHelper,
    TezosContractIntrospector,
    TezosNodeReader,
    TezosMessageUtils,
    TezosParameterFormat,
    TezosLanguageUtil
} from 'conseiljs';

import { createMessageAction } from '../message/actions';
import { setModule, setModalLoading, setModalItems, setModalOpen } from '../modal/actions';

const { executeEntityQuery } = ConseilDataClient;
const { blankQuery, addOrdering, setLimit, addPredicate } = ConseilQueryBuilder;

/**
 * 
 * @param name Result set attribute name
 * @param address Account to query
 * @returns 
 */
export const fetchAccountTokenBalances = (name: string, address: string) => async (dispatch: any, state: any) => {
    const { nodeUrl } = state().app.selectedConfig;

    const ethtzDetails = {
        tokenSymbol: 'ETHtz',
        tokenDecimals: 18,
        tokenLedgerMap: 199,
        tokenLedgerKey: address,
        tokenLedgerKeyType: 'address',
        tokenLedgerPath: '$.args[0].int',
        dexterPoolAddress: 'KT1PDrBE59Zmxnb8vXRgRAG1XmvTMTs5EDHU',
        dexterLedgerMap: 542,
        quipuPoolAddress: 'KT1Evsp2yA19Whm24khvFPcwimK6UaAJu8Zo',
        quipuPoolBalancePath: '$.args[1].args[0].args[4].int',
        quipuTokenPoolPath: '$.args[1].args[0].args[2].args[1].int',
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 1517
    };

    const usdtzDetails = {
        tokenSymbol: 'USDtz',
        tokenDecimals: 6,
        tokenLedgerMap: 36,
        tokenLedgerKey: address,
        tokenLedgerKeyType: 'address',
        tokenLedgerPath: '$.args[0].int',
        dexterPoolAddress: 'KT1Tr2eG3eVmPRbymrbU2UppUmKjFPXomGG9',
        dexterLedgerMap: 543,
        quipuPoolAddress: 'KT1WxgZ1ZSfMgmsSDDcUn8Xn577HwnQ7e1Lb',
        quipuPoolBalancePath: '$.args[1].args[0].args[4].int',
        quipuTokenPoolPath: '$.args[1].args[0].args[2].args[1].int',
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 1509
    };

    const tzbtcKey = Buffer.from(TezosMessageUtils.writePackedData(`Pair "ledger" 0x${TezosMessageUtils.writeAddress(address)}`, '', TezosParameterFormat.Michelson), 'hex');
    const tzbtcDetails = {
        tokenSymbol: 'tzBTC',
        tokenDecimals: 8,
        tokenLedgerMap: 31,
        tokenLedgerKey: tzbtcKey,
        tokenLedgerKeyType: 'bytes',
        tokenLedgerPath: '$.args[0].int',
        dexterPoolAddress: 'KT1BGQR7t4izzKZ7eRodKWTodAsM23P38v7N',
        dexterLedgerMap: 541,
        quipuPoolAddress: 'KT1WBLrLE2vG8SedBqiSJFm4VVAZZBytJYHc',
        quipuPoolBalancePath: '$.args[1].args[0].args[4].int',
        quipuTokenPoolPath: '$.args[1].args[0].args[2].args[1].int',
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 1493
    };

    const wxtzDetails = {
        tokenSymbol: 'wXTZ',
        tokenDecimals: 6,
        tokenLedgerMap: 257,
        tokenLedgerKey: address,
        tokenLedgerKeyType: 'address',
        tokenLedgerPath: '$.int',
        dexterPoolAddress: 'KT1D56HQfMmwdopmFLTwNHFJSs6Dsg2didFo',
        dexterLedgerMap: 544,
        quipuPoolAddress: 'KT1W3VGRUjvS869r4ror8kdaxqJAZUbPyjMT',
        quipuPoolBalancePath: '$.args[1].args[0].args[4].int',
        quipuTokenPoolPath: '$.args[1].args[0].args[2].args[1].int',
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 1477
    };

    const kusdDetails = {
        tokenSymbol: 'kUSD',
        tokenDecimals: 18,
        tokenLedgerMap: 380,
        tokenLedgerKey: address,
        tokenLedgerKeyType: 'address',
        tokenLedgerPath: '$.args[1].int',
        dexterPoolAddress: 'KT1AbYeDbjjcAnV1QK7EZUUdqku77CdkTuv6',
        dexterLedgerMap: 540,
        quipuPoolAddress: 'KT1K4EwTpbvYN9agJdjpyJm4ZZdhpUNKB3F6',
        quipuPoolBalancePath: '$.args[1].args[0].args[4].int',
        quipuTokenPoolPath: '$.args[1].args[0].args[2].args[1].int',
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 1485
    };

    const stkrDetails = {
        tokenSymbol: 'STKR',
        tokenDecimals: 18,
        tokenLedgerMap: 527,
        tokenLedgerKey: address,
        tokenLedgerKeyType: 'address',
        tokenLedgerPath: '$.int',
        quipuPoolAddress: 'KT1BMEEPX7MWzwwadW3NCSZe9XGmFJ7rs7Dr',
        quipuPoolBalancePath: '$.args[1].args[0].args[4].int',
        quipuTokenPoolPath: '$.args[1].args[0].args[2].args[1].int',
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 1501
    };

    const blndDetails = {
        tokenSymbol: 'BLND',
        tokenDecimals: 18,
        tokenLedgerMap: 368,
        tokenLedgerKey: address,
        tokenLedgerKeyType: 'address',
        tokenLedgerPath: '$.int'
    };

    const hdaoDetails = {
        tokenSymbol: 'hDAO',
        tokenDecimals: 6,
        tokenLedgerMap: 515,
        tokenLedgerKey: `Pair 0x${TezosMessageUtils.writeAddress(address)} 0`,
        tokenLedgerKeyType: '',
        tokenLedgerPath: '$.int',
        quipuPoolAddress: 'KT1QxLqukyfohPV5kPkw97Rs6cw1DDDvYgbB',
        quipuPoolBalancePath: '$.args[1].args[1].args[0].args[0].int',
        quipuTokenPoolPath: `$.args[1].args[0].args[3].int`,
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 1878
    };

    const usdsDetails = {
        tokenSymbol: 'USDS',
        tokenDecimals: 6,
        tokenLedgerMap: 397,
        tokenLedgerKey: `Pair 0x${TezosMessageUtils.writeAddress(address)} 0`,
        tokenLedgerKeyType: '',
        tokenLedgerPath: '$.int',
        quipuPoolAddress: 'KT1KFszq8UFCcWxnXuhZPUyHT9FK3gjmSKm6',
        quipuPoolBalancePath: '$.args[1].args[1].args[0].args[0].int',
        quipuTokenPoolPath: `$.args[1].args[0].args[3].int`,
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 1894
    };

    const wrapDetails = {
        tokenSymbol: 'WRAP',
        tokenDecimals: 8,
        tokenLedgerMap: 1777, // KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd
        tokenLedgerKey: address,
        tokenLedgerKeyType: 'address',
        tokenLedgerPath: '$.int',
        quipuPoolAddress: 'KT1FG63hhFtMEEEtmBSX2vuFmP87t9E7Ab4t',
        quipuPoolBalancePath: '$.args[1].args[1].args[0].args[0].int',
        quipuTokenPoolPath: `$.args[1].args[0].args[3].int`,
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 2013
    };

    const crunchDetails = {
        tokenSymbol: 'CRUNCH',
        tokenDecimals: 8,
        tokenLedgerMap: 2809, // KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng
        tokenLedgerKey: address,
        tokenLedgerKeyType: 'address',
        tokenLedgerPath: '$.int',
        quipuPoolAddress: 'KT1RRgK6eXvCWCiEGWhRZCSVGzhDzwXEEjS4',
        quipuPoolBalancePath: '$.args[1].args[1].args[0].args[0].int',
        quipuTokenPoolPath: `$.args[1].args[0].args[3].int`,
        quipuCoinPoolPath: '$.args[1].args[0].args[1].args[2].int',
        quipuLedgerMap: 3266
    };

    try {
        const ethtz = await aggregateTokenBalance(nodeUrl, ethtzDetails, address);
        const usdtz = await aggregateTokenBalance(nodeUrl, usdtzDetails, address);
        const wxtz = await aggregateTokenBalance(nodeUrl, wxtzDetails, address);
        const kusd = await aggregateTokenBalance(nodeUrl, kusdDetails, address);
        const stkr = await aggregateTokenBalance(nodeUrl, stkrDetails, address);
        const blnd = await aggregateTokenBalance(nodeUrl, blndDetails, address);
        const hdao = await aggregateTokenBalance(nodeUrl, hdaoDetails, address);
        const tzbtc = await aggregateTokenBalance(nodeUrl, tzbtcDetails, address);
        const usds = await aggregateTokenBalance(nodeUrl, usdsDetails, address);
        const wrap = await aggregateTokenBalance(nodeUrl, wrapDetails, address);
        const crunch = await aggregateTokenBalance(nodeUrl, crunchDetails, address);

        await dispatch(setModule(name, [...usdtz, ...ethtz, ...wxtz, ...kusd, ...stkr, ...blnd, ...hdao, ...tzbtc, ...usds, ...wrap, ...crunch]));
    } catch (e) {
        const message = 'Unable to fetch operations';
        dispatch(createMessageAction(message, true));
    }
}

/**
 * 
 * @param name Result set attribute name
 * @param address Account to query
 * @returns 
 */
 export const fetchAccountNFTBalances = (name: string, address: string) => async (dispatch: any, state: any) => {
    //
 }

export const fetchOperationsBlock = (name: string, id: any) => async (dispatch: any, state: any) => {
    const { network, platform, url, apiKey } = state().app.selectedConfig;
    const serverInfo = { url, apiKey, network };

    try {
        let query = blankQuery();
        query = addPredicate(query, 'block_hash', ConseilOperator.EQ, [id], false);
        query = addOrdering(query, 'kind', ConseilSortDirection.DESC);
        query = addOrdering(query, 'amount', ConseilSortDirection.DESC);

        const response = await executeEntityQuery(serverInfo, platform, network, 'operations', query);
        await dispatch(setModule(name, response));
    } catch (e) {
        const message = 'Unable to fetch operations';
        dispatch(createMessageAction(message, true));
    }
};

export const fetchContract = (name: string, data: any) => async (dispatch: any, state: any) => {
    const { id, values } = data;
    const config = state().app.selectedConfig;
    const script = values.find((a: any) => a.name === 'script').value;
    let contractType = 'Unidentified';
    let entryPoints: string[] = [];
    let metadata: any = {};

    try {
        if (BabylonDelegationHelper.verifyScript(script)) {
            contractType = 'Babylon Delegation Contract';
            const storage = await BabylonDelegationHelper.getSimpleStorage(config.nodeUrl || '', id);
            metadata.manager = storage.administrator;
        }
    } catch (e) { }

    try {
        if (Tzip7ReferenceTokenHelper.verifyScript(script)) {
            contractType = 'FA1.2 Token Contract (TZIP7)';

            const storage = await Tzip7ReferenceTokenHelper.getSimpleStorage(config.nodeUrl || '', id);
            metadata.manager = storage.administrator;
            metadata.supply = storage.supply;
            metadata.balanceLedger = storage.mapid;
            metadata.paused = storage.paused;
        }
    } catch (e) { }

    try {
        if (data.id === 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9') { // USDtz
            metadata.supply = metadata.supply / 1_000_000;
        } else if (data.id === 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn') { // tzBTC
            //
        } else if (data.id === 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8') { // ETHtz
            //metadata.supply = metadata.supply / 1_000_000;
        } else if (data.id === 'KT1VYsVfmobT7rsMVivvZ4J8i3bPiqz12NaH') { // wXTZ
            metadata.supply = metadata.supply / 1_000_000;
        } else if (data.id === 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV') { // kUSD
            //metadata.supply = metadata.supply / 1_000_000;
        } else if (data.id === 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton') { // hic et nunc NFT
        } else if (data.id === 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW') { // hic et nunc DAO
        } else if (data.id === 'KT1MEouXPpCx9eFJYnxfAWpFA7NxhW3rDgUN') { // BLND
        } else if (data.id === 'KT1AEfeckNbdEYwaMKkytBwPJPycz7jdSGea') { // STKR
        } else if (data.id === 'KT1PDrBE59Zmxnb8vXRgRAG1XmvTMTs5EDHU') { // Dexter ETHtz/XTZ Pool
        } else if (data.id === 'KT1Tr2eG3eVmPRbymrbU2UppUmKjFPXomGG9') { // Dexter USDtz/XTZ Pool
        } else if (data.id === 'KT1BGQR7t4izzKZ7eRodKWTodAsM23P38v7N') { // Dexter tzBTC/XTZ Pool
        } else if (data.id === 'KT1D56HQfMmwdopmFLTwNHFJSs6Dsg2didFo') { // Dexter wXTZ/XTZ Pool
        } else if (data.id === 'KT1AbYeDbjjcAnV1QK7EZUUdqku77CdkTuv6') { // Dexter kUSD/XTZ Pool
        }
    } catch (e) { }

    try {
        const mapData = await TezosConseilClient.getBigMapData({ url: config.url, apiKey: config.apiKey, network: config.network }, id);
        let mapSummary: any[] = [];

        if (mapData) {
            for (const map of mapData.maps) {
                mapSummary.push(
                    `${map.definition.index} - ${map.definition.key}:${map.definition.value}, ${map.content.length} item${map.content.length === 1 ? '' : 's'}`
                );
            }
            if (mapSummary.length > 0) {
                metadata.mapSummary = mapSummary;
            }
        }
    } catch (e) {}

    try {
        const parsedCalls = await TezosContractIntrospector.generateEntryPointsFromCode(script);

        for (const entryPoint of parsedCalls) {
            const treePattern = entryPoint.structure
                .replace(/Pair/g, '')
                .replace(/\$PARAM/g, '')
                .replace(/\(/g, '')
                .replace(/\)/g, '')
                .replace(/[a-z]/g, '');
            entryPoints.push(
                `${entryPoint.name} (${entryPoint.parameters.map((p: any) => (p.name ? p.name + ': ' : '') + p.type).join(', ')}), ${treePattern}`
            );
        }
    } catch (e) {}

    await dispatch(setModule(name, { type: contractType, entryPoints, metadata }));
    return {};
};

export const fetchItemByPrimaryKey = (entity: string, primaryKey: string, value: string | number) => async (dispatch: any, state: any) => {
    dispatch(setModalLoading(true));
    const { network, platform, url, apiKey } = state().app.selectedConfig;
    const serverInfo = { url, apiKey, network };

    let query = blankQuery();

    query = addPredicate(query, primaryKey, ConseilOperator.EQ, [value], false);
    const s = String(value);
    if (s.startsWith('o')) { // NOTE this is to handle tezos operations that are queries by operation group id which start with an 'o' and can contain multiple operations
        query = setLimit(query, 1000);
    } else {
        query = setLimit(query, 1);
    }

    const items = await executeEntityQuery(serverInfo, platform, network, entity, query);
    await dispatch(setModalItems(platform, network, entity, value, items));
    await dispatch(setModalOpen(true));
};

export const loadModal = (platform: string, network: string, id: string) => async (dispatch: any, state: any) => {
    const { selectedConfig, entities } = state().app;
    const { url, apiKey, nodeUrl } = selectedConfig;

    try {
        const { entity, query } = TezosConseilClient.getEntityQueryForId(id); // TODO: eth
        let items: any = await executeEntityQuery({ url, apiKey, network }, platform, network, entity, query);
        if (!items.length && platform === 'tezos' && entity === 'operations') { items = await getMempoolOperation(nodeUrl, id); }

        if (!items.length) {
            const searchedEntity = entities.find((item: any) => item.name === entity);
            dispatch(createMessageAction(`The requested ${searchedEntity.displayName.toLowerCase()} was not found.`, true));
            return;
        }

        await dispatch(setModalItems(platform, network, entity, id, items));
        await dispatch(setModalOpen(true));
    } catch (e) {
        let message = 'Unable to load an object for the id';
        if (e.message === 'Invalid id parameter') {
            message = 'Invalid id format entered.';
        }
        throw Error(message);
    }
};

export const runActions = (actions: any) => async (dispatch: any, state: any) => {
    const collections = actions.map(async (action: any) => await action());
    Promise.all(collections).then(() => dispatch(setModalLoading(false)));
};

const getMempoolOperation = async (nodeUrl: string, id: string) => {
    const rawOperations = await TezosNodeReader.getMempoolOperation(nodeUrl, id);

    let operations: any[] = [];

    try {
        operations = rawOperations.contents.map((o: any) => {
            let parameters_entrypoints: string | undefined = undefined;
            let parameters_micheline: string | undefined = undefined;

            if (o.parameters && o.parameters.entrypoint) {
                parameters_entrypoints = JSON.stringify(o.parameters.entrypoint);
            }

            if (o.parameters) {
                parameters_micheline = JSON.stringify(o.parameters.value || o.parameters);
            }

            return {
                amount: o.amount,
                block_hash: 'pending',
                block_level: -1,
                fee: o.fee,
                kind: o.kind,
                public_key: o.public_key || undefined,
                storage_limit: o.storage_limit,
                gas_limit: o.gas_limit,
                counter: o.counter,
                level: o.level || undefined,
                source: o.source || undefined,
                destination: o.destination || undefined,
                operation_group_hash: rawOperations.hash,
                parameters: undefined,
                internal: false,
                delegate: o.delegate || undefined,
                parameters_entrypoints,
                parameters_micheline

        }});
    } catch (err) {
        console.log('could not process node response', rawOperations);
    }

    return operations;
}

const aggregateTokenBalance = async (tezosNode: string, tokenDetails: any, account: string) => {
    const scale = (new BigNumber(10)).pow(tokenDetails.tokenDecimals);
    let balances: any[] = [];

    let tokenBalance = new BigNumber(0);
    try {
        const packedKey = TezosMessageUtils.encodeBigMapKey(Buffer.from(TezosMessageUtils.writePackedData(tokenDetails.tokenLedgerKey, tokenDetails.tokenLedgerKeyType, TezosParameterFormat.Michelson), 'hex'));
        const mapResult = await TezosNodeReader.getValueForBigMapKey(tezosNode, tokenDetails.tokenLedgerMap, packedKey);
        
        if (tokenDetails.tokenSymbol !== 'tzBTC') {
            tokenBalance = new BigNumber(JSONPath({ path: tokenDetails.tokenLedgerPath, json: mapResult })[0]);
            balances.push({ token: tokenDetails.tokenSymbol, location: tokenDetails.tokenSymbol, balance: tokenBalance.dividedBy(scale).toFixed(tokenDetails.tokenDecimals) });
        } else { // TODO: improve this through metadata
            const bytes = JSONPath({ path: '$.bytes', json: mapResult })[0];
            const accountData = JSON.parse(TezosLanguageUtil.hexToMicheline(bytes.slice(2)).code);
            tokenBalance = new BigNumber(JSONPath({ path: tokenDetails.tokenLedgerPath, json: accountData })[0]);

            if (tokenBalance.toNumber() > 0) {
                balances.push({
                    token: tokenDetails.tokenSymbol,
                    location: tokenDetails.tokenSymbol,
                    balance: tokenBalance.dividedBy(scale).toFixed(tokenDetails.tokenDecimals),
                    coinBalance: 0
                });
            }
        }
    } catch (err) {
        //
    }

    let dexterTokenBalance = new BigNumber(0);
    let dexterCoinBalance = new BigNumber(0);
    try {
        const packedKey = TezosMessageUtils.encodeBigMapKey(Buffer.from(TezosMessageUtils.writePackedData(account, 'address'), 'hex'));
        const mapResult = await TezosNodeReader.getValueForBigMapKey(tezosNode, tokenDetails.dexterLedgerMap, packedKey);
        const dexterPoolBalance = new BigNumber(JSONPath({ path: '$.args[0].int', json: mapResult })[0]);

        const dexterStorage = await TezosNodeReader.getContractStorage(tezosNode, tokenDetails.dexterPoolAddress);
        const dexterPoolSize = new BigNumber(JSONPath({ path: '$.args[1].args[2].int', json: dexterStorage })[0]);
        const dexterTokenPool = new BigNumber(JSONPath({ path: '$.args[3].int', json: dexterStorage })[0]);
        const dexterCoinPool = new BigNumber(JSONPath({ path: '$.args[4].int', json: dexterStorage })[0]);

        dexterTokenBalance = dexterPoolBalance.dividedBy(dexterPoolSize).multipliedBy(dexterTokenPool);
        dexterCoinBalance = dexterPoolBalance.dividedBy(dexterPoolSize).multipliedBy(dexterCoinPool);

        if (dexterTokenBalance.toNumber() > 0) {
            balances.push({
                token: tokenDetails.tokenSymbol,
                location: 'Dexter',
                balance: dexterTokenBalance.dividedBy(scale).toFixed(tokenDetails.tokenDecimals),
                coinBalance: dexterCoinBalance.dividedBy(1_000_000).toFixed(6)
            });
        }
    } catch (err) {
        //
    }

    let quipuTokenBalance = new BigNumber(0);
    let quipuCoinBalance = new BigNumber(0);
    try {
        console.log(`processing ${tokenDetails.tokenSymbol}`)
        const packedKey = TezosMessageUtils.encodeBigMapKey(Buffer.from(TezosMessageUtils.writePackedData(account, 'address'), 'hex'));
        const mapResult = await TezosNodeReader.getValueForBigMapKey(tezosNode, tokenDetails.quipuLedgerMap, packedKey);
        const quipuPoolBalance = new BigNumber(JSONPath({ path: '$.args[0].args[1].int', json: mapResult })[0])

        const quipuStorage = await TezosNodeReader.getContractStorage(tezosNode, tokenDetails.quipuPoolAddress)
        const quipuPoolSize = new BigNumber(JSONPath({ path: tokenDetails.quipuPoolBalancePath, json: quipuStorage })[0]);
        const quipuTokenPool = new BigNumber(JSONPath({ path: tokenDetails.quipuTokenPoolPath, json: quipuStorage })[0]);
        const quipuCoinPool = new BigNumber(JSONPath({ path: tokenDetails.quipuCoinPoolPath, json: quipuStorage })[0]);
        console.log(tokenDetails.tokenSymbol, quipuPoolSize.toString(), quipuTokenPool.toString(), quipuCoinPool.toString())
        quipuTokenBalance = quipuPoolBalance.dividedBy(quipuPoolSize).multipliedBy(quipuTokenPool);
        quipuCoinBalance = quipuPoolBalance.dividedBy(quipuPoolSize).multipliedBy(quipuCoinPool);

        if (quipuTokenBalance.toNumber() > 0) {
            balances.push({
                token: tokenDetails.tokenSymbol,
                location: 'QuipuSwap',
                balance: quipuTokenBalance.dividedBy(scale).toFixed(tokenDetails.tokenDecimals),
                coinBalance: quipuCoinBalance.dividedBy(1_000_000).toFixed(6)
            });
        }
    } catch (err) {
        //
    }

    const tokenTotal = tokenBalance.plus(dexterTokenBalance).plus(quipuTokenBalance);
    if (tokenTotal.toNumber() > 0) {
        balances.push({ token: tokenDetails.tokenSymbol, location: `${tokenDetails.tokenSymbol} Total`, balance: tokenTotal.dividedBy(scale).toFixed(tokenDetails.tokenDecimals) });
    }

    return balances;
}
