import {
    ConseilMetadataClient,
    ConseilDataClient,
    ConseilQueryBuilder,
    ConseilOperator,
    ConseilOutput,
    ConseilSortDirection,
    AttributeDefinition,
    AttrbuteDataType,
    TezosConseilClient,
    EntityDefinition,
} from 'conseiljs';
import { queries } from '@testing-library/react';

import { createMessageAction } from '../message/actions';
import { setBlockOperationsModule } from '../modal/actions';

const { executeEntityQuery } = ConseilDataClient;
const { blankQuery, addOrdering, addFields, setLimit, addPredicate, addAggregationFunction } = ConseilQueryBuilder;

export const fetchOperationsBlock = (name: string, value: string | number) => async (dispatch: any, state: any) => {
    const { network, platform, url, apiKey } = state().app.selectedConfig;
    const serverInfo = { url, apiKey, network };

    try {
        let query = blankQuery();
        query = addPredicate(query, 'block_hash', ConseilOperator.EQ, [value], false);
        query = addOrdering(query, 'kind', ConseilSortDirection.DESC);
        query = addOrdering(query, 'amount', ConseilSortDirection.DESC);

        const response = await executeEntityQuery(serverInfo, platform, network, 'operations', query);
        await dispatch(setBlockOperationsModule(name, response));
    } catch (e) {
        const message = 'Unable to fetch operations';
        dispatch(createMessageAction(message, true));
    }
}
