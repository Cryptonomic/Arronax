import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, shallowEqual } from 'react-redux';
import { AttrbuteDataType } from 'conseiljs';

import { fetchContract } from '../../../../../reducers/modal/thunk';
import Title from '../../../parts/Title';
import List from '../../../parts/List';

const Contract = (props: any) => {
    console.log('renderContractComponent', props);
    const contract = useSelector(({ modal }: any) => modal.modules.contract, shallowEqual);
    const { t } = useTranslation();
    const { network, entity, values, attributes, formatValue, formatSpecificValue } = props;
    const explicitKeys: string[] = ['is_baker']; // do not render Baker field
    const title = t('components.entityModal.details', { title: 'Contract' });

    let list: any = [
        {
            title: t('components.entityModal.account.contract'),
            value: <>{formatValue(explicitKeys, network, entity, values, attributes, 'account_id')}</>,
        },
        {
            title: t('attributes.accounts.balance'),
            value: <>{formatValue(explicitKeys, network, entity, values, attributes, 'balance')}</>,
        },
        {
            title: t('components.entityModal.account.last_active_title'),
            value: (
                <>
                    {t('components.entityModal.account.at_level', { level: formatValue(explicitKeys, network, entity, values, attributes, 'block_level') })}:
                    &nbsp; {formatValue(explicitKeys, network, entity, values, attributes, 'block_id', true)}
                </>
            ),
        },
    ];

    const contractList = []; // specific contract fields
    if (contract?.type && contract.type !== 'Unidentified') {
        contractList.push({
            title: t('components.entityModal.account.contractType'),
            value: <>{contract.type}</>,
        });
    }

    if (contract?.entryPoints?.length) {
        contractList.push({
            title: t('components.entityModal.account.entryPoints'),
            value: contract.entryPoints,
            multiline: true,
        });
    }

    if (contract?.metadata?.mapSummary?.length) {
        contractList.push({
            title: t('components.entityModal.account.maps'),
            value: contract.metadata.mapSummary,
            multiline: true,
        });
    }

    if (contract?.type?.startsWith('FA1.2')) {
        contractList.push({
            title: t('components.entityModal.account.tokenAdmin'),
            value: <>{formatSpecificValue(network, entity, contract.metadata.manager, AttrbuteDataType.ACCOUNT_ADDRESS, false)}</>,
        });
        contractList.push({
            title: t('components.entityModal.account.tokenSupply'),
            value: <>{formatSpecificValue(network, entity, contract.metadata.supply, AttrbuteDataType.DECIMAL, true)}</>,
        });
    }

    if (contract?.type === 'Babylon Delegation Contract') {
        contractList.push({
            title: t('components.entityModal.account.admin'),
            value: <>{formatSpecificValue(network, entity, contract.metadata.manager, AttrbuteDataType.ACCOUNT_ADDRESS, false)}</>,
        });
    }

    list = [...list, ...contractList].concat(
        values
            .filter((v: any) => !explicitKeys.includes(v.name))
            .map((item: any) => ({
                title: t(`attributes.${item.entity}.${item.name}`),
                value: <>{formatValue(explicitKeys, network, entity, values, attributes, item.name, true)}</>,
            }))
    );

    return (
        <>
            <Title title={title} />
            <List list={list} />
        </>
    );
};

const contractCtrl = (props: any) => {
    const { id, values } = props;
    const actions: any = [() => fetchContract('contract', { id, values })];
    const getActions = () => actions;
    const getComponent = () => <Contract {...props} />;

    return [getComponent, getActions];
};

export default contractCtrl;
