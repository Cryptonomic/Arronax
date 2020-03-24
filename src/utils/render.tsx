import React from 'react';
import styled from 'styled-components';

import Moment from 'react-moment';
import 'moment-timezone';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Circle from '@material-ui/icons/FiberManualRecord';

import Clipboard from '../components/Clipboard';

import { AttributeDefinition, AttrbuteDataType, ConseilFunction, ConseilQuery } from 'conseiljs';
import { truncateHash, formatNumber } from './general';

type StyledCircleProps = SvgIconProps & { newcolor: string };
const StyledCircle1 = styled(Circle)<{ newcolor: string }>`
    color: ${({ newcolor }) => newcolor};
` as React.ComponentType<StyledCircleProps>;

const StyledCircle2 = styled(Circle)<{ newcolor: string }>`
    color: ${({ newcolor }) => newcolor};
    margin-left: -4px;
    margin-right: 7px;
` as React.ComponentType<StyledCircleProps>;

const LinkDiv = styled.div`
    color: #56c2d9;
    cursor: pointer;
    text-decoration: underline;
`;

const LinkSpan = styled.span`
    color: #56c2d9;
    cursor: pointer;
    text-decoration: underline;
`;

const PrimaryKeyList: any = {
    blocks: ['hash', 'level'],
    accounts: ['account_id'],
    operations: ['operation_group_hash'],
};

const formatReferenceValue = (attribute: any, displayValue: string, value: any, onClickPrimaryKey: any) => {
    const { entity, name } = attribute;

    if (attribute.reference) {
        return <LinkDiv onClick={() => onClickPrimaryKey(attribute.reference.entity, attribute.reference.key, value)}>{displayValue}</LinkDiv>;
    }

    if (PrimaryKeyList[entity] && PrimaryKeyList[entity].includes(name)) {
        return <LinkDiv onClick={() => onClickPrimaryKey(entity, name, value)}>{displayValue}</LinkDiv>;
    }

    return displayValue;
};

const formatAggregatedValue = (attribute: AttributeDefinition, value: any, aggregation: ConseilFunction) => {
    let aggregationAttribute = { ...attribute };

    switch (aggregation) {
        case ConseilFunction.count:
            aggregationAttribute.dataType = AttrbuteDataType.INT;
            break;
        default:
            aggregationAttribute.dataType = attribute.dataType === AttrbuteDataType.CURRENCY ? AttrbuteDataType.CURRENCY : AttrbuteDataType.DECIMAL;
            break;
    }

    return formatNumber(Number(value), aggregationAttribute);
};

