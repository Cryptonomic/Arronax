import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Table from '../../../components/Table'; // rename to ModalTable
import { fetchOperationsBlock } from '../../../reducers/modal/thunk';
import { formatValueForDisplay, identifyContract, formatValueWithLink } from '../../../utils/render';
import { getNoEmptyFields } from '../../../utils/attributes';
import Loader from '../../../components/Loader';

import {
    ScrollContainer,
    ModalContainer,
    ListContainer,
    CloseIcon,
    ModalTitle,
    RowContainer,
    TitleTxt,
    ContentTxt,
    ButtonContainer,
    CloseButton,
    BottomRowContainer,
    BottomCol,
    BottomColTitle,
    BottomColContent,
    MultiLineContainer,
    MultiLineItem,
} from '../style';

class EntityModal extends Component<any, any> {
    schema: any;
    explicitKeys: string[];
    constructor(props: any) {
        super(props);
        this.state = {
            open: true,
            tabs: [],
            activeTab: '',
        };
        this.explicitKeys = [];
        this.schema = {};
    }

    fetchData = (type: string, value: string | number) => {
        switch (type) {
            case 'blockOperations':
                const { getBlockOperations } = this.props;
                getBlockOperations(type, value);
                return;
            default:
                return;
        }
    };

    formatValue = (processedValues: any[], attributes: any[], key: string, truncate: boolean = false) => {
        const {
            onClickPrimaryKey,
            selectedConfig: { platform, network },
        } = this.props;
        this.explicitKeys.push(key);
        if (processedValues.find((i) => i.name === key) === undefined) {
            return '';
        }
        return formatValueForDisplay(
            platform,
            network,
            'accounts',
            processedValues.find((i) => i.name === key).value,
            attributes.filter((a) => a.name === key)[0],
            onClickPrimaryKey,
            undefined,
            truncate
        );
    };

    getSchema = (name: string, id: string | number) => {
        const {
            attributes,
            modal: { items, entity },
        } = this.props;
        let values: {}[] = [];

        this.explicitKeys = []; //reset keys for formatValue

        switch (name) {
            case 'blocks':
                values = getNoEmptyFields(attributes[entity], items[entity][0]);
                return this.getBlock(values, attributes[entity], id);
            case 'baker':
                values = getNoEmptyFields(attributes[entity], items[entity][0]);
                return this.getBaker(values, attributes[entity]);
            case 'contract':
                values = getNoEmptyFields(attributes[entity], items[entity][0]);
                return this.getContract(values, attributes[entity]);
            case 'block_operations':
                return this.getBlockOperations();
            default:
                return values;
        }
    };

    getBaker = (values: any, attributes: any) => {
        const { t } = this.props;
        return {
            title: t('components.entityModal.details', { title: 'Account' }),
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
        //t('components.entityModal.details', { title: 'Block' })
        const block = {
            title: 'blocks',
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
                block: [
                    {
                        title: 'Block Operations',
                        value: (
                            <>
                                {blockOperations?.length > 0 ? (
                                    formatValueWithLink({ value: blockOperations.length, onClick: this.onClickItem })
                                ) : (
                                    <CircularProgress size={15} />
                                )}
                            </>
                        ),
                        action: () => this.fetchData('blockOperations', id),
                    },
                ],
            },
        };

        const restListItems = values
            .filter((v: any) => !this.explicitKeys.includes(v.name))
            .map((item: any) => ({
                title: t(`attributes.${item.entity}.${item.name}`),
                value: <>{this.formatValue(values, attributes, item.name, true)}</>,
            }));

        block.items.list = [...block.items.list, ...restListItems];

        return block;
    };

