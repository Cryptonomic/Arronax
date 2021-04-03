import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, shallowEqual } from 'react-redux';

import { fetchAccountTokenBalances } from '../../../../../reducers/modal/thunk';
import Title from '../../../parts/Title';
import List from '../../../parts/List';

const Account = (props: any) => {
    const accountTokens = useSelector(({ modal }: any) => modal.modules.blockOperations, shallowEqual);
    const { t } = useTranslation();
    const { platform, network, entity, values, attributes, formatValue } = props;
    const explicitKeys: string[] = [];
    const title = t('components.entityModal.details', { title: 'Account' });
    const list = [
        {
            title: t('attributes.accounts.account_id'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'account_id'),
        },
        {
            title: t('attributes.accounts.balance'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'balance'),
        },
        {
            title: t('components.entityModal.account.last_active_title'),
            value: (
                <>
                    {t('components.entityModal.account.at_level', {
                        level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                    })}
                    : &nbsp; {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_id', true)}
                </>
            ),
        },
        {
            title: t(`attributes.accounts.counter`),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'counter'),
        },
    ];

    return (
        <>
            <Title title={title} />
            <List list={list} />
            <>{JSON.stringify(accountTokens)}</>
        </>
    );
};

const accountCtrl = (props: any) => {
    const actions: any = [() => fetchAccountTokenBalances('blockOperations', props.id)];; 
    const getActions = () => actions;
    const getComponent = () => <Account {...props} />;

    return [getComponent, getActions];
};

export default accountCtrl;
