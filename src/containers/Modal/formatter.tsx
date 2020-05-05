import { AttributeDefinition, AttrbuteDataType, AttrbuteKeyType } from 'conseiljs';

import { formatValueForDisplay } from '../../utils/render';

const formatValue = (onClickPrimaryKey: () => void) => (
    explicitKeys: string[],
    network: any,
    entity: any,
    processedValues: any[],
    attributes: any[],
    key: string,
    truncate: boolean = false
) => {
    explicitKeys.push(key);
    if (processedValues.find((i) => i.name === key) === undefined) {
        return '';
    }
    return formatValueForDisplay(
        'tezos',
        network,
        entity,
        processedValues.find((i) => i.name === key).value,
        attributes[network][entity].filter((a: any) => a.name === key)[0],
        onClickPrimaryKey,
        undefined,
        truncate
    );
};

const formatSpecificValue = (onClickPrimaryKey: () => void) => (
    network: string,
    entity: string,
    value: string,
    dataType: AttrbuteDataType,
    truncate: boolean = false
) => {
    if (!value) {
        return '';
    }

    const attribute: AttributeDefinition = {
        name: '',
        displayName: '',
        dataType: dataType,
        cardinality: 1,
        keyType: AttrbuteKeyType.NONKEY,
        entity: '',
        dataFormat: '',
        visible: true,
    };

    return formatValueForDisplay('tezos', network, entity, value, attribute, onClickPrimaryKey, undefined, truncate);
};

export const formatter = (props: any) => (template: any) => {
    const { onClickPrimaryKey } = props;
    return template({ ...props, formatValue: formatValue(onClickPrimaryKey), formatSpecificValue: formatSpecificValue(onClickPrimaryKey) });
};
