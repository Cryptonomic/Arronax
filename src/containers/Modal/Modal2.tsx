import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Modal from '@material-ui/core/Modal';
import { AttributeDefinition, AttrbuteDataType, AttrbuteKeyType } from 'conseiljs';

import { fetchOperationsBlock, fetchContract, runActions } from '../../reducers/modal/thunk';
import { setModalOpen, setModalLoading, cleanModal } from '../../reducers/modal/actions';
import { getLoading, getSelectedConfig, getEntity, getAttributesAll } from '../../reducers/app/selectors';
import { getModal } from '../../reducers/modal/selectors';
import { formatValueForDisplay } from '../../utils/render';
import { getNoEmptyFields } from '../../utils/attributes';
import Loader from '../../components/Loader';
import Table from '../../components/Table';

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

import templates from './templates';
import { getTemplate } from './controller';

class EntityModal extends Component<any, any> {
    schema: any;
    explicitKeys: string[];
    explicitMinorKeys: string[];
    template: any;
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

    formatValue = (explicitKeys: string[], network: any, entity: any, processedValues: any[], attributes: any[], key: string, truncate: boolean = false) => {
        console.log('keys', explicitKeys, attributes[network][entity])
        const {
            onClickPrimaryKey,
            selectedConfig: { platform },
        } = this.props;
        explicitKeys.push(key);
        if (processedValues.find((i) => i.name === key) === undefined) {
            return '';
        }
        return formatValueForDisplay(
            platform,
            network,
            entity,
            processedValues.find((i) => i.name === key).value,
            attributes[network][entity].filter((a: any) => a.name === key)[0],
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
                // value: <>{this.formatValue(values, attributes, item.name, true)}</>,
            }));
    };

    getRestBlockAttrFileds = (values: any, attributes: any) => {
        const { t } = this.props;
        return this.explicitMinorKeys
            .filter((name: string) => values.find((i: any) => i.name === name) !== undefined)
            .map((name: string) => ({
                title: t(`attributes.operations.${name}`),
                // value: <>{this.formatValue(values, attributes, name)}</>,
            }));
    };

    findType = (values: any[]) => {
        const {
            selectedConfig: { platform, network },
            modal: { entity },
        } = this.props;
        const { tab, tabActive } = this.state;

        if (tabActive && tab) {
            return `${platform}/${network}/${tab}`;
        }
        if (entity === 'accounts' && values.find((v: any) => v.name === 'is_baker')?.value) {
            return `${platform}${network}/baker`;
        }
        if (entity === 'accounts' && values.find((v: any) => v.name === 'account_id')?.value.startsWith('KT1')) {
            return `${platform}/${network}/contract`;
        }

        return `${platform}/${network}/${entity}`;
    };

    getSchema = () => {
        const {
            attributes,
            selectedConfig: { platform, network },
            modal,
            match: {
                params: { id },
            },
            t,
        } = this.props;
        const { items, entity, modules } = modal;
        const { count } = this.state;
        const values = getNoEmptyFields(attributes[network][entity], items[entity][count]);
        console.log('VALUES', values);
        const type = this.findType(values);
        const defaultProps = { values, attributes: attributes[network][entity], id, formatValue: this.formatValue, t };

        this.explicitKeys = []; //reset keys
        this.explicitMinorKeys = []; //reset keys

        switch (type) {
            case 'tezos/mainnet/blocks':
            case 'tezos/carthagenet/blocks': {
                const props = { modules, id, fetchData: this.fetchData, onClickItem: this.onClickItem, getRestListAttrFields: this.getRestListAttrFields };
                return templates[platform][network].blockTemplate({ ...defaultProps, ...props });
            }
            case 'tezos/mainnet/accounts':
            case 'tezos/carthagenet/accounts': {
                return templates[platform][network].accountTemplate(defaultProps);
            }
            case 'tezos/mainnet/baker':
            case 'tezos/carthagenet/baker': {
                return templates[platform][network].bakerTemplate(defaultProps);
            }
            case 'tezos/mainnet/contract':
            case 'tezos/carthagenet/contract': {
                const props = {
                    modules,
                    id,
                    explicitKeys: this.explicitKeys,
                    fetchData: this.fetchData,
                    getRestListAttrFields: this.getRestListAttrFields,
                    formatSpecificValue: this.formatSpecificValue,
                };
                return templates[platform][network].contractTemplate({ ...defaultProps, ...props });
            }
            case 'tezos/mainnet/operations':
            case 'tezos/carthagenet/operations': {
                const props = {
                    modal,
                    id,
                    count,
                    explicitKeys: this.explicitKeys,
                    explicitMinorKeys: this.explicitMinorKeys,
                    changeCount: this.changeCount,
                    getRestListAttrFields: this.getRestListAttrFields,
                    getRestBlockAttrFileds: this.getRestBlockAttrFileds,
                };
                return templates[platform][network].operationTemplate({ ...defaultProps, ...props });
            }
            case 'tezos/mainnet/block_operations':
            case 'tezos/carthagenet/block_operations': {
                const props = { modules, attributes: attributes[network]['operations'], network };
                return templates[platform][network].blockOperationsTemplate({ ...defaultProps, ...props });
            }
            default: {
                const props = { getRestListAttrFields: this.getRestListAttrFields };
                return templates[platform][network].defautTemplate({ ...defaultProps, ...props });
            }
        }
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
        console.log('this.props', this.props.dispatch)
        const { match: { params: { id } }, modal, attributes, t, doModalLoading, onClickPrimaryKey, doDispatch, doRunActions } = this.props;
        const { list } = modal
        const item = list.find((item: any) => item.id === id);

        if (!item) {
            //TODO: load item id
        };


        console.log('didMount', id, list.find((item: any) => item.id === id));
        const { platform, network, entity, items } = item;

        const [getComponent, getActions] = getTemplate(platform, network, entity, items[0], id, attributes)({ t, formatValue: this.formatValue });
        // this.template = template;
        // doModalLoading(false);
        const actions = getActions();
        // const act = actions.length && actions.map((action: any) => doDispatch(action()));
        // doRunActions(act);
        // console.log('finish', act)
        // this.Template = this.renderHandler(Template, { t });
        // console.log('template', this.renderHandler(Template, { t }));

        // const { doRunActions, doModalLoading } = this.props;
        // this.schema = this.getSchema();
        // const { actions } = this.schema;

        // console.log('didMount_actions', actions);
        // if (actions && actions.length) {
        //     doRunActions(actions);
        //     return;
        // }
        // doModalLoading(false);
    }

    componentDidUpdate(prevProps: any) {
        // const { id: previousId } = prevProps.modal;
        // const {
        //     modal: { id: currentId },
        //     doRunActions,
        //     doModalLoading,
        // } = this.props;
        // const { tab, tabActive } = this.state;
        // const { actions } = this.schema;
        // if (previousId !== currentId) {
        //     // close tab when modal content changed
        //     if (tab && tabActive) {
        //         this.onCloseTab();
        //     }

        //     if (actions && actions.length) {
        //         doRunActions(actions);
        //         return;
        //     }
        //     doModalLoading(false);
        // }
    }

    render() {
        const {
            modal: { open, isModalLoading },
            t,
        } = this.props;
        // const [template] = this.template;
        // const { tab, tabActive } = this.state;
        // let title = null;
        // let list = null;
        // let block = null;

        // if (this.schema) {
        //     title = this.schema?.title || '';
        //     list = this.schema?.items?.list?.length ? this.schema.items.list : [];
        //     block = this.schema?.items?.block?.length ? this.schema.items.block : [];
        // }

        // const isReady = title.length > 0 && this.schema?.items?.list?.length > 0;
        // console.log(isReady, this.schema);

        return (
            <Modal open={open} disableEnforceFocus>
                <ScrollContainer>
                    <ModalContainer>
                        <CloseIcon onClick={this.onCloseModal} size="19px" top="30px" right="30px" color="#9b9b9b" iconName="icon-close" />
                        {/* <TitleWrapper>
                            {!isModalLoading && isReady && (
                                <ModalTitle>
                                    {!tabActive && title}
                                    {tabActive && (
                                        <>
                                            <Button onClick={this.onCloseTab}>{title}</Button>/{t(`attributes.blocks.${tab}`)}
                                        </>
                                    )}
                                </ModalTitle>
                            )}
                        </TitleWrapper> */}
                        {this.template}
                        {/* {isModalLoading && !isReady && <Loader />} */}

                        {/* {!isModalLoading && isReady && !tabActive && (
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
                        )} */}

                        {/* {!isModalLoading && isReady && tabActive && (
                            <>
                                <Table cols={this.schema.cols} items={this.schema.items} />
                            </>
                        )} */}
                    </ModalContainer>
                </ScrollContainer>
            </Modal>
        );
    }
}

const mapStateToProps = (state: any) => ({
    isLoading: getLoading(state),
    selectedConfig: getSelectedConfig(state),
    attributes: getAttributesAll(state),
    modal: getModal(state),
});

const mapDispatchToProps = (dispatch: any) => ({
    getBlockOperations: (name: string, values: any) => dispatch(fetchOperationsBlock(name, values)),
    getContract: (name: string, values: any) => dispatch(fetchContract(name, values)),
    doModalOpen: (value: boolean) => dispatch(setModalOpen(value)),
    doModalLoading: (value: boolean) => dispatch(setModalLoading(value)),
    doRunActions: (actions: any) => dispatch(runActions(actions)),
    doCleanModal: () => dispatch(cleanModal())
});

export const DynamicModal: any = compose(withTranslation(), withRouter, connect(mapStateToProps, mapDispatchToProps))(EntityModal);
