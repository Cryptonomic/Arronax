import templates from './templates';
import { formatter } from './formatter';
import { getNoEmptyFields } from '../../utils/attributes';

const templateType = (platform: string, entity: string, values: any) => {
    if (platform === 'tezos' && entity === 'accounts' && values.find((v: any) => v.name === 'is_baker')?.value) {
        return 'bakers';
    }
    if (platform === 'tezos' && entity === 'accounts' && values.find((v: any) => v.name === 'account_id')?.value.startsWith('KT1')) {
        return 'contracts';
    }

    return entity;
};

export const getTemplate = (platform: string, network: string, entity: string, item: any, id: string, attributes: any) => (others: any) => {
    const values = getNoEmptyFields(attributes[platform][network][entity], item);

    const props = {
        platform,
        network,
        entity,
        id,
        values,
        attributes,
        ...others,
    };

    return formatter(props)(templates[`${platform}/${network}/${templateType(platform, entity, values)}` || `${platform}/${network}/default`]);
};
