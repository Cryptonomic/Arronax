import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import { AttributeDefinition, AttrbuteDataType, AttrbuteKeyType } from 'conseiljs';

import { fetchOperationsBlock, fetchContract, runActions } from '../../reducers/modal/thunk';
import { setModalOpen, setModalLoading, cleanModal } from '../../reducers/modal/actions';
import { getLoading, getSelectedConfig, getEntity, getAttributesAll } from '../../reducers/app/selectors';
import { getModal } from '../../reducers/modal/selectors';
import { formatValueForDisplay, formatValueWithLink } from '../../utils/render';
import { getNoEmptyFields } from '../../utils/attributes';
import Loader from '../../components/Loader';
import Table from '../../components/Table';
import { ArronaxIcon } from '../../components/ArronaxIcon';

import {
    ScrollContainer,
    ModalContainer,
    ListContainer,
    CloseIcon,
    ModalTitle,
    RowContainer,
    TitleTxt,
    ContentTxt,
    BottomRowContainer,
    BottomCol,
    BottomColTitle,
    BottomColContent,
    MultiLineContainer,
    MultiLineItem,
    TitleWrapper,
    Button,
} from './style';

class EntityModal extends Component<any, any> {
    schema: any;
    explicitKeys: string[];
    explicitMinorKeys: string[];
    constructor(props: any) {
        super(props);
        this.state = {
            open: true,
            tab: '',
            tabActive: false,
            count: 0,
        };
        this.explicitKeys = [];
        this.explicitMinorKeys = [];
        this.schema = {};
    }

    fetchData = (type: string, values: any) => {
        switch (type) {
            case 'blockOperations':
                const { getBlockOperations } = this.props;
                return getBlockOperations(type, values);
            case 'contract':
                const { getContract } = this.props;
                return getContract(type, values);
            default:
                return;
        }
    };

    formatValue = (processedValues: any[], attributes: any[], key: string, truncate: boolean = false) => {
        const {
            onClickPrimaryKey,
            selectedConfig: { platform, network },
            modal: { entity },
        } = this.props;
        this.explicitKeys.push(key);
        if (processedValues.find((i) => i.name === key) === undefined) {
            return '';
        }
        return formatValueForDisplay(
            platform,
            network,
            entity,
            processedValues.find((i) => i.name === key).value,
            attributes.filter((a) => a.name === key)[0],
            onClickPrimaryKey,
            undefined,
            truncate
        );
    };

    formatSpecificValue = (value: string, dataType: AttrbuteDataType, truncate: boolean = false) => {
        if (!value) {
            return '';
        }

        const {
            onClickPrimaryKey,
            selectedConfig: { platform, network },
        } = this.props;

        const attribute: AttributeDefinition = {
            name: '',
            displayName: '',
            dataType: dataType,
            cardinality: 1,
            keyType: AttrbuteKeyType.NONKEY,
            entity: '',
            dataFormat: '',
            visible: true,
        };

        return formatValueForDisplay(platform, network, 'accounts', value, attribute, onClickPrimaryKey, undefined, truncate);
    };

    getRestListAttrFields = (values: any, attributes: any) => {
        const { t } = this.props;
        return values
            .filter((v: any) => !this.explicitKeys.includes(v.name))
            .map((item: any) => ({
                title: t(`attributes.${item.entity}.${item.name}`),
                value: <>{this.formatValue(values, attributes, item.name, true)}</>,
            }));
    };

    getRestBlockAttrFileds = (values: any, attributes: any) => {
        const { t } = this.props;
        return this.explicitMinorKeys
            .filter((name: string) => values.find((i: any) => i.name === name) !== undefined)
            .map((name: string) => ({
                title: t(`attributes.operations.${name}`),
                value: <>{this.formatValue(values, attributes, name)}</>,
            }));
    };

