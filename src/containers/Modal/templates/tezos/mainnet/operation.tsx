import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';

import Title from '../../../parts/Title';
import List from '../../../parts/List';
import Blocks from '../../../parts/Blocks';
import { ArronaxIcon } from '../../../../../components/ArronaxIcon';

const Operation = (props: any) => {
    const { t } = useTranslation();
    const { platform, network, entity, items, values, attributes, formatValue, count, setCount } = props;
    const explicitKeys: string[] = ['utc_year', 'utc_month', 'utc_day', 'utc_time', 'period'];
    const explicitMinorKeys: string[] = [];
    const total = items[entity] ? items[entity].length : 0;
    const kind = values.find((a: any) => a.name === 'kind');
    const opKind = kind !== undefined ? kind.value : 'undefined';
    const internal = values.find((a: any) => a.name === 'internal');
    const isInternal = internal !== undefined ? internal.value : 'undefined';
    const error = values.find((a: any) => a.name === 'errors');
    const hasError = error !== undefined && error.value.length > 0;
    let title: any = t('components.entityModal.details', { title: 'Operation' });
    let list: { title: any; value: any }[] = [];
    let blocks: { title: any; value: any }[] = [];
    let keys: string[] = [];

    if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') !== undefined) {
        keys = ['counter', 'internal', 'storage_limit', 'storage_size'];
        keys.forEach((k: string) => {
            explicitMinorKeys.push(k);
            explicitKeys.push(k);
        });
    } else if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') === undefined) {
        keys = ['counter', 'internal', 'gas_limit', 'consumed_gas', 'storage_limit', 'storage_size'];
        keys.forEach((k: string) => {
            explicitMinorKeys.push(k);
            explicitKeys.push(k);
        });
    } else if (opKind === 'ballot') {
        keys.forEach((k: string) => {
            explicitMinorKeys.push(k);
            explicitKeys.push(k);
        });
    } else {
        keys = ['counter', 'internal', 'gas_limit', 'consumed_gas', 'storage_limit', 'storage_size'];
        keys.forEach((k: string) => {
            explicitMinorKeys.push(k);
            explicitKeys.push(k);
        });
    }

    if (total > 1) {
        title = (
            <>
                {title}
                <span>
                    <IconButton aria-label="previous" disabled={count === 0} onClick={() => setCount(count - 1)}>
                        <ArronaxIcon iconName="icon-previous" size="16px" color={count !== 0 ? '#65C8CE' : '#D3D3D3'} />
                    </IconButton>
                    {count + 1} {t('components.entityModal.of')} {total}
                    <IconButton aria-label="next" disabled={count === total - 1} onClick={() => setCount(count + 1)}>
                        <ArronaxIcon iconName="icon-next" size="16px" color={count !== total - 1 ? '#65C8CE' : '#D3D3D3'} />
                    </IconButton>
                </span>
            </>
        );
    }

    if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') === undefined) {
        list = [
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'kind'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'source', true)} &nbsp;&#x27A1;&nbsp;{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'destination', true)}
                    </>
                ),
            },
            {
                title: t('attributes.operations.amount'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'amount'),
            },
        ];

        if (!isInternal) {
            list.push({
                title: t('attributes.operations.fee'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'fee'),
            });
        }

        if (isInternal) {
            list.push({
                title: t('attributes.operations.fee'),
                value: t('components.entityModal.operation.parent_fee'),
            });
        }

        list.push({
            title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'status'),
            value: (
                <>
                    {t('components.entityModal.operation.at_level', {
                        level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                    })}{' '}
                    {t('components.entityModal.operation.in_cycle', {
                        cycle: formatValue(explicitKeys, platform, network, entity, values, attributes, 'cycle'),
                    })}
                    : &nbsp; {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_hash', true)}
                </>
            ),
        });

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'errors'),
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'timestamp'),
        });

        list.push({
            title: t('attributes.operations.operation_group_hash'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'operation_group_hash'),
        });
    }

    if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') !== undefined) {
        list = [
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'kind'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'source', true)} &nbsp;&#x27A1;&nbsp;{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'destination', true)}
                    </>
                ),
            },
            {
                title: t('attributes.operations.parameters'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'parameters'),
            },
            {
                title: t('attributes.operations.amount'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'amount'),
            },
        ];

        if (!isInternal) {
            list.push({
                title: t('attributes.operations.fee'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'fee'),
            });
        }

        if (isInternal) {
            list.push({
                title: t('attributes.operations.fee'),
                value: t('components.entityModal.operation.parent_fee'),
            });
        }

        list.push({
            title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'status'),
            value: (
                <>
                    {t('components.entityModal.operation.at_level', {
                        level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                    })}{' '}
                    {t('components.entityModal.operation.in_cycle', {
                        cycle: formatValue(explicitKeys, platform, network, entity, values, attributes, 'cycle'),
                    })}
                    : &nbsp; {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_hash', true)}
                </>
            ),
        });

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'errors'),
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'timestamp'),
        });

        list.push({
            title: t('attributes.operations.consumed_gas'),
            value: (
                <>
                    {formatValue(explicitKeys, platform, network, entity, values, attributes, 'consumed_gas')} {t('components.entityModal.of')}{' '}
                    {formatValue(explicitKeys, platform, network, entity, values, attributes, 'gas_limit')}
                </>
            ),
        });

        list.push({
            title: t('attributes.operations.operation_group_hash'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'operation_group_hash'),
        });
    }

    if (opKind === 'endorsement') {
        list = [
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'kind'),
                value: (
                    <>
                        {t('components.entityModal.of')} {formatValue(explicitKeys, platform, network, entity, values, attributes, 'branch', true)}{' '}
                        {t('components.entityModal.operation.at_level', {
                            level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'level'),
                        })}
                    </>
                ),
            },
            {
                title: t('attributes.operations.delegate'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'delegate'),
            },
            {
                title: t('attributes.operations.slots'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'number_of_slots')}:{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'slots')}
                    </>
                ),
            },
            {
                title: t('attributes.operations.timestamp'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'timestamp')} &nbsp; {t('components.entityModal.in')} &nbsp;{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_hash', true)}{' '}
                        {t('components.entityModal.operation.at_level', {
                            level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                        })}
                    </>
                ),
            },
        ];
    }

    if (opKind === 'delegation') {
        list = [
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'kind'),
                value:
                    values.find((i: any) => i.name === 'delegate') === undefined ? (
                        <>
                            {formatValue(explicitKeys, platform, network, entity, values, attributes, 'source', true)} {t('components.entityModal.to')}{' '}
                            {t('components.entityModal.clear')}
                        </>
                    ) : (
                        <>
                            {formatValue(explicitKeys, platform, network, entity, values, attributes, 'source', true)} {t('components.entityModal.to')}{' '}
                            {formatValue(explicitKeys, platform, network, entity, values, attributes, 'delegate', true)}
                        </>
                    ),
            },
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'status'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', {
                            level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                        })}{' '}
                        {t('components.entityModal.operation.in_cycle', {
                            cycle: formatValue(explicitKeys, platform, network, entity, values, attributes, 'cycle'),
                        })}
                        : &nbsp; {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_hash', true)}
                    </>
                ),
            },
        ];

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'errors'),
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'timestamp'),
        });

        list.push({
            title: t('attributes.operations.consumed_gas'),
            value: (
                <>
                    {formatValue(explicitKeys, platform, network, entity, values, attributes, 'consumed_gas')} {t('components.entityModal.of')}{' '}
                    {formatValue(explicitKeys, platform, network, entity, values, attributes, 'gas_limit')}
                </>
            ),
        });
    }

    if (opKind === 'origination') {
        list = [
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'kind'),
                value: (
                    <>
                        {t('components.entityModal.of')}{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'originated_contracts', true)}{' '}
                        {t('components.entityModal.by')} {formatValue(explicitKeys, platform, network, entity, values, attributes, 'source', true)}
                    </>
                ),
            },
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'status'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', {
                            level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                        })}{' '}
                        {t('components.entityModal.operation.in_cycle', {
                            cycle: formatValue(explicitKeys, platform, network, entity, values, attributes, 'cycle'),
                        })}
                        : &nbsp; {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_hash', true)}
                    </>
                ),
            },
        ];

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'errors'),
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'timestamp'),
        });

        list.push({
            title: t('attributes.operations.consumed_gas'),
            value: (
                <>
                    {formatValue(explicitKeys, platform, network, entity, values, attributes, 'consumed_gas')} {t('components.entityModal.of')}{' '}
                    {formatValue(explicitKeys, platform, network, entity, values, attributes, 'gas_limit')}
                </>
            ),
        });
    }

    if (opKind === 'reveal') {
        list = [
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'kind'),
                value: (
                    <>
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'public_key', true)} {t('components.entityModal.by')}{' '}
                        {formatValue(explicitKeys, platform, network, entity, values, attributes, 'source', true)}
                    </>
                ),
            },
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'status'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', {
                            level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                        })}{' '}
                        {t('components.entityModal.operation.in_cycle', {
                            cycle: formatValue(explicitKeys, platform, network, entity, values, attributes, 'cycle'),
                        })}
                        : &nbsp; {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_hash', true)}
                    </>
                ),
            },
        ];

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'errors'),
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'timestamp'),
        });

        list.push({
            title: t('attributes.operations.consumed_gas'),
            value: (
                <>
                    {formatValue(explicitKeys, platform, network, entity, values, attributes, 'consumed_gas')} {t('components.entityModal.of')}{' '}
                    {formatValue(explicitKeys, platform, network, entity, values, attributes, 'gas_limit')}
                </>
            ),
        });
    }

    if (opKind === 'ballot') {
        list = [
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'ballot'),
                value: (
                    <>
                        {t('components.entityModal.by')} {formatValue(explicitKeys, platform, network, entity, values, attributes, 'source', true)}{' '}
                        {t('components.entityModal.on')} {formatValue(explicitKeys, platform, network, entity, values, attributes, 'proposal', true)}
                    </>
                ),
            },
            {
                title: t('components.entityModal.recorded'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', {
                            level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                        })}{' '}
                        {t('components.entityModal.operation.in_cycle', {
                            cycle: formatValue(explicitKeys, platform, network, entity, values, attributes, 'cycle'),
                        })}
                        : &nbsp; {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_hash', true)}
                    </>
                ),
            },
            {
                title: t('attributes.operations.timestamp'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'timestamp'),
            },
        ];
    }

    if (opKind === 'activate_account') {
        list = [
            {
                title: formatValue(explicitKeys, platform, network, entity, values, attributes, 'kind'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'pkh', true),
            },
            {
                title: t('attributes.operations.secret'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'secret'),
            },
            {
                title: t('components.entityModal.recorded'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', {
                            level: formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_level'),
                        })}{' '}
                        {t('components.entityModal.operation.in_cycle', {
                            cycle: formatValue(explicitKeys, platform, network, entity, values, attributes, 'cycle'),
                        })}
                        : &nbsp; {formatValue(explicitKeys, platform, network, entity, values, attributes, 'block_hash', true)}
                    </>
                ),
            },
            {
                title: t('attributes.operations.timestamp'),
                value: formatValue(explicitKeys, platform, network, entity, values, attributes, 'timestamp'),
            },
        ];
    }

    const restListItems = values
        .filter((v: any) => !explicitKeys.includes(v.name))
        .map((item: any) => ({
            title: t(`attributes.${item.entity}.${item.name}`),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, item.name, true),
        }));

    const restBlockItems = explicitMinorKeys
        .filter((name: string) => values.find((i: any) => i.name === name) !== undefined)
        .map((name: string) => ({
            title: t(`attributes.operations.${name}`),
            value: formatValue(explicitKeys, platform, network, entity, values, attributes, name),
        }));

    list = [...list, ...restListItems];
    blocks = [...blocks, ...restBlockItems];

    return (
        <>
            <Title title={title} />
            <List list={list} />
            <Blocks blocks={blocks} />
        </>
    );
};

const operationCtrl = (props: any) => {
    const actions: any = [];
    const getActions = () => actions;
    const getComponent = () => <Operation {...props} />;

    return [getComponent, getActions];
};

export default operationCtrl;
