import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, shallowEqual } from 'react-redux';

import { getNoEmptyFields } from '../../../../../utils/attributes';
import { fetchOperationsBlock } from '../../../../../reducers/modal/thunk';
import { formatValueWithLink } from '../../../../../utils/render';
import Title from '../../../parts/Title';
import List from '../../../parts/List';
import Blocks from '../../../parts/Blocks';
import Table from '../../../../../components/Table';

import { ModalTitle, TitleWrapper, Button } from '../../../style';

const Block = (props: any) => {
    const blockOperations = useSelector(({ modal }: any) => modal.modules.blockOperations, shallowEqual);
    const { t } = useTranslation();
    const [tab, setTab] = useState('');
    const { platform, network, entity, values, attributes, formatValue } = props;
    const explicitKeys: string[] = ['utc_year', 'utc_month', 'utc_day', 'utc_time'];
    const explicitMinorKeys: string[] = ['meta_voting_period_position', 'meta_cycle_position', 'current_expected_quorum'];
    const title = t('components.entityModal.details', { title: 'Block' });
    let tableCols: any = [];
    let tableItems: any = null;
    let list: any = [];
    let blocks: any = [];

    // render block list
    if (!tab) {
        list = [
            {
                title: t('attributes.blocks.hash'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'hash', true)}
                        {t('components.entityModal.at')}{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'timestamp', true)}
                    </>
                )
            },
            {
                title: t('attributes.blocks.level'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'level')} {t('components.entityModal.of')}{' '}
                        {t('attributes.blocks.meta_cycle').toLowerCase()}{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'meta_cycle')} {t('components.entityModal.in')}{' '}
                        {t('attributes.blocks.meta_voting_period').toLowerCase()}{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'meta_voting_period')}
                    </>
                ),
            },
            {
                title: t('attributes.blocks.baker'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'baker')} {t('components.entityModal.of')}{' '}
                        {t('attributes.blocks.priority').toLowerCase()} {formatValue(explicitKeys, platform, network, entity, values, attributes, 'priority')}
                    </>
                )
            },
            {
                title: t('attributes.blocks.consumed_gas'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'consumed_gas')}
                        &nbsp;{t('components.entityModal.in')}&nbsp;
                        {formatValueWithLink({ value: blockOperations.length, onClick: () => onClickItem('block_operations') })}
                        &nbsp;{t('containers.arronax.operations').toLowerCase()}
                    </>
                    )
            },
            {
                title: t('attributes.blocks.protocol'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'proto')}:{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'protocol', true)}
                        {t(`attributes.blocks.chain_id`).toLowerCase()}:{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'chain_id')}
                        
                    </>
                ),
            },
            {
                title: t('general.nouns.period'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'period_kind')}
                        {' '}{t('components.entityModal.of')}{' '}{t('attributes.operations.proposal').toLowerCase()}{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'active_proposal', true)}
                    </>
                )
            },
        ];

        const restListItems = values
            .filter((v: any) => !explicitKeys.includes(v.name))
            .filter((v: any) => !explicitMinorKeys.includes(v.name))
            .map((item: any) => ({
                title: t(`attributes.${item.entity}.${item.name}`),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, item.name, true),
            }));

        const restBlockItems = explicitMinorKeys
            .filter((name: string) => values.find((i: any) => i.name === name) !== undefined)
            .map((name: string) => ({
                title: t(`attributes.blocks.${name}`),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, name, true),
            }));

        list = [...list, ...restListItems];
        blocks = [...blocks, ...restBlockItems];
    }

    // render block operations tab
    if (tab) {
        const opsColsName = (cols: string[]) => {
            return cols.map((col) => {
                return {
                    name: col,
                    displayName: t(`attributes.operations.${col}`),
                };
            });
        };

        const opsItems = (cols: { name: string }[]) => {
            return blockOperations.map((item: any) => {
                const newItem = { ...item };
                const opsValues = getNoEmptyFields(attributes[platform][network]['operations'], item);
                cols.map((col: { name: string }) => {
                    if (col.name === 'kind') {
                        return (newItem[col.name] = newItem[col.name].slice(0, 1).toLocaleUpperCase().concat(newItem[col.name].slice(1)));
                    }
                    return (newItem[col.name] = formatValue(explicitKeys, platform, network, 'operations', opsValues, attributes, col.name, true));
                });
                return newItem;
            });
        };

        tableCols = opsColsName(['kind', 'amount', 'fee', 'operation_group_hash', 'source', 'destination', 'parameters']);
        tableItems = opsItems(tableCols);
    }

    const onCloseTab = () => setTab('');
    const onClickItem = (name: string) => setTab(name);

    return (
        <>
            {tab && (
                <>
                    <TitleWrapper>
                        <ModalTitle>
                            <Button onClick={onCloseTab}>{title}</Button>/{t(`attributes.blocks.${tab}`)}
                        </ModalTitle>
                    </TitleWrapper>
                    <Table cols={tableCols} items={tableItems} />
                </>
            )}
            {!tab && (
                <>
                    <Title title={title} />
                    <List list={list} />
                    <Blocks blocks={blocks} />
                </>
            )}
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
