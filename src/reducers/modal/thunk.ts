import {
    ConseilDataClient,
    ConseilQueryBuilder,
    ConseilOperator,
    ConseilSortDirection,
    TezosConseilClient,
    BabylonDelegationHelper,
    Tzip7ReferenceTokenHelper,
    TezosContractIntrospector,
    TezosNodeReader
} from 'conseiljs';

import { createMessageAction } from '../message/actions';
import { setModule, setModalLoading, setModalItems, setModalOpen } from '../modal/actions';

const { executeEntityQuery } = ConseilDataClient;
const { blankQuery, addOrdering, setLimit, addPredicate } = ConseilQueryBuilder;

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
    if (s.startsWith('o')) {
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