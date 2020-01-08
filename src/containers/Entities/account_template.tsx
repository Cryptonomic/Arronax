import React, { Fragment } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Modal from '@material-ui/core/Modal';

import { ConseilDataClient, ConseilQueryBuilder, ConseilOperator, ConseilFunction, AttrbuteDataType, AttrbuteKeyType } from 'conseiljs';

import { formatValueForDisplay } from '../../utils/render';
import { formatNumber } from '../../utils/general';
import { getNoEmptyFields } from '../../utils/attributes';
import Loader from '../../components/Loader';

import {
  ScrollContainer, ModalContainer, ListContainer, CloseIcon,
  ModalTitle, RowContainer, TitleTxt, ContentTxt, ButtonContainer,
  CloseButton, BottomRowContainer, BottomCol, BottomColTitle, BottomColContent
} from './style';

type OwnProps = {
  open: boolean;
  items: any[];
  attributes: any[];
  isLoading: boolean;
  title: string;
  onClose: () => void;
};

interface States {
  count: number;
  receivedTotal: number;
  sentTotal: number;
}

type Props = OwnProps & WithTranslation;

class EntityModal extends React.Component<Props, States> {
  explicitKeys: string[] = [];
  explicitMinorKeys: string[] = [];

  constructor(props) {
    super(props);
    this.state = { count: 0, receivedTotal: 0, sentTotal: 0 };
  }

  changeCount = (count: number) => { this.setState({count}); }

  onClickModal = (event: any) => { event.stopPropagation(); }

  formatValue = (processedValues: any[], attributes: any[], key: string, truncate: boolean = false) => {
    this.explicitKeys.push(key);
    if (processedValues.find(i => i.name === key) === undefined) { return ''; }
    return formatValueForDisplay('platform', 'network', 'operations', processedValues.find(i => i.name === key).value, attributes.filter(a => a.name === key)[0], undefined, undefined, truncate);
  }

