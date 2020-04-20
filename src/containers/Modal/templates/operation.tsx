import React from 'react';
import IconButton from '@material-ui/core/IconButton';

import { ArronaxIcon } from '../../../components/ArronaxIcon';

const operationTemplate = (props: any) => {
    const {
        values,
        attributes,
        formatValue,
        t,
        modal: { entity, items },
        count,
        changeCount,
        getRestListAttrFields,
        getRestBlockAttrFileds,
        explicitKeys,
        explicitMinorKeys,
    } = props;

    const total = items[entity] ? items[entity].length : 0;
    const kind = values.find((a: any) => a.name === 'kind');
    const opKind = kind !== undefined ? kind.value : 'undefined';
    const internal = values.find((a: any) => a.name === 'internal');
    const isInternal = internal !== undefined ? internal.value : 'undefined';
    const error = values.find((a: any) => a.name === 'errors');
    const hasError = error !== undefined && error.value.length > 0;
    let title = t('components.entityModal.details', { title: 'Operation' });
    let list: { title: any; value: any }[] = [];
    let block: { title: any; value: any }[] = [];
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
                    <IconButton aria-label="previous" disabled={count === 0} onClick={() => changeCount(count - 1)}>
                        <ArronaxIcon iconName="icon-previous" size="16px" color={count !== 0 ? '#65C8CE' : '#D3D3D3'} />
                    </IconButton>
                    {count + 1} {t('components.entityModal.of')} {total}
                    <IconButton aria-label="next" disabled={count === total - 1} onClick={() => changeCount(count + 1)}>
                        <ArronaxIcon iconName="icon-next" size="16px" color={count !== total - 1 ? '#65C8CE' : '#D3D3D3'} />
                    </IconButton>
                </span>
            </>
        );
    }

    if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') === undefined) {
        list = [
            {
                title: formatValue(values, attributes, 'kind'),
                value: (
                    <>
                        {formatValue(values, attributes, 'source', true)} &nbsp;&#x27A1;&nbsp; {formatValue(values, attributes, 'destination', true)}
                    </>
                ),
            },
            {
                title: t('attributes.operations.amount'),
                value: <>{formatValue(values, attributes, 'amount')}</>,
            },
        ];

        if (!isInternal) {
            list.push({
                title: t('attributes.operations.fee'),
                value: <>{formatValue(values, attributes, 'fee')}</>,
            });
        }

        if (isInternal) {
            list.push({
                title: t('attributes.operations.fee'),
                value: t('components.entityModal.operation.parent_fee'),
            });
        }

        list.push({
            title: formatValue(values, attributes, 'status'),
            value: (
                <>
                    {t('components.entityModal.operation.at_level', { level: formatValue(values, attributes, 'block_level') })}{' '}
                    {t('components.entityModal.operation.in_cycle', { cycle: formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                    {formatValue(values, attributes, 'block_hash', true)}
                </>
            ),
        });

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: <>{formatValue(values, attributes, 'errors')}</>,
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: <>{formatValue(values, attributes, 'timestamp')}</>,
        });

        list.push({
            title: t('attributes.operations.operation_group_hash'),
            value: <>{formatValue(values, attributes, 'operation_group_hash')}</>,
        });
    }

    if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') !== undefined) {
        list = [
            {
                title: formatValue(values, attributes, 'kind'),
                value: (
                    <>
                        {formatValue(values, attributes, 'source', true)} &nbsp;&#x27A1;&nbsp; {formatValue(values, attributes, 'destination', true)}
                    </>
                ),
            },
            {
                title: t('attributes.operations.parameters'),
                value: <>{formatValue(values, attributes, 'parameters')}</>,
            },
            {
                title: t('attributes.operations.amount'),
                value: <>{formatValue(values, attributes, 'amount')}</>,
            },
        ];

        if (!isInternal) {
            list.push({
                title: t('attributes.operations.fee'),
                value: <>{formatValue(values, attributes, 'fee')}</>,
            });
        }

        if (isInternal) {
            list.push({
                title: t('attributes.operations.fee'),
                value: <>{t('components.entityModal.operation.parent_fee')}</>,
            });
        }

        list.push({
            title: formatValue(values, attributes, 'status'),
            value: (
                <>
                    {t('components.entityModal.operation.at_level', { level: formatValue(values, attributes, 'block_level') })}{' '}
                    {t('components.entityModal.operation.in_cycle', { cycle: formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                    {formatValue(values, attributes, 'block_hash', true)}
                </>
            ),
        });

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: <>{formatValue(values, attributes, 'errors')}</>,
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: <>{formatValue(values, attributes, 'timestamp')}</>,
        });

        list.push({
            title: t('attributes.operations.consumed_gas'),
            value: (
                <>
                    {formatValue(values, attributes, 'consumed_gas')} {t('components.entityModal.of')} {formatValue(values, attributes, 'gas_limit')}
                </>
            ),
        });

        list.push({
            title: t('attributes.operations.operation_group_hash'),
            value: <>{formatValue(values, attributes, 'operation_group_hash')}</>,
        });
    }

    if (opKind === 'endorsement') {
        list = [
            {
                title: formatValue(values, attributes, 'kind'),
                value: (
                    <>
                        {t('components.entityModal.of')} {formatValue(values, attributes, 'branch', true)}{' '}
                        {t('components.entityModal.operation.at_level', { level: formatValue(values, attributes, 'level') })}
                    </>
                ),
            },
            {
                title: t('attributes.operations.delegate'),
                value: <>{formatValue(values, attributes, 'delegate')}</>,
            },
            {
                title: t('attributes.operations.slots'),
                value: (
                    <>
                        {formatValue(values, attributes, 'number_of_slots')}: {formatValue(values, attributes, 'slots')}
                    </>
                ),
            },
            {
                title: t('attributes.operations.timestamp'),
                value: (
                    <>
                        {formatValue(values, attributes, 'timestamp')} &nbsp; {t('components.entityModal.in')} &nbsp;{' '}
                        {formatValue(values, attributes, 'block_hash', true)}{' '}
                        {t('components.entityModal.operation.at_level', { level: formatValue(values, attributes, 'block_level') })}
                    </>
                ),
            },
        ];
    }

    if (opKind === 'delegation') {
        list = [
            {
                title: formatValue(values, attributes, 'kind'),
                value:
                    values.find((i: any) => i.name === 'delegate') === undefined ? (
                        <>
                            {formatValue(values, attributes, 'source', true)} {t('components.entityModal.to')} {t('components.entityModal.clear')}
                        </>
                    ) : (
                        <>
                            {formatValue(values, attributes, 'source', true)} {t('components.entityModal.to')}{' '}
                            {formatValue(values, attributes, 'delegate', true)}
                        </>
                    ),
            },
            {
                title: formatValue(values, attributes, 'status'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', { level: formatValue(values, attributes, 'block_level') })}{' '}
                        {t('components.entityModal.operation.in_cycle', { cycle: formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                        {formatValue(values, attributes, 'block_hash', true)}
                    </>
                ),
            },
        ];

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: <>{formatValue(values, attributes, 'errors')}</>,
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: <>{formatValue(values, attributes, 'timestamp')}</>,
        });

        list.push({
            title: t('attributes.operations.consumed_gas'),
            value: (
                <>
                    {formatValue(values, attributes, 'consumed_gas')} {t('components.entityModal.of')} {formatValue(values, attributes, 'gas_limit')}
                </>
            ),
        });
    }

    if (opKind === 'origination') {
        list = [
            {
                title: formatValue(values, attributes, 'kind'),
                value: (
                    <>
                        {t('components.entityModal.of')} {formatValue(values, attributes, 'originated_contracts', true)} {t('components.entityModal.by')}{' '}
                        {formatValue(values, attributes, 'source', true)}
                    </>
                ),
            },
            {
                title: formatValue(values, attributes, 'status'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', { level: formatValue(values, attributes, 'block_level') })}{' '}
                        {t('components.entityModal.operation.in_cycle', { cycle: formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                        {formatValue(values, attributes, 'block_hash', true)}
                    </>
                ),
            },
        ];

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: <>{formatValue(values, attributes, 'errors')}</>,
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: <>{formatValue(values, attributes, 'timestamp')}</>,
        });

        list.push({
            title: t('attributes.operations.consumed_gas'),
            value: (
                <>
                    {formatValue(values, attributes, 'consumed_gas')} {t('components.entityModal.of')} {formatValue(values, attributes, 'gas_limit')}
                </>
            ),
        });
    }

    if (opKind === 'reveal') {
        list = [
            {
                title: formatValue(values, attributes, 'kind'),
                value: (
                    <>
                        {formatValue(values, attributes, 'public_key', true)} {t('components.entityModal.by')} {formatValue(values, attributes, 'source', true)}
                    </>
                ),
            },
            {
                title: formatValue(values, attributes, 'status'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', { level: formatValue(values, attributes, 'block_level') })}{' '}
                        {t('components.entityModal.operation.in_cycle', { cycle: formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                        {formatValue(values, attributes, 'block_hash', true)}
                    </>
                ),
            },
        ];

        if (hasError) {
            list.push({
                title: t('attributes.operations.errors'),
                value: <>{formatValue(values, attributes, 'errors')}</>,
            });
        }

        list.push({
            title: t('attributes.operations.timestamp'),
            value: <>{formatValue(values, attributes, 'timestamp')}</>,
        });

        list.push({
            title: t('attributes.operations.consumed_gas'),
            value: (
                <>
                    {formatValue(values, attributes, 'consumed_gas')} {t('components.entityModal.of')} {formatValue(values, attributes, 'gas_limit')}
                </>
            ),
        });
    }

    if (opKind === 'ballot') {
        list = [
            {
                title: formatValue(values, attributes, 'ballot'),
                value: (
                    <>
                        {t('components.entityModal.by')} {formatValue(values, attributes, 'source', true)} {t('components.entityModal.on')}{' '}
                        {formatValue(values, attributes, 'proposal', true)}
                    </>
                ),
            },
            {
                title: t('components.entityModal.recorded'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', { level: formatValue(values, attributes, 'block_level') })}{' '}
                        {t('components.entityModal.operation.in_cycle', { cycle: formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                        {formatValue(values, attributes, 'block_hash', true)}
                    </>
                ),
            },
            {
                title: t('attributes.operations.timestamp'),
                value: <>{formatValue(values, attributes, 'timestamp')}</>,
            },
        ];
    }

    if (opKind === 'activate_account') {
        list = [
            {
                title: formatValue(values, attributes, 'kind'),
                value: <>{formatValue(values, attributes, 'pkh', true)}</>,
            },
            {
                title: t('attributes.operations.secret'),
                value: <>{formatValue(values, attributes, 'secret')}</>,
            },
            {
                title: t('components.entityModal.recorded'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', { level: formatValue(values, attributes, 'block_level') })}{' '}
                        {t('components.entityModal.operation.in_cycle', { cycle: formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                        {formatValue(values, attributes, 'block_hash', true)}
                    </>
                ),
            },
            {
                title: t('attributes.operations.timestamp'),
                value: <>{formatValue(values, attributes, 'timestamp')}</>,
            },
        ];
    }

    const restListItems = getRestListAttrFields(values, attributes);
    const restBlockItems = getRestBlockAttrFileds(values, attributes);

    list = [...list, ...restListItems];
    block = [...block, ...restBlockItems];

    return {
        title,
        items: {
            list,
            block,
        },
    };
};

export default operationTemplate;
