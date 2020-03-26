import React from 'react';
import styled from 'styled-components';

import Moment from 'react-moment';
import * as moment from 'moment';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Circle from '@material-ui/icons/FiberManualRecord';

import Clipboard from '../components/Clipboard';

import { AttributeDefinition, AttrbuteDataType, ConseilFunction, ConseilQuery, BabylonDelegationHelper, Tzip7ReferenceTokenHelper, TezosContractIntrospector } from 'conseiljs';
import { truncateHash, formatNumber, getOperatorType } from './general';

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
    truncate: boolean = true,
    renderInlineText?: boolean
) => {
    if (value == null || value.length === 0) {
        return '';
    }

    if (platform === 'tezos' && entity === 'operations' && attribute.name === 'errors') {
        const errors = value.substring(1, value.length - 1).split(',');

        for (let i = 0; i < errors.length; i++) { //https://tezos.gitlab.io/api/errors.html
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
            } else if (errors[i].includes('scriptRejectedRuntimeError') || errors[i].includes('script_rejected')) {
                errors[i] = 'Contract rejected';
            } else if (errors[i].includes('scriptRuntimeError') || errors[i].includes('runtime_error')) {
                errors[i] = 'Contract runtime error';
            } else if (errors[i].includes('ill_typed_contract')) {
                errors[i] = 'Contact type error';
            } else if (errors[i].includes('invalid_primitive')) {
                errors[i] = 'Invalid primitive';
            } else if (errors[i].includes('empty_implicit_delegated_contract')) {
                errors[i] = 'Empty implicit account';
            }
        }

        return errors.join(', ');
    }

    if (!!aggregation) {
        return formatAggregatedValue(attribute, value, aggregation);
    }

    const { dataFormat, dataType, valueMap } = attribute;
    const displayValueMap = valueMap && valueMap[value];

    switch (dataType) {
        case AttrbuteDataType.BOOLEAN:
            const svalue = value.toString();
            return svalue.charAt(0).toUpperCase() + svalue.slice(1);
        case AttrbuteDataType.DATETIME:
            if (!dataFormat) { return value; }

            if (truncate) {
                return <time>{moment.default(value).format(dataFormat).replace(/[.,]?\s?[0]{1,2}:00[:00]?(\sam)?/, '')}</time>
            }

            return <Moment format={dataFormat}>{value}</Moment>;
        case AttrbuteDataType.ACCOUNT_ADDRESS:
            if (renderInlineText) {
                return displayValueMap || (truncate && value.length >= 6 ? truncateHash(value) : value)
            }

            const colors = Buffer.from(Buffer.from(value.substring(3, 6) + value.slice(-3), 'utf8').map(b => Math.floor((b - 48) * 255) / 74)).toString('hex');
            const address = formatReferenceValue(attribute, displayValueMap || (truncate ? truncateHash(value) : value), value, onClickPrimaryKey);
            return (
                <>
                    <StyledCircle1 newcolor={`#${colors.substring(0, 6)}`} />
                    <StyledCircle2 newcolor={`#${colors.slice(-6)}`} />
                    {address}
                    <Clipboard value={value} />
                </>
            );
        case AttrbuteDataType.HASH:
            if (renderInlineText) {
                return displayValueMap || (truncate && value.length >= 6 ? truncateHash(value) : value)
            }
            const hash = formatReferenceValue(attribute, displayValueMap || (truncate ? truncateHash(value) : value), value, onClickPrimaryKey);
            return (
                <>
                    {hash}
                    <Clipboard value={value} />
                </>
            );
        case AttrbuteDataType.DECIMAL:
        case AttrbuteDataType.INT:
        case AttrbuteDataType.CURRENCY:
            return formatNumber(Number(value), attribute, truncate);
        case AttrbuteDataType.STRING:
            if (value.length > 100) {
                return (
                    <>
                        {displayValueMap || value.substring(0, 100)}
                        <Clipboard value={value} />
                    </>
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

export const formatQueryForNaturalLanguage = (platform: string, network: string, entity: string, query: ConseilQuery, attributes: AttributeDefinition[], operators: any) => {
    const timestamp = (query.predicates && query.predicates.length && query.predicates.find((p: any) => p.field === 'timestamp')) || null;
    const filters = (query.predicates && query.predicates.length && query.predicates.filter((f: any) => f.field !== 'timestamp')) || [];
    let renderTimestamp = undefined;

    if (timestamp) {
        const attribute = attributes.filter(a => a.name === timestamp.field)[0] as AttributeDefinition;
        const operation = operators[getOperatorType(attribute.dataType)].filter((o: any) => !timestamp.inverse ? o['name'] === timestamp.operation : o['name'] === 'not' + timestamp.operation)[0]['displayName'];
        const value = formatValueForDisplay(platform, network, timestamp.field, timestamp.set[0], attribute, () => {}, undefined, true, false);

        renderTimestamp = (
            <span>
                {operation}
                {' '}
                {value}
                {timestamp.operation === 'between' && <> and {formatValueForDisplay(platform, network, timestamp.field, timestamp.set[1], attribute, () => {}, undefined, true, false)}</>}
            </span>
        );
    }

    const renderFilters: any = filters.map((f: any, i: number) => {
        const isNextToLast = (filters.length - 2) === i;
        const isLast = (filters.length - 1) === i;
        const attribute = attributes.filter(a => a.name === f.field)[0] as AttributeDefinition;

        const field = attribute.displayName;

        const operation = operators[getOperatorType(attribute.dataType)].filter((o: any) => {
            if (!f.inverse) { return o['name'] === f.operation; }

            if (f.operation === 'startsWith') { return o['name'] === 'notstartWith'; }

            if (f.operation === 'endsWith') { return o['name'] === 'notendWith'; }

            if (f.operation === 'isnull') { return o['name'] === 'isnotnull'; }

            return o['name'] === 'not' + f.operation;
        })[0]['displayName'] + '';

        const value = formatValueForDisplay(platform, network, f.field, f.set[0], attribute, () => {}, undefined, true, true);

        return (
            <span key={f.field}>
                {field}
                {' '}
                {operation}
                {' '}
                {value}
                {f.operation === 'between' && <> and {formatValueForDisplay(platform, network, f.field, f.set[1], attribute, () => {}, undefined, true)}</>}
                {f.operation === 'in' && <>,  {f.set.slice(1).map((v: any) => formatValueForDisplay(platform, network, f.field, v, attribute, () => {}, undefined, true)).join(', ')}</>}
                {isLast ? '' : ', '}
                {isNextToLast ? ' and ' : ''}
            </span>
        );
    })

    return (
        <span>
            {(renderFilters.length || renderTimestamp) ? null : 'Latest '}
            {entity}
            {' '}
            {renderTimestamp}
            {renderFilters.length ? ' with ' : null}
            {renderFilters}
        </span>
    )
}

export const identifyContract = async (address: string, script: string): Promise<{type: string, entryPoints: string[]}> => {
    let contractType = 'unidentified';
    let entryPoints: string[] = [];
    let metadata: any = {};

    try {
        if (BabylonDelegationHelper.verifyScript(script)) {
            contractType = 'Babylon Delegation Contract';
        }
    } catch { }

    try {
        if (Tzip7ReferenceTokenHelper.verifyScript(script)) {
            contractType = 'FA1.2 Token Contract';

            //await Tzip7ReferenceTokenHelper.getSimpleStorage(tezosnode, address) // tezos node needs to be added to config
            //{mapid: number, supply: number, administrator: string, paused: boolean}> {
               
        }
    } catch (e) { console.log(e); }

    const parsedCalls = await TezosContractIntrospector.generateEntryPointsFromCode(script);

    for (const entryPoint of parsedCalls) {
        entryPoints.push(`${entryPoint.name}(${entryPoint.parameters.map((p: any) => `${p.name ? p.name + ': ' : ''}${p.type}`).join(', ')})`);
    }

    return { type: contractType, entryPoints };
}
