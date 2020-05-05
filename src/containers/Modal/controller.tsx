import React from 'react';

import templates from './templates';
import { formatter } from './formatter';
import { getNoEmptyFields } from '../../utils/attributes';

const templateType = (entity: string, values: any) => {
    if (entity === 'accounts' && values.find((v: any) => v.name === 'is_baker')?.value) {
        return 'bakers';
    }
    if (entity === 'accounts' && values.find((v: any) => v.name === 'account_id')?.value.startsWith('KT1')) {
        return 'contracts';
    }

    return entity;
};

export const getTemplate = (platform: string, network: string, entity: string, items: any, id: string, attributes: any) => (others: any) => {
    const values = getNoEmptyFields(attributes[network][entity], items); //TODO: add attrs platform support

    const props = {
        platform,
        network,
        entity,
        id,
        items,
        values,
        attributes,
        ...others,
    };

    return formatter(props)(templates[`${platform}/${network}/${templateType(entity, values)}`]);
};
