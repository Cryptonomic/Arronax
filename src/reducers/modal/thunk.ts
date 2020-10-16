import {
    ConseilDataClient,
    ConseilQueryBuilder,
    ConseilOperator,
    ConseilSortDirection,
    TezosConseilClient,
    BabylonDelegationHelper,
    Tzip7ReferenceTokenHelper,
    StakerDAOTokenHelper,
    TezosContractIntrospector,
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
        } else if (data.id === 'KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv') { // StakerDao
            const storage = await StakerDAOTokenHelper.getSimpleStorage(config.nodeUrl || '', id);
            metadata.supply = storage.supply;
            metadata.balanceLedger = storage.mapid;
            metadata.paused = storage.paused;
            contractType = 'StakerDAO Token';
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
    const config = state().app.configs.find((cfg: any) => cfg.platform === platform && cfg.network === network);

    if (!config) {
        throw Error('Unable to find config');
    }

    const { url, apiKey } = config;

    try {
        const { entity, query } = TezosConseilClient.getEntityQueryForId(id);
        const items = await executeEntityQuery({ url, apiKey, network }, platform, network, entity, query);
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