export const formatValueForDisplay = (
    platform: string,
    network: string,
    entity: string,
    value: any,
    attribute: AttributeDefinition,
    onClickPrimaryKey: (entity: string, key: string, value: string | number) => void,
    aggregation?: ConseilFunction,
    truncate: boolean = true
) => {
    if (value == null || value.length === 0) {
        return '';
    }

    if (/*platform === 'tezos' &&*/ entity === 'operations' && attribute.name === 'errors') {
        const errors = value.substring(1, value.length - 1).split(',');

        for (let i = 0; i < errors.length; i++) {
            if (errors[i].includes('gas_exhausted')) {
                errors[i] = 'Gas exhausted'; // TODO: translations
            } else if (errors[i].includes('cannot_pay_storage_fee')) {
                errors[i] = 'Cannot pay storage fee';
            } else if (errors[i].includes('balance_too_low')) {
                errors[i] = 'Balance too low';
            } else if (errors[i].includes('empty_transaction')) {
                errors[i] = 'Empty transaction';
            } else if (errors[i].includes('delegate.unchanged')) {
                errors[i] = 'Delegate unchanged';
            } else if (errors[i].includes('manager.unregistered_delegate')) {
                errors[i] = 'Unregistered delegate';
            } else if (errors[i].includes('delegate.no_deletion')) {
                errors[i] = 'Delegate no deletion';
            } else if (errors[i].includes('contract.non_existing_contract')) {
                errors[i] = 'Contract does not exist';
            } else if (errors[i].includes('contract.cannot_pay_storage_fee')) {
                errors[i] = 'Cannot pay storage fee';
            } else if (errors[i].includes('context.storage_error')) {
                errors[i] = 'Storage error';
            } else if (errors[i].includes('bad_contract_parameter')) {
                errors[i] = 'Invalid contract parameter';
            } else if (errors[i].includes('invalidSyntacticConstantError')) {
                errors[i] = 'Invalid syntactic constant';
            } else if (errors[i].includes('storage_exhausted')) {
                errors[i] = 'Storage exhausted';
            } else if (errors[i].includes('scriptRejectedRuntimeError')) {
                errors[i] = 'Contract rejected';
            } else if (errors[i].includes('scriptRuntimeError')) {
                errors[i] = 'Contract runtime error';
            }
        }

        return errors.join(', ');
    }

    if (!!aggregation) {
        formatAggregatedValue(attribute, value, aggregation);
    }

    const { dataFormat, dataType, valueMap } = attribute;
    const displayValueMap = valueMap && valueMap[value];

    switch (dataType) {
        case AttrbuteDataType.BOOLEAN:
            const svalue = value.toString();
            return svalue.charAt(0).toUpperCase() + svalue.slice(1);
        case AttrbuteDataType.DATETIME:
            if (!dataFormat) {
                return value;
            }
            return <Moment format={dataFormat}>{value}</Moment>;
        case AttrbuteDataType.ACCOUNT_ADDRESS:
            const colors = Buffer.from(Buffer.from(value.substring(3, 6) + value.slice(-3), 'utf8').map(b => Math.floor((b - 48) * 255) / 74)).toString('hex');
            const address = formatReferenceValue(attribute, displayValueMap || (truncate ? truncateHash(value) : value), value, onClickPrimaryKey);
            return (
                <React.Fragment>
                    <StyledCircle1 newcolor={`#${colors.substring(0, 6)}`} />
                    <StyledCircle2 newcolor={`#${colors.slice(-6)}`} />
                    {address}
                    <Clipboard value={value} />
                </React.Fragment>
            );
        case AttrbuteDataType.HASH:
            const hash = formatReferenceValue(attribute, displayValueMap || (truncate ? truncateHash(value) : value), value, onClickPrimaryKey);
            return (
                <React.Fragment>
                    {hash}
                    <Clipboard value={value} />
                </React.Fragment>
            );
        case AttrbuteDataType.DECIMAL:
        case AttrbuteDataType.INT:
        case AttrbuteDataType.CURRENCY:
            return formatNumber(Number(value), attribute, truncate);
        case AttrbuteDataType.STRING:
            if (value.length > 100) {
                return (
                    <React.Fragment>
                        {displayValueMap || value.substring(0, 100)}
                        <Clipboard value={value} />
                    </React.Fragment>
                );
            }
            if (value.length > 0 && attribute.cardinality && attribute.cardinality < 20) {
                return (
                    displayValueMap ||
                    value
                        .split('_')
                        .map((s: any) => s.charAt(0).toUpperCase() + s.slice(1))
                        .join(' ')
                );
            }
            return formatReferenceValue(attribute, displayValueMap || value, value, onClickPrimaryKey);
        default:
            return formatReferenceValue(attribute, displayValueMap || value, value, onClickPrimaryKey);
    }
};

export const formatValueWithLink = (props: { value: number; onClick: () => void }) => {
    const { value, onClick } = props;
    return <LinkSpan onClick={onClick}>{value}</LinkSpan>;
};

export const formatQueryForNaturalLanguage = (platform: string, network: string, entity: string, query: any): any => {
    const timestamp = (query[entity].predicates && query[entity].predicates.length && query[entity].predicates.find((p: any) => p.field === 'timestamp')) || null;
    const filters = (query[entity].predicates && query[entity].predicates.length && query[entity].predicates.filter((f: any) => f.field !== 'timestamp')) || [];
    let title = entity.slice(0, 1).toLocaleUpperCase() + entity.slice(1);
    let renderTimestamp;

    if (timestamp) {
        let operation = '';

        switch (timestamp.operation) {
            case 'eq':
                operation = !timestamp.inverse ? 'at' : 'excluding';
                break;
            case 'after':
                operation = 'since';
                break;
            case 'isnull':
                operation = '';
                break;
            default:
                operation = timestamp.operation;
        };

        renderTimestamp = (
            <span>
                {operation}
                {' '}
                <Moment format="HH:mm a on MMMM Do, YYYY">{timestamp.set[0]}</Moment>
                {timestamp.operation === 'between' && <> and <Moment format="HH:mm a on MMMM Do, YYYY">{timestamp.set[1]}</Moment></>}
            </span>
        )
    }

    const renderFilters: any = filters.map((f: any, i: number) => {
        const isLast = (filters.length - 1) === i;
        let operation = '';

        switch (f.operation) {
            case 'eq':
            case 'isnull':
                operation = '';
                break;
            case 'gt':
                operation = 'greater than';
                break;
            default:
                operation = f.operation;
        };

        return (
            <span key={f.field}>
                {f.field.replace('_', ' ')}
                {' '}
                {operation}
                {' '}
                {(f.field === 'hash' || f.field === 'operations_hash' || f.field === 'predecessor') ? truncateHash(f.set[0]) : f.set[0]}
                {f.operation === 'between' && <> and {f.set[1]}</>}
                {isLast ? '' : ', '}
            </span>
        );
    })

    return (
        <span>
            {title}
            {' '}
            {renderTimestamp}
            {renderFilters.length ? ' with ' : null}
            {renderFilters}
        </span>
    )
}