    findType = (values: any[]) => {
        const {
            modal: { entity },
        } = this.props;
        const { tab, tabActive } = this.state;

        if (tabActive && tab) {
            return tab;
        }
        if (entity === 'accounts' && values.find((v: any) => v.name === 'is_baker')?.value) {
            return 'baker';
        }
        if (entity === 'accounts' && values.find((v: any) => v.name === 'account_id')?.value.startsWith('KT1')) {
            return 'contract';
        }

        return entity;
    };

    getSchema = () => {
        const {
            attributes,
            selectedConfig: { network },
            modal: { items, entity },
            match: {
                params: { id },
            },
        } = this.props;
        const { count } = this.state;
        const values = getNoEmptyFields(attributes[network][entity], items[entity][count]);
        const type = this.findType(values);

        this.explicitKeys = []; //reset keys
        this.explicitMinorKeys = []; //reset keys

        switch (type) {
            case 'blocks':
                return this.getBlock(values, attributes[network][entity], id);
            case 'accounts':
                return this.getAccount(values, attributes[network][entity]);
            case 'baker':
                return this.getBaker(values, attributes[network][entity]);
            case 'contract':
                return this.getContract(values, attributes[network][entity], id);
            case 'operations':
                return this.getOperation(values, attributes[network][entity]);
            case 'block_operations':
                return this.getBlockOperations();
            default:
                return values;
        }
    };

    getAccount = (values: any, attributes: any) => {
        const { t } = this.props;
        return {
            title: t('components.entityModal.details', { title: 'Account' }),
            items: {
                list: [
                    {
                        title: t('attributes.accounts.account_id'),
                        value: <>{this.formatValue(values, attributes, 'account_id')}</>,
                    },
                    {
                        title: t('attributes.accounts.balance'),
                        value: <>{this.formatValue(values, attributes, 'balance')}</>,
                    },
                    {
                        title: t('components.entityModal.account.last_active_title'),
                        value: (
                            <>
                                {t('components.entityModal.account.at_level', { level: this.formatValue(values, attributes, 'block_level') })}: &nbsp;{' '}
                                {this.formatValue(values, attributes, 'block_id', true)}
                            </>
                        ),
                    },
                    {
                        title: t(`attributes.accounts.counter`),
                        value: <>{this.formatValue(values, attributes, 'counter')}</>,
                    },
                    {
                        title: t(`attributes.accounts.delegate_value`),
                        value: <>{this.formatValue(values, attributes, 'delegate_value')}</>,
                    },
                ],
                block: [],
            },
        };
    };

    getBaker = (values: any, attributes: any) => {
        const { t } = this.props;
        return {
            title: t('components.entityModal.details', { title: 'Baker' }),
            items: {
                list: [
                    {
                        title: t('components.entityModal.account.baker'),
                        value: <>{this.formatValue(values, attributes, 'account_id')}</>,
                    },
                    {
                        title: t('attributes.accounts.balance'),
                        value: <>{this.formatValue(values, attributes, 'balance')}</>,
                    },
                    {
                        title: t('components.entityModal.account.last_active_title'),
                        value: (
                            <>
                                {t('components.entityModal.account.at_level', { level: this.formatValue(values, attributes, 'block_level') })}: &nbsp;{' '}
                                {this.formatValue(values, attributes, 'block_id', true)}
                            </>
                        ),
                    },
                    {
                        title: t(`attributes.accounts.counter`),
                        value: <>{this.formatValue(values, attributes, 'counter')}</>,
                    },
                    {
                        title: t(`attributes.accounts.delegate_value`),
                        value: <>{this.formatValue(values, attributes, 'delegate_value')}</>,
                    },
                ],
                block: [],
            },
        };
    };

