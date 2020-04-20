import React from 'react';
import { AttrbuteDataType } from 'conseiljs';

const contractTemplate = (props: any) => {
    const {
        values,
        attributes,
        formatValue,
        t,
        modules: { contract },
        id,
        fetchData,
        formatSpecificValue,
        getRestListAttrFields,
        explicitKeys,
    } = props;

    explicitKeys.push('is_baker'); // do not render Baker field

    const template: any = {
        title: t('components.entityModal.details', { title: 'Contract' }),
        items: {
            list: [
                {
                    title: t('components.entityModal.account.contract'),
                    value: <>{formatValue(values, attributes, 'account_id')}</>,
                },
                {
                    title: t('attributes.accounts.balance'),
                    value: <>{formatValue(values, attributes, 'balance')}</>,
                },
                {
                    title: t('components.entityModal.account.last_active_title'),
                    value: (
                        <>
                            {t('components.entityModal.account.at_level', { level: formatValue(values, attributes, 'block_level') })}: &nbsp;{' '}
                            {formatValue(values, attributes, 'block_id', true)}
                        </>
                    ),
                },
            ],
            block: [],
        },
        actions: [() => fetchData('contract', { id, values })],
    };

    const list = template.items.list;

    if (contract?.type && contract.type !== 'Unidentified') {
        list.push({
            title: t('components.entityModal.account.contractType'),
            value: <>{contract.type}</>,
        });
    }

    if (contract?.entryPoints?.length) {
        list.push({
            title: t('components.entityModal.account.entryPoints'),
            value: contract.entryPoints,
            multiline: true,
        });
    }

    if (contract?.metadata?.mapSummary?.length) {
        list.push({
            title: t('components.entityModal.account.maps'),
            value: contract.metadata.mapSummary,
            multiline: true,
        });
    }

    if (contract?.type && contract.type.startsWith('FA1.2')) {
        list.push({
            title: t('components.entityModal.account.tokenAdmin'),
            value: <>{formatSpecificValue(contract.metadata.manager, AttrbuteDataType.ACCOUNT_ADDRESS, false)}</>,
        });
        list.push({
            title: t('components.entityModal.account.tokenSupply'),
            value: <>{formatSpecificValue(contract.metadata.supply, AttrbuteDataType.DECIMAL, true)}</>,
        });
    }

    if (contract?.type && contract.type === 'Babylon Delegation Contract') {
        list.push({
            title: t('components.entityModal.account.admin'),
            value: <>{formatSpecificValue(contract.metadata.manager, AttrbuteDataType.ACCOUNT_ADDRESS, false)}</>,
        });
    }

    const restListItems = getRestListAttrFields(values, attributes);

    template.items.list = [...template.items.list, ...restListItems];

    return template;
};

export default contractTemplate;
