import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, shallowEqual } from 'react-redux';

import { fetchAccountTokenBalances } from '../../../../../reducers/modal/thunk';
import { formatValueWithLink } from '../../../../../utils/render';
import Title from '../../../parts/Title';
import List from '../../../parts/List';
import TokensTable from '../../../parts/TokensTable';
import { ModalTitle, TitleWrapper, Button } from '../../../style';

const Account = (props: any) => {
    const accountTokens = useSelector(({ modal }: any) => modal.modules.accountTokens, shallowEqual);
    const { t } = useTranslation();
    const [tab, setTab] = useState('');
    const { platform, network, entity, values, attributes, formatValue } = props;

    const onCloseTab = () => setTab('');
    const onClickItem = (name: string) => setTab(name);

    const explicitKeys: string[] = [];
    const title = t('components.entityModal.details', { title: 'Account' });
    let list = [
        {
            title: t('attributes.accounts.account_id'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'account_id'),
        },
        {
            title: t('attributes.accounts.balance'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'balance'),
        }];

        if (accountTokens.length){
            list.push({
                title: t('attributes.accounts.token_balances'),
                value: (<>
                    {formatValueWithLink({ value: ([...new Set(accountTokens.map((r: any) => r['token']))]).join(', '), onClick: () => onClickItem('token_balances') })}
                </>)
            });
        }

        list.push({
            title: t('components.entityModal.account.last_active_title'),
            value: (
                <>
                    {t('components.entityModal.account.at_level', {
                        level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                    })}
                    : &nbsp; {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_id', true)}
                </>
        )});
        list.push({
            title: t(`attributes.accounts.counter`),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'counter'),
        });

    return (
        <>
        {!tab && (<>
            <Title title={title} />
            <List list={list} />
        </>)}

        {tab && (<>
            <TitleWrapper>
                <ModalTitle>
                    <Button onClick={onCloseTab}>{title}</Button>/{t(`attributes.accounts.${tab}`)}
                </ModalTitle>
            </TitleWrapper>
            <TokensTable items={accountTokens}/>
        </>)}
    </>);
}

const accountCtrl = (props: any) => {
    const actions: any = [() => fetchAccountTokenBalances('accountTokens', props.id)];
    const getActions = () => actions;
    const getComponent = () => <Account {...props} />;

    return [getComponent, getActions];
};

export default accountCtrl;
