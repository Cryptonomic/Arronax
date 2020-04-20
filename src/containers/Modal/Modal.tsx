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

import { accountTemplate, bakerTemplate, blockTemplate, contractTemplate, operationTemplate, blockOperationsTemplate } from './templates';

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
            modal,
            match: {
                params: { id },
            },
            t,
        } = this.props;
        const { items, entity, modules } = modal;
        const { count } = this.state;
        const values = getNoEmptyFields(attributes[network][entity], items[entity][count]);
        const type = this.findType(values);
        const defaultProps = { values, attributes: attributes[network][entity], id, formatValue: this.formatValue, t };

        this.explicitKeys = []; //reset keys
        this.explicitMinorKeys = []; //reset keys

        switch (type) {
            case 'blocks': {
                const props = { modules, id, fetchData: this.fetchData, onClickItem: this.onClickItem, getRestListAttrFields: this.getRestListAttrFields };
                return blockTemplate({ ...defaultProps, ...props });
            }
            case 'accounts': {
                return accountTemplate(defaultProps);
            }
            case 'baker': {
                return bakerTemplate(defaultProps);
            }
            case 'contract': {
                const props = {
                    modules,
                    id,
                    explicitKeys: this.explicitKeys,
                    fetchData: this.fetchData,
                    getRestListAttrFields: this.getRestListAttrFields,
                    formatSpecificValue: this.formatSpecificValue,
                };
                return contractTemplate({ ...defaultProps, ...props });
            }
            case 'operations': {
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
                return operationTemplate({ ...defaultProps, ...props });
            }
            case 'block_operations': {
                const props = { modules, attributes: attributes[network]['operations'], network };
                return blockOperationsTemplate({ ...defaultProps, ...props });
            }
            default:
                return values;
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

                        {!isModalLoading && tabActive && (
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