  async componentDidMount() {
    const { platform, network, url, apiKey } = this.props['selectedConfig'];
    const { items, attributes } = this.props;
    const { count } = this.state;
    const total = items ? items.length : 0;
    const processedValues = total > 0 ? getNoEmptyFields(attributes, items[count]) : [];

    try { // TODO: move
        const address = processedValues.find(a => a.name === 'account_id').value;
        let q = ConseilQueryBuilder.blankQuery();
        q = ConseilQueryBuilder.setLimit(q, 1);
        q = ConseilQueryBuilder.addFields(q, 'amount');
        q = ConseilQueryBuilder.addPredicate(q, 'destination', ConseilOperator.EQ, [address]);
        q = ConseilQueryBuilder.addPredicate(q, 'kind', ConseilOperator.EQ, ['transaction']);
        q = ConseilQueryBuilder.addPredicate(q, 'status', ConseilOperator.EQ, ['applied']);
        q = ConseilQueryBuilder.addAggregationFunction(q, 'amount', ConseilFunction.sum);

        const r = await ConseilDataClient.executeEntityQuery({ url, apiKey, network }, platform, network, 'operations', q);
        this.setState({ receivedTotal: Number(r[0]['sum_amount'] || '0') });
    } catch { }

    try { // TODO: move
        const address = processedValues.find(a => a.name === 'account_id').value;
        let q = ConseilQueryBuilder.blankQuery();
        q = ConseilQueryBuilder.setLimit(q, 1);
        q = ConseilQueryBuilder.addFields(q, 'amount');
        q = ConseilQueryBuilder.addPredicate(q, 'source', ConseilOperator.EQ, [address]);
        q = ConseilQueryBuilder.addPredicate(q, 'kind', ConseilOperator.EQ, ['transaction']);
        q = ConseilQueryBuilder.addPredicate(q, 'status', ConseilOperator.EQ, ['applied']);
        q = ConseilQueryBuilder.addAggregationFunction(q, 'amount', ConseilFunction.sum);

        const r = await ConseilDataClient.executeEntityQuery({ url, apiKey, network }, platform, network, 'operations', q);
        this.setState({ sentTotal: Number(r[0]['sum_amount'] || '0') });
    } catch { }
  }

render() {
    const { open, items, attributes, isLoading, onClose, title, t } = this.props;
    const { count } = this.state;
    const total = items ? items.length : 0;
    const processedValues = total > 0 ? getNoEmptyFields(attributes, items[count]) : [];
    let isBaker = false;
    try { // TODO: move
        isBaker = processedValues.find(a => a.name === 'is_baker').value == true;
        // TODO: query delegates
    } catch { }

    this.explicitMinorKeys = ['delegate_setable', 'spendable'];
    this.explicitKeys = ['is_baker', ...this.explicitMinorKeys];

    return (
      <Modal open={open}>
        <ScrollContainer onClick={onClose}>
          <ModalContainer onClick={(event) => this.onClickModal(event)}>
            <CloseIcon onClick={onClose} size="19px" color="#9b9b9b" iconName="icon-close" />
              <ModalTitle>
                {(processedValues.find(i => i.name === 'script') === undefined) && (
                  t('components.entityModal.details', {title})
                )}

                {(processedValues.find(i => i.name === 'script') !== undefined) && (
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

                        <RowContainer>
                            <TitleTxt>{t('attributes.accounts.balance')}</TitleTxt>
                            <ContentTxt>{this.formatValue(processedValues, attributes, 'balance')}</ContentTxt>
                        </RowContainer>
                    </Fragment>
                )}

                {!isBaker && (
                    <Fragment>
                        <RowContainer>
                            <TitleTxt>{t('attributes.accounts.account_id')}</TitleTxt>
                            <ContentTxt>{this.formatValue(processedValues, attributes, 'account_id')}</ContentTxt>
                        </RowContainer>

                        <RowContainer>
                            <TitleTxt>{t('attributes.accounts.balance')}</TitleTxt>
                            <ContentTxt>{this.formatValue(processedValues, attributes, 'balance')}</ContentTxt>
                        </RowContainer>
                    </Fragment>
                )}

                  <RowContainer>
                    <TitleTxt>{t('components.entityModal.account.last_active_title')}</TitleTxt>
                    <ContentTxt>
                        {t('components.entityModal.account.at_level', { level: this.formatValue(processedValues, attributes, 'block_level') })}: &nbsp; {this.formatValue(processedValues, attributes, 'block_id', true)}
                    </ContentTxt>
                  </RowContainer>

                  {processedValues.filter(i => !(this.explicitKeys.includes(i.name))).map((item, index) => {
                    const { entity, name } = item;
                    return (
                      <RowContainer key={index}>
                        <TitleTxt>{t(`attributes.${entity}.${name}`)}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, name)}</ContentTxt>
                      </RowContainer>
                    );
                  })}

                  <BottomRowContainer>
                    {this.explicitMinorKeys.filter(name => processedValues.find(i => i.name === name) !== undefined).map(name => (
                      <BottomCol key={name}>
                        <BottomColTitle>{t(`attributes.accounts.${name}`)}</BottomColTitle>
                        <BottomColContent>{this.formatValue(processedValues, attributes, name)}</BottomColContent>
                      </BottomCol>
                    ))}

                    <BottomCol>
                      <BottomColTitle>Total Received</BottomColTitle>
                      <BottomColContent>{formatNumber(this.state.receivedTotal, { name: '', displayName: '', dataType: AttrbuteDataType.CURRENCY, cardinality: 0, keyType: AttrbuteKeyType.NONKEY, entity: '', dataFormat: '', visible: true, scale: 6})}</BottomColContent>
                    </BottomCol>

                    <BottomCol>
                      <BottomColTitle>Total Sent</BottomColTitle>
                      <BottomColContent>{formatNumber(this.state.sentTotal, { name: '', displayName: '', dataType: AttrbuteDataType.CURRENCY, cardinality: 0, keyType: AttrbuteKeyType.NONKEY, entity: '', dataFormat: '', visible: true, scale: 6})}</BottomColContent>
                    </BottomCol>
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
