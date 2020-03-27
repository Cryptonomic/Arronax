import React, { Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import Modal from '@material-ui/core/Modal';
import { AttributeDefinition, AttrbuteDataType, AttrbuteKeyType } from 'conseiljs';

import { formatValueForDisplay, identifyContract } from '../../utils/render';
import { getNoEmptyFields } from '../../utils/attributes';
import Loader from '../../components/Loader';

import {
  ScrollContainer, ModalContainer, ListContainer, CloseIcon,
  ModalTitle, RowContainer, TitleTxt, ContentTxt, ButtonContainer,
  CloseButton, BottomRowContainer, BottomCol, BottomColTitle, BottomColContent, MultiLineContainer, MultiLineItem
} from './style';

import { DefaultProps, DefaultState } from './types';

export interface AccountModalState extends DefaultState {
    contractInfo: any;
}

class EntityModal extends React.Component<DefaultProps, AccountModalState> {
  explicitKeys: string[] = [];
  explicitMinorKeys: string[] = [];

  constructor(props: any) {
    super(props);
    this.state = { count: 0, contractInfo: {} };
  }

    componentDidMount = async () => {
        const { items, attributes } = this.props;
        const { count } = this.state;
        const total = items ? items.length : 0;
        const processedValues: any = total > 0 ? getNoEmptyFields(attributes, items[count]) : [];
        let isBaker = false;
        let isContract = false;

        if (processedValues.length === 0) { return; }

        const address = processedValues.find((a: any) => a.name === 'account_id').value as string;

        try {
            isBaker = processedValues.find((a: any) => a.name === 'is_baker').value === true;
        } catch { }

        try {
            isContract = address.startsWith('KT1');
        } catch { }

        if (isContract) {
            try {
                const contractInfo = await identifyContract(address, this.props.selectedConfig, processedValues.find((a: any) => a.name === 'script').value as string);
                this.setState({ contractInfo: { type: contractInfo.type, entryPoints: contractInfo.entryPoints, metadata: contractInfo.metadata} });
            } catch { }
        }
    }

  changeCount = (count: number) => { this.setState({count}); }

  onClickModal = (event: any) => { event.stopPropagation(); }

  formatValue = (processedValues: any[], attributes: any[], key: string, truncate: boolean = false) => {
    const { onClickPrimaryKey, selectedConfig: { platform, network } } = this.props;
    this.explicitKeys.push(key);
    if (processedValues.find(i => i.name === key) === undefined) { return ''; }
    return formatValueForDisplay(platform, network, 'accounts', processedValues.find(i => i.name === key).value, attributes.filter(a => a.name === key)[0], onClickPrimaryKey, undefined, truncate);
  }

  formatSpecificValue = (value: string, dataType: AttrbuteDataType, truncate: boolean = false) => {
    if (!value) { return ''; }

    const { onClickPrimaryKey, selectedConfig: { platform, network } } = this.props;

    const attribute: AttributeDefinition = { name: '', displayName: '', dataType: dataType, cardinality: 1, keyType: AttrbuteKeyType.NONKEY, entity: '', dataFormat: '', visible: true }

    return formatValueForDisplay(platform, network, 'accounts', value, attribute, onClickPrimaryKey, undefined, truncate);
  }

render() {
    const { open, items, attributes, isLoading, onClose, title, t } = this.props;
    const { count, contractInfo: { type, entryPoints, metadata } } = this.state;
    const total = items ? items.length : 0;
    const processedValues: any = total > 0 ? getNoEmptyFields(attributes, items[count]) : [];
    let isBaker = false;
    let isContract = false;

    try {
        isBaker = processedValues.find((a: any) => a.name === 'is_baker').value === true;
    } catch { }

    try {
        isContract = (processedValues.find((a: any) => a.name === 'account_id').value as string).startsWith('KT1');
    } catch { }

    this.explicitMinorKeys = ['delegate_setable', 'spendable'];
    this.explicitKeys = ['is_baker', ...this.explicitMinorKeys];

    return (
      <Modal open={open} disableEnforceFocus>
        <ScrollContainer onClick={onClose}>
          <ModalContainer onClick={(event) => this.onClickModal(event)}>
            <CloseIcon onClick={onClose} size="19px" color="#9b9b9b" iconName="icon-close" />
              <ModalTitle>
                {!isContract && (
                  t('components.entityModal.details', {title})
                )}

                {isContract && (
                  t('components.entityModal.details', {title: 'Contract'})
                )}
              </ModalTitle>

              {isLoading && <Loader />}

              {!isLoading && (
                <ListContainer>

                {(isBaker) && (
                    <Fragment>
                        <RowContainer>
                            <TitleTxt>{t('components.entityModal.account.baker')}</TitleTxt>
                            <ContentTxt>{this.formatValue(processedValues, attributes, 'account_id')}</ContentTxt>
                        </RowContainer>
                    </Fragment>
                )}

                {(isContract) && (
                    <Fragment>
                        <RowContainer>
                            <TitleTxt>{t('components.entityModal.account.contract')}</TitleTxt>
                            <ContentTxt>{this.formatValue(processedValues, attributes, 'account_id')}</ContentTxt>
                        </RowContainer>
                    </Fragment>
                )}
                {(isContract && this.state.contractInfo.type !== 'Unidentified') && (
                    <Fragment>
                        <RowContainer>
                            <TitleTxt>{t('components.entityModal.account.contractType')}</TitleTxt>
                            <ContentTxt>{this.state.contractInfo.type}</ContentTxt>
                        </RowContainer>
                    </Fragment>
                )}
                {(isContract) && (
                    <Fragment>
                        <RowContainer>
                            <TitleTxt>{t('components.entityModal.account.entryPoints')}</TitleTxt>
                            <MultiLineContainer>
                              {entryPoints?.map((item: any) => <MultiLineItem key={item}>{item}</MultiLineItem>)}
                            </MultiLineContainer>
                        </RowContainer>
                    </Fragment>
                )}

                {(isContract && this.state.contractInfo.metadata?.mapSummary) && (
                    <Fragment>
                        <RowContainer>
                            <TitleTxt>{t('components.entityModal.account.maps')}</TitleTxt>
                            <MultiLineContainer>
                                {this.state.contractInfo.metadata?.mapSummary?.map((item: any) => <MultiLineItem>{item}</MultiLineItem>)}
                            </MultiLineContainer>
                        </RowContainer>
                    </Fragment>
                )}

                {this.state.contractInfo.type?.startsWith('FA1.2') && (
                    <Fragment>
                        <RowContainer>
                            <TitleTxt>{t('components.entityModal.account.tokenAdmin')}</TitleTxt>
                            <ContentTxt>{this.formatSpecificValue(this.state.contractInfo.metadata?.manager, AttrbuteDataType.ACCOUNT_ADDRESS, false)}</ContentTxt>
                        </RowContainer>
                        <RowContainer>
                            <TitleTxt>{t('components.entityModal.account.tokenSvpply')}</TitleTxt>
                            <ContentTxt>{this.formatSpecificValue(this.state.contractInfo.metadata?.supply, AttrbuteDataType.DECIMAL, true)}</ContentTxt>
                        </RowContainer>
                </Fragment>
                )}
                
                {this.state.contractInfo.type === 'Babylon Delegation Contract' && (
                    <Fragment>
                        <RowContainer>
                            <TitleTxt>{t('components.entityModal.account.admin')}</TitleTxt>
                            <ContentTxt>{this.formatSpecificValue(this.state.contractInfo.metadata?.manager, AttrbuteDataType.ACCOUNT_ADDRESS, false)}</ContentTxt>
                        </RowContainer>
                </Fragment>
                )}

                {(!isBaker && !isContract) && (
                    <Fragment>
                        <RowContainer>
                            <TitleTxt>{t('attributes.accounts.account_id')}</TitleTxt>
                            <ContentTxt>{this.formatValue(processedValues, attributes, 'account_id')}</ContentTxt>
                        </RowContainer>
                    </Fragment>
                )}

                  <RowContainer>
                    <TitleTxt>{t('attributes.accounts.balance')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'balance')}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('components.entityModal.account.last_active_title')}</TitleTxt>
                    <ContentTxt>
                        {t('components.entityModal.account.at_level', { level: this.formatValue(processedValues, attributes, 'block_level') })}: &nbsp; {this.formatValue(processedValues, attributes, 'block_id', true)}
                    </ContentTxt>
                  </RowContainer>

                  {processedValues.filter((i: any) => !(this.explicitKeys.includes(i.name))).map((item: any, index: any) => {
                    const { entity, name } = item;
                    return (
                      <RowContainer key={index}>
                        <TitleTxt>{t(`attributes.${entity}.${name}`)}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, name)}</ContentTxt>
                      </RowContainer>
                    );
                  })}

                  <BottomRowContainer>
                    {this.explicitMinorKeys.filter(name => processedValues.find((i: any) => i.name === name) !== undefined).map(name => (
                      <BottomCol key={name}>
                        <BottomColTitle>{t(`attributes.accounts.${name}`)}</BottomColTitle>
                        <BottomColContent>{this.formatValue(processedValues, attributes, name)}</BottomColContent>
                      </BottomCol>
                    ))}
                  </BottomRowContainer>

                </ListContainer>
              )}
              <ButtonContainer>
                <CloseButton onClick={onClose}>
                  {t('general.verbs.close')}
                </CloseButton>
              </ButtonContainer>
          </ModalContainer>
        </ScrollContainer>
      </Modal>
    );
  }
};

export default withTranslation()(EntityModal);