    getBlock = (values: any, attributes: any, id: string | number) => {
        const {
            t,
            modal: {
                modules: { blockOperations },
            },
        } = this.props;

        const defaultBlock: any = {
            title: t('components.entityModal.details', { title: 'Block' }),
            items: {
                list: [
                    {
                        title: t('attributes.blocks.hash'),
                        value: <>{this.formatValue(values, attributes, 'hash', true)}</>,
                    },
                    {
                        title: t('attributes.blocks.level'),
                        value: (
                            <>
                                {this.formatValue(values, attributes, 'level')} {t('components.entityModal.of')}{' '}
                                {t('attributes.blocks.meta_cycle').toLowerCase()} {this.formatValue(values, attributes, 'meta_cycle')}{' '}
                                {t('components.entityModal.in')} {t('attributes.blocks.meta_voting_period').toLowerCase()}{' '}
                                {this.formatValue(values, attributes, 'meta_voting_period')}
                            </>
                        ),
                    },
                    {
                        title: t('attributes.blocks.baker'),
                        value: (
                            <>
                                {this.formatValue(values, attributes, 'baker')} {t('components.entityModal.of')} {t('attributes.blocks.priority').toLowerCase()}{' '}
                                {this.formatValue(values, attributes, 'priority')}
                            </>
                        ),
                    },
                    {
                        title: t('attributes.blocks.protocol'),
                        value: (
                            <>
                                {this.formatValue(values, attributes, 'proto')}: {this.formatValue(values, attributes, 'protocol', true)}
                            </>
                        ),
                    },
                    {
                        title: t('general.nouns.period'),
                        value: <>{this.formatValue(values, attributes, 'period_kind')}</>,
                    },
                ],
                block: [],
            },
            actions: [() => this.fetchData('blockOperations', { id })],
        };

        if (blockOperations?.length > 0) {
            defaultBlock.items.block.push({
                title: t('attributes.blocks.block_operations'),
                value: <>{formatValueWithLink({ value: blockOperations.length, onClick: () => this.onClickItem('block_operations') })}</>,
            });
        }

        const restListItems = this.getRestListAttrFields(values, attributes);

        defaultBlock.items.list = [...defaultBlock.items.list, ...restListItems];

        return defaultBlock;
    };

    getContract = (values: any, attributes: any, id: string | number) => {
        const {
            t,
            modal: {
                modules: { contract },
            },
        } = this.props;

        this.explicitKeys.push('is_baker'); // do not render Baker field

        const defaultContract: any = {
            title: t('components.entityModal.details', { title: 'Contract' }),
            items: {
                list: [
                    {
                        title: t('components.entityModal.account.contract'),
                        value: <>{this.formatValue(values, attributes, 'account_id')}</>,
                    },
                    {
                        title: t('attributes.accounts.balance'),
                        value: <>{this.formatValue(values, attributes, 'balance')}</>,
                    },
                    {
                        title: t('components.entityModal.account.last_active_title'),
                        value: (
                            <>
                                {t('components.entityModal.account.at_level', { level: this.formatValue(values, attributes, 'block_level') })}: &nbsp;{' '}
                                {this.formatValue(values, attributes, 'block_id', true)}
                            </>
                        ),
                    },
                ],
                block: [],
            },
            actions: [() => this.fetchData('contract', { id, values })],
        };

        if (contract?.type && contract.type !== 'Unidentified') {
            defaultContract.items.list.push({
                title: t('components.entityModal.account.contractType'),
                value: <>{contract.type}</>,
            });
        }

        if (contract?.entryPoints?.length) {
            defaultContract.items.list.push({
                title: t('components.entityModal.account.entryPoints'),
                value: contract.entryPoints,
                multiline: true,
            });
        }

        if (contract?.metadata?.mapSummary?.length) {
            defaultContract.items.list.push({
                title: t('components.entityModal.account.maps'),
                value: contract.metadata.mapSummary,
                multiline: true,
            });
        }

        if (contract?.type && contract.type.startsWith('FA1.2')) {
            defaultContract.items.list.push({
                title: t('components.entityModal.account.tokenAdmin'),
                value: <>{this.formatSpecificValue(contract.metadata.manager, AttrbuteDataType.ACCOUNT_ADDRESS, false)}</>,
            });
            defaultContract.items.list.push({
                title: t('components.entityModal.account.tokenSupply'),
                value: <>{this.formatSpecificValue(contract.metadata.supply, AttrbuteDataType.DECIMAL, true)}</>,
            });
        }

        if (contract?.type && contract.type === 'Babylon Delegation Contract') {
            defaultContract.items.list.push({
                title: t('components.entityModal.account.admin'),
                value: <>{this.formatSpecificValue(contract.metadata.manager, AttrbuteDataType.ACCOUNT_ADDRESS, false)}</>,
            });
        }

        const restListItems = this.getRestListAttrFields(values, attributes);

        defaultContract.items.list = [...defaultContract.items.list, ...restListItems];

        return defaultContract;
    };

