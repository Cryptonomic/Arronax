import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, shallowEqual } from 'react-redux';

import { fetchOperationsBlock } from '../../../../../reducers/modal/thunk';
import { formatValueWithLink } from '../../../../../utils/render';
import Title from '../../../parts/Title';
import List from '../../../parts/List';
import Blocks from '../../../parts/Blocks';

const onClickItem = (id: string) => {
    console.log('onClick');
};

const Block = (props: any) => {
    console.log('renderBlockComponent', props);
    const blockOperations = useSelector(({ modal }: any) => modal.modules.blockOperations, shallowEqual);
    const { t } = useTranslation();
    const { network, entity, values, attributes, formatValue } = props;
    const explicitKeys: string[] = [];
    const title = t('components.entityModal.details', { title: 'Block' });
    const list = [
        {
            title: t('attributes.blocks.hash'),
            value: <>{formatValue(explicitKeys, network, entity, values, attributes, 'hash', true)}</>,
        },
        {
            title: t('attributes.blocks.level'),
            value: (
                <>
                    {formatValue(explicitKeys, network, entity, values, attributes, 'level')} {t('components.entityModal.of')}{' '}
                    {t('attributes.blocks.meta_cycle').toLowerCase()} {formatValue(explicitKeys, network, entity, values, attributes, 'meta_cycle')}{' '}
                    {t('components.entityModal.in')} {t('attributes.blocks.meta_voting_period').toLowerCase()}{' '}
                    {formatValue(explicitKeys, network, entity, values, attributes, 'meta_voting_period')}
                </>
            ),
        },
        {
            title: t('attributes.blocks.baker'),
            value: (
                <>
                    {formatValue(explicitKeys, network, entity, values, attributes, 'baker')} {t('components.entityModal.of')}{' '}
                    {t('attributes.blocks.priority').toLowerCase()} {formatValue(explicitKeys, network, entity, values, attributes, 'priority')}
                </>
            ),
        },
        {
            title: t('attributes.blocks.protocol'),
            value: (
                <>
                    {formatValue(explicitKeys, network, entity, values, attributes, 'proto')}:{' '}
                    {formatValue(explicitKeys, network, entity, values, attributes, 'protocol', true)}
                </>
            ),
        },
        {
            title: t('general.nouns.period'),
            value: <>{formatValue(explicitKeys, network, entity, values, attributes, 'period_kind')}</>,
        },
    ].concat(
        values
            .filter((v: any) => !explicitKeys.includes(v.name))
            .map((item: any) => ({
                title: t(`attributes.${item.entity}.${item.name}`),
                value: <>{formatValue(explicitKeys, network, entity, values, attributes, item.name, true)}</>,
            }))
    );

    const blocks = [
        {
            title: t('attributes.blocks.block_operations'),
            value: <>{formatValueWithLink({ value: blockOperations.length, onClick: () => onClickItem('block_operations') })}</>,
        },
    ];

    return (
        <>
            <Title title={title} />
            <List list={list} />
            <Blocks blocks={blocks} />
        </>
    );
};

const blockCtrl = (props: any) => {
    const actions: any = [() => fetchOperationsBlock('blockOperations', props.id)];
    const getActions = () => actions;
    const getComponent = () => <Block {...props} />;

    return [getComponent, getActions];
};

export default blockCtrl;