    getContract = async (values: any, attributes: any) => {
        const { t } = this.props;
        const address = values.find((a: any) => a.name === 'account_id').value as string;
        const isContract = address.startsWith('KT1');
        const contractInfo = await identifyContract(address, this.props.selectedConfig, values.find((a: any) => a.name === 'script').value as string);
        return {
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
                    {
                        title: t(`attributes.accounts.counter`),
                        value: <>{this.formatValue(values, attributes, 'counter')}</>,
                    },
                    {
                        title: t(`attributes.accounts.delegate_value`),
                        value: <>{this.formatValue(values, attributes, 'delegate_value')}</>,
                    },
                ],
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
            } = this.props;
            return blockOperations.map((item: any) => {
                const newItem = { ...item };
                const opsValues = getNoEmptyFields(attributes['operations'], item);
                cols.map((col: { name: string }) => {
                    if (col.name === 'kind') return (newItem[col.name] = newItem[col.name].slice(0, 1).toLocaleUpperCase().concat(newItem[col.name].slice(1)));
                    return (newItem[col.name] = this.formatValue(opsValues, attributes['operations'], col.name, true));
                });
                return newItem;
            });
        };

        const cols = opsColsName(['kind', 'amount', 'fee', 'operation_group_hash', 'source', 'destination', 'parameters']);
        const items = opsItems(cols);
        return {
            title: cols,
            items,
        };
    };

    searchActions = () => {
        const items = [...this.schema.items.list, ...this.schema.items.block];
        items.forEach((item: any) => {
            if (item.action) {
                item.action();
            }
        });
    };

    onClose = () => {
        this.setState({
            open: false,
        });
    };

    onClickItem = () => {
        const tabs = [...this.state.tabs, 'block_operations'];
        this.setState({
            tabs,
            activeTab: 'block_operations',
        });
    };

    onTabChange = (e: any, tabName: any) => {
        this.setState({
            activeTab: tabName,
        });
    };

    onCloseTab = () => {

    };

    componentDidMount() {
        const {
            modal: { entity },
        } = this.props;
        const tabs = [...this.state.tabs, entity];

        this.searchActions();
        this.setState({
            tabs,
            activeTab: entity,
        });
    }

    render() {
        const {
            isLoading,
            match: {
                params: { id },
            },
            modal: { entity },
        } = this.props;
        this.schema = this.getSchema(this.state.activeTab || entity, id);
        const title = this.schema?.title || '';
        const list = this.schema?.items?.list?.length ? this.schema.items.list : [];
        const block = this.schema?.items?.block?.length ? this.schema.items.block : [];
        return (
            <Modal open={this.state.open} disableEnforceFocus>
                <ScrollContainer>
                    <ModalContainer>
                        <CloseIcon onClick={this.onClose} size="19px" top="30px" right="30px" color="#9b9b9b" iconName="icon-close" />
                        <Tabs value={this.state.activeTab} onChange={this.onTabChange}>
                            {this.state.tabs.map((tab: string, index: number) => {
                                return (
                                    <Tab
                                        key={tab}
                                        value={tab}
                                        label={
                                            <>
                                                {tab}
                                                {index > 0 && <CloseIcon onClick={this.onCloseTab} size="9px" top="0px" right="0px" color="#9b9b9b" iconName="icon-close" />}
                                            </>
                                        }
                                        component="div"
                                    />
                                );
                            })}
                        </Tabs>
                        {/* {isLoading && <Loader />} */}

                        {!isLoading && this.state.activeTab !== 'block_operations' && (
                            <>
                                <ListContainer>
                                    {list.map((item: any, index: any) => (
                                        <RowContainer key={item.title}>
                                            <TitleTxt>{item.title}</TitleTxt>
                                            <ContentTxt>{item.value}</ContentTxt>
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

                        {!isLoading && this.state.activeTab === 'block_operations' && (
                            <>
                                <Table cols={this.schema.title} items={this.schema.items} />
                            </>
                        )}
                    </ModalContainer>
                </ScrollContainer>
            </Modal>
        );
    }
}

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: any) => ({
    getBlockOperations: (name: string, value: string | number) => dispatch(fetchOperationsBlock(name, value)),
});

export const DynamicModal: any = compose(withTranslation(), withRouter, connect(mapStateToProps, mapDispatchToProps))(EntityModal);