    getOperation = (values: any, attributes: any) => {
        const {
            t,
            modal: { items, entity },
        } = this.props;
        const { count } = this.state;
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

        if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') !== undefined) {
            this.explicitMinorKeys = ['counter', 'internal', 'storage_limit', 'storage_size'];
            this.explicitKeys = [...this.explicitMinorKeys];
        } else if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') === undefined) {
            this.explicitMinorKeys = ['counter', 'internal', 'gas_limit', 'consumed_gas', 'storage_limit', 'storage_size'];
            this.explicitKeys = [...this.explicitMinorKeys];
        } else if (opKind === 'ballot') {
            this.explicitKeys = [...this.explicitMinorKeys];
        } else {
            this.explicitMinorKeys = ['counter', 'internal', 'gas_limit', 'consumed_gas', 'storage_limit', 'storage_size'];
            this.explicitKeys = [...this.explicitMinorKeys];
        }

        if (total > 1) {
            title = (
                <>
                    {title}
                    <span>
                        <IconButton aria-label="previous" disabled={count === 0} onClick={() => this.changeCount(count - 1)}>
                            <ArronaxIcon iconName="icon-previous" size="16px" color={count !== 0 ? '#65C8CE' : '#D3D3D3'} />
                        </IconButton>
                        {count + 1} {t('components.entityModal.of')} {total}
                        <IconButton aria-label="next" disabled={count === total - 1} onClick={() => this.changeCount(count + 1)}>
                            <ArronaxIcon iconName="icon-next" size="16px" color={count !== total - 1 ? '#65C8CE' : '#D3D3D3'} />
                        </IconButton>
                    </span>
                </>
            );
        }

        if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') === undefined) {
            list = [
                {
                    title: this.formatValue(values, attributes, 'kind'),
                    value: (
                        <>
                            {this.formatValue(values, attributes, 'source', true)} &nbsp;&#x27A1;&nbsp;{' '}
                            {this.formatValue(values, attributes, 'destination', true)}
                        </>
                    ),
                },
                {
                    title: t('attributes.operations.amount'),
                    value: <>{this.formatValue(values, attributes, 'amount')}</>,
                },
            ];

            if (!isInternal) {
                list.push({
                    title: t('attributes.operations.fee'),
                    value: <>{this.formatValue(values, attributes, 'fee')}</>,
                });
            }

            if (isInternal) {
                list.push({
                    title: t('attributes.operations.fee'),
                    value: t('components.entityModal.operation.parent_fee'),
                });
            }

            list.push({
                title: this.formatValue(values, attributes, 'status'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', { level: this.formatValue(values, attributes, 'block_level') })}{' '}
                        {t('components.entityModal.operation.in_cycle', { cycle: this.formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                        {this.formatValue(values, attributes, 'block_hash', true)}
                    </>
                ),
            });

            if (hasError) {
                list.push({
                    title: t('attributes.operations.errors'),
                    value: <>{this.formatValue(values, attributes, 'errors')}</>,
                });
            }

            list.push({
                title: t('attributes.operations.timestamp'),
                value: <>{this.formatValue(values, attributes, 'timestamp')}</>,
            });

            list.push({
                title: t('attributes.operations.operation_group_hash'),
                value: <>{this.formatValue(values, attributes, 'operation_group_hash')}</>,
            });
        }

        if (opKind === 'transaction' && values.find((i: any) => i.name === 'parameters') !== undefined) {
            list = [
                {
                    title: this.formatValue(values, attributes, 'kind'),
                    value: (
                        <>
                            {this.formatValue(values, attributes, 'source', true)} &nbsp;&#x27A1;&nbsp;{' '}
                            {this.formatValue(values, attributes, 'destination', true)}
                        </>
                    ),
                },
                {
                    title: t('attributes.operations.parameters'),
                    value: <>{this.formatValue(values, attributes, 'parameters')}</>,
                },
                {
                    title: t('attributes.operations.amount'),
                    value: <>{this.formatValue(values, attributes, 'amount')}</>,
                },
            ];

            if (!isInternal) {
                list.push({
                    title: t('attributes.operations.fee'),
                    value: <>{this.formatValue(values, attributes, 'fee')}</>,
                });
            }

            if (isInternal) {
                list.push({
                    title: t('attributes.operations.fee'),
                    value: <>{t('components.entityModal.operation.parent_fee')}</>,
                });
            }

            list.push({
                title: this.formatValue(values, attributes, 'status'),
                value: (
                    <>
                        {t('components.entityModal.operation.at_level', { level: this.formatValue(values, attributes, 'block_level') })}{' '}
                        {t('components.entityModal.operation.in_cycle', { cycle: this.formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                        {this.formatValue(values, attributes, 'block_hash', true)}
                    </>
                ),
            });

            if (hasError) {
                list.push({
                    title: t('attributes.operations.errors'),
                    value: <>{this.formatValue(values, attributes, 'errors')}</>,
                });
            }

            list.push({
                title: t('attributes.operations.timestamp'),
                value: <>{this.formatValue(values, attributes, 'timestamp')}</>,
            });

            list.push({
                title: t('attributes.operations.consumed_gas'),
                value: (
                    <>
                        {this.formatValue(values, attributes, 'consumed_gas')} {t('components.entityModal.of')}{' '}
                        {this.formatValue(values, attributes, 'gas_limit')}
                    </>
                ),
            });

            list.push({
                title: t('attributes.operations.operation_group_hash'),
                value: <>{this.formatValue(values, attributes, 'operation_group_hash')}</>,
            });
        }

        if (opKind === 'endorsement') {
            list = [
                {
                    title: this.formatValue(values, attributes, 'kind'),
                    value: (
                        <>
                            {t('components.entityModal.of')} {this.formatValue(values, attributes, 'branch', true)}{' '}
                            {t('components.entityModal.operation.at_level', { level: this.formatValue(values, attributes, 'level') })}
                        </>
                    ),
                },
                {
                    title: t('attributes.operations.delegate'),
                    value: <>{this.formatValue(values, attributes, 'delegate')}</>,
                },
                {
                    title: t('attributes.operations.slots'),
                    value: (
                        <>
                            {this.formatValue(values, attributes, 'number_of_slots')}: {this.formatValue(values, attributes, 'slots')}
                        </>
                    ),
                },
                {
                    title: t('attributes.operations.timestamp'),
                    value: (
                        <>
                            {this.formatValue(values, attributes, 'timestamp')} &nbsp; {t('components.entityModal.in')} &nbsp;{' '}
                            {this.formatValue(values, attributes, 'block_hash', true)}{' '}
                            {t('components.entityModal.operation.at_level', { level: this.formatValue(values, attributes, 'block_level') })}
                        </>
                    ),
                },
            ];
        }

        if (opKind === 'delegation') {
            list = [
                {
                    title: this.formatValue(values, attributes, 'kind'),
                    value:
                        values.find((i: any) => i.name === 'delegate') === undefined ? (
                            <>
                                {this.formatValue(values, attributes, 'source', true)} {t('components.entityModal.to')} {t('components.entityModal.clear')}
                            </>
                        ) : (
                            <>
                                {this.formatValue(values, attributes, 'source', true)} {t('components.entityModal.to')}{' '}
                                {this.formatValue(values, attributes, 'delegate', true)}
                            </>
                        ),
                },
                {
                    title: this.formatValue(values, attributes, 'status'),
                    value: (
                        <>
                            {t('components.entityModal.operation.at_level', { level: this.formatValue(values, attributes, 'block_level') })}{' '}
                            {t('components.entityModal.operation.in_cycle', { cycle: this.formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                            {this.formatValue(values, attributes, 'block_hash', true)}
                        </>
                    ),
                },
            ];

            if (hasError) {
                list.push({
                    title: t('attributes.operations.errors'),
                    value: <>{this.formatValue(values, attributes, 'errors')}</>,
                });
            }

            list.push({
                title: t('attributes.operations.timestamp'),
                value: <>{this.formatValue(values, attributes, 'timestamp')}</>,
            });

            list.push({
                title: t('attributes.operations.consumed_gas'),
                value: (
                    <>
                        {this.formatValue(values, attributes, 'consumed_gas')} {t('components.entityModal.of')}{' '}
                        {this.formatValue(values, attributes, 'gas_limit')}
                    </>
                ),
            });
        }

        if (opKind === 'origination') {
            list = [
                {
                    title: this.formatValue(values, attributes, 'kind'),
                    value: (
                        <>
                            {t('components.entityModal.of')} {this.formatValue(values, attributes, 'originated_contracts', true)}{' '}
                            {t('components.entityModal.by')} {this.formatValue(values, attributes, 'source', true)}
                        </>
                    ),
                },
                {
                    title: this.formatValue(values, attributes, 'status'),
                    value: (
                        <>
                            {t('components.entityModal.operation.at_level', { level: this.formatValue(values, attributes, 'block_level') })}{' '}
                            {t('components.entityModal.operation.in_cycle', { cycle: this.formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                            {this.formatValue(values, attributes, 'block_hash', true)}
                        </>
                    ),
                },
            ];

            if (hasError) {
                list.push({
                    title: t('attributes.operations.errors'),
                    value: <>{this.formatValue(values, attributes, 'errors')}</>,
                });
            }

            list.push({
                title: t('attributes.operations.timestamp'),
                value: <>{this.formatValue(values, attributes, 'timestamp')}</>,
            });

            list.push({
                title: t('attributes.operations.consumed_gas'),
                value: (
                    <>
                        {this.formatValue(values, attributes, 'consumed_gas')} {t('components.entityModal.of')}{' '}
                        {this.formatValue(values, attributes, 'gas_limit')}
                    </>
                ),
            });
        }

        if (opKind === 'reveal') {
            list = [
                {
                    title: this.formatValue(values, attributes, 'kind'),
                    value: (
                        <>
                            {this.formatValue(values, attributes, 'public_key', true)} {t('components.entityModal.by')}{' '}
                            {this.formatValue(values, attributes, 'source', true)}
                        </>
                    ),
                },
                {
                    title: this.formatValue(values, attributes, 'status'),
                    value: (
                        <>
                            {t('components.entityModal.operation.at_level', { level: this.formatValue(values, attributes, 'block_level') })}{' '}
                            {t('components.entityModal.operation.in_cycle', { cycle: this.formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                            {this.formatValue(values, attributes, 'block_hash', true)}
                        </>
                    ),
                },
            ];

            if (hasError) {
                list.push({
                    title: t('attributes.operations.errors'),
                    value: <>{this.formatValue(values, attributes, 'errors')}</>,
                });
            }

            list.push({
                title: t('attributes.operations.timestamp'),
                value: <>{this.formatValue(values, attributes, 'timestamp')}</>,
            });

            list.push({
                title: t('attributes.operations.consumed_gas'),
                value: (
                    <>
                        {this.formatValue(values, attributes, 'consumed_gas')} {t('components.entityModal.of')}{' '}
                        {this.formatValue(values, attributes, 'gas_limit')}
                    </>
                ),
            });
        }

        if (opKind === 'ballot') {
            list = [
                {
                    title: this.formatValue(values, attributes, 'ballot'),
                    value: (
                        <>
                            {t('components.entityModal.by')} {this.formatValue(values, attributes, 'source', true)} {t('components.entityModal.on')}{' '}
                            {this.formatValue(values, attributes, 'proposal', true)}
                        </>
                    ),
                },
                {
                    title: t('components.entityModal.recorded'),
                    value: (
                        <>
                            {t('components.entityModal.operation.at_level', { level: this.formatValue(values, attributes, 'block_level') })}{' '}
                            {t('components.entityModal.operation.in_cycle', { cycle: this.formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                            {this.formatValue(values, attributes, 'block_hash', true)}
                        </>
                    ),
                },
                {
                    title: t('attributes.operations.timestamp'),
                    value: <>{this.formatValue(values, attributes, 'timestamp')}</>,
                },
            ];
        }

        if (opKind === 'activate_account') {
            list = [
                {
                    title: this.formatValue(values, attributes, 'kind'),
                    value: <>{this.formatValue(values, attributes, 'pkh', true)}</>,
                },
                {
                    title: t('attributes.operations.secret'),
                    value: <>{this.formatValue(values, attributes, 'secret')}</>,
                },
                {
                    title: t('components.entityModal.recorded'),
                    value: (
                        <>
                            {t('components.entityModal.operation.at_level', { level: this.formatValue(values, attributes, 'block_level') })}{' '}
                            {t('components.entityModal.operation.in_cycle', { cycle: this.formatValue(values, attributes, 'cycle') })}: &nbsp;{' '}
                            {this.formatValue(values, attributes, 'block_hash', true)}
                        </>
                    ),
                },
                {
                    title: t('attributes.operations.timestamp'),
                    value: <>{this.formatValue(values, attributes, 'timestamp')}</>,
                },
            ];
        }

        const restListItems = this.getRestListAttrFields(values, attributes);
        const restBlockItems = this.getRestBlockAttrFileds(values, attributes);

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

    getBlockOperations = () => {
        const opsColsName = (cols: string[]) => {
            const { t } = this.props;
            return cols.map((col) => {
                return {
                    name: col,
                    displayName: t(`attributes.operations.${col}`),
                };
            });
        };

        const opsItems = (cols: { name: string }[]) => {
            const {
                modal: {
                    modules: { blockOperations },
                },
                attributes,
                selectedConfig: { network },
            } = this.props;
            return blockOperations.map((item: any) => {
                const newItem = { ...item };
                const opsValues = getNoEmptyFields(attributes[network]['operations'], item);
                cols.map((col: { name: string }) => {
                    if (col.name === 'kind') return (newItem[col.name] = newItem[col.name].slice(0, 1).toLocaleUpperCase().concat(newItem[col.name].slice(1)));
                    return (newItem[col.name] = this.formatValue(opsValues, attributes[network]['operations'], col.name, true));
                });
                return newItem;
            });
        };

        const cols = opsColsName(['kind', 'amount', 'fee', 'operation_group_hash', 'source', 'destination', 'parameters']);
        const items = opsItems(cols);
        const { t } = this.props;
        return {
            title: t('components.entityModal.details', { title: 'Block' }),
            cols,
            items,
        };
    };

    onCloseModal = () => {
        const { doModalOpen, doCleanModal, onCloseEntityModal } = this.props;
        doModalOpen(false);
        doCleanModal();
        onCloseEntityModal();
    };

    onClickItem = (name: string) => {
        this.setState({
            tab: name,
            tabActive: true,
        });
    };

    onCloseTab = () => {
        this.setState({
            tab: '',
            tabActive: false,
        });
    };

    changeCount = (count: number) => {
        this.setState({ count });
    };

    componentDidMount() {
        const { doRunActions, doModalLoading } = this.props;
        const { actions } = this.schema;

        if (actions && actions.length) {
            doRunActions(actions);
            return;
        }
        doModalLoading(false);
    }

    componentDidUpdate(prevProps: any) {
        const { id: previousId } = prevProps.modal;
        const {
            modal: { id: currentId },
            doRunActions,
            doModalLoading,
        } = this.props;
        const { tab, tabActive } = this.state;
        const { actions } = this.schema;
        if (previousId !== currentId) {
            if (tab && tabActive) {
                this.onCloseTab();
            }

            if (actions && actions.length) {
                doRunActions(actions);
                return;
            }
            doModalLoading(false);
        }
    }

    render() {
        const {
            modal: { open, isModalLoading },
            t,
        } = this.props;
        const { tab, tabActive } = this.state;
        this.schema = this.getSchema();
        const title = this.schema?.title || '';
        const list = this.schema?.items?.list?.length ? this.schema.items.list : [];
        const block = this.schema?.items?.block?.length ? this.schema.items.block : [];
        return (
            <Modal open={open} disableEnforceFocus>
                <ScrollContainer>
                    <ModalContainer>
                        <TitleWrapper>
                            <CloseIcon onClick={this.onCloseModal} size="19px" top="30px" right="30px" color="#9b9b9b" iconName="icon-close" />
                            {!isModalLoading && (
                                <ModalTitle>
                                    {!tabActive && title}
                                    {tabActive && (
                                        <>
                                            <Button onClick={this.onCloseTab}>{title}</Button>/{t(`attributes.blocks.${tab}`)}
                                        </>
                                    )}
                                </ModalTitle>
                            )}
                        </TitleWrapper>

                        {isModalLoading && <Loader />}

                        {!isModalLoading && !tabActive && (
                            <>
                                <ListContainer>
                                    {list.map((item: any, index: any) => (
                                        <RowContainer key={item.title}>
                                            <TitleTxt>{item.title}</TitleTxt>
                                            {!item.multiline && <ContentTxt>{item.value}</ContentTxt>}
                                            {item.multiline && (
                                                <MultiLineContainer>
                                                    {item.value.map((i: any) => (
                                                        <MultiLineItem key={i}>{i}</MultiLineItem>
                                                    ))}
                                                </MultiLineContainer>
                                            )}
                                        </RowContainer>
                                    ))}
                                </ListContainer>
                                <BottomRowContainer>
                                    {block.map((item: any) => (
                                        <BottomCol key={item.title}>
                                            <BottomColTitle>{item.title}</BottomColTitle>
                                            <BottomColContent>{item.value}</BottomColContent>
                                        </BottomCol>
                                    ))}
                                </BottomRowContainer>
                            </>
                        )}

                        {!isModalLoading && tabActive && tab === 'block_operations' && (
                            <>
                                <Table cols={this.schema.cols} items={this.schema.items} />
                            </>
                        )}
                    </ModalContainer>
                </ScrollContainer>
            </Modal>
        );
    }
}

const mapStateToProps = (state: any) => ({
    isLoading: getLoading(state),
    selectedConfig: getSelectedConfig(state),
    selectedEntity: getEntity(state),
    attributes: getAttributesAll(state),
    modal: getModal(state),
});

const mapDispatchToProps = (dispatch: any) => ({
    getBlockOperations: (name: string, values: any) => dispatch(fetchOperationsBlock(name, values)),
    getContract: (name: string, values: any) => dispatch(fetchContract(name, values)),
    doModalOpen: (value: boolean) => dispatch(setModalOpen(value)),
    doModalLoading: (value: boolean) => dispatch(setModalLoading(value)),
    doRunActions: (actions: any) => dispatch(runActions(actions)),
    doCleanModal: () => dispatch(cleanModal()),
});

export const DynamicModal: any = compose(withTranslation(), withRouter, connect(mapStateToProps, mapDispatchToProps))(EntityModal);
