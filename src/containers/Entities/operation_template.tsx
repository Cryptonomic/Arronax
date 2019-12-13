import React, { Fragment } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';

import { formatValueForDisplay } from '../../utils/render';
import { getNoEmptyFields } from '../../utils/attributes';
import { ArronaxIcon } from '../../components/ArronaxIcon';
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
}

type Props = OwnProps & WithTranslation;

class EntityModal extends React.Component<Props, States> {
  explicitKeys: string[];
  explicitMinorKeys: string[] = [];

  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  changeCount = (count: number) => { this.setState({count}); }

  onClickModal = (event: any) => { event.stopPropagation(); }

  formatValue = (processedValues: any[], attributes: any[], key: string, truncate: boolean = false) => {
    this.explicitKeys.push(key);
    if (processedValues.find(i => i.name === key) === undefined) { return ''; }
    return formatValueForDisplay('platform', 'network', 'operations', processedValues.find(i => i.name === key).value, attributes.filter(a => a.name === key)[0], undefined, undefined, truncate);
  }

  render() {
    const { open, items, attributes, isLoading, onClose, title, t } = this.props;
    const { count } = this.state;
    const total = items ? items.length : 0;

    const processedValues = total > 0 ? getNoEmptyFields(attributes, items[count]) : [];

    const kind = processedValues.find(a => a.name === 'kind');
    const opKind = kind !== undefined ? kind.value : 'undefined';

    if (opKind === 'transaction' && processedValues.find(i => i.name === 'parameters') !== undefined) {
        this.explicitMinorKeys = ['counter', 'internal', 'storage_limit', 'storage_size'];
        this.explicitKeys = [...this.explicitMinorKeys];
    } else if (opKind === 'transaction' && processedValues.find(i => i.name === 'parameters') === undefined) {
        this.explicitMinorKeys = ['counter', 'internal', 'gas_limit', 'consumed_gas', 'storage_limit', 'storage_size'];
        this.explicitKeys = [...this.explicitMinorKeys];
    } else {
        this.explicitMinorKeys = ['counter', 'internal', 'gas_limit', 'consumed_gas', 'storage_limit', 'storage_size'];
        this.explicitKeys = [...this.explicitMinorKeys];
    }

    return (
      <Modal open={open}>
        <ScrollContainer onClick={onClose}>
          <ModalContainer onClick={(event) => this.onClickModal(event)}>
            <CloseIcon onClick={onClose} size="19px" color="#9b9b9b" iconName="icon-close" />
              <ModalTitle>
                {t('components.entityModal.details', {title})}
                {total > 1 && (
                <span>
                    <IconButton aria-label="previous" disabled={count === 0} onClick={() => this.changeCount(count - 1)}>
                        <ArronaxIcon iconName="icon-previous" size="16px" color={count !== 0 ? '#65C8CE' : '#D3D3D3'} />
                    </IconButton>
                    {count + 1} {t('components.entityModal.of')} {total}
                    <IconButton aria-label="next" disabled={count === total - 1} onClick={() => this.changeCount(count + 1)}>
                        <ArronaxIcon iconName="icon-next" size="16px" color={count !== total - 1 ? '#65C8CE' : '#D3D3D3'} />
                    </IconButton>
                </span>
                )}
              </ModalTitle>

              {isLoading && <Loader />}
              {!isLoading && (
                <ListContainer>
                  {(opKind === 'transaction' && processedValues.find(i => i.name === 'parameters') === undefined) && ( // transfer
                    <Fragment>
                      <RowContainer>
                        <TitleTxt>{this.formatValue(processedValues, attributes, 'kind')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'source', true)} &nbsp;&#x27A1;&nbsp; {this.formatValue(processedValues, attributes, 'destination', true)}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.amount')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'amount')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.fee')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'fee')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{this.formatValue(processedValues, attributes, 'status')}</TitleTxt>
                        <ContentTxt>
                          {t('components.entityModal.operation.at_level', { level: this.formatValue(processedValues, attributes, 'block_level') })} {t('components.entityModal.operation.in_cycle', { cycle: this.formatValue(processedValues, attributes, 'cycle') })}: &nbsp; {this.formatValue(processedValues, attributes, 'block_hash', true)}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.timestamp')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'timestamp')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.operation_group_hash')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'operation_group_hash')}</ContentTxt>
                      </RowContainer>
                    </Fragment>
                  )}
                  {(opKind === 'transaction' && processedValues.find(i => i.name === 'parameters') !== undefined) && ( // invocation
                    <Fragment>
                      <RowContainer>
                        <TitleTxt>{this.formatValue(processedValues, attributes, 'kind')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'source', true)} &nbsp;&#x27A1;&nbsp; {this.formatValue(processedValues, attributes, 'destination', true)}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.parameters')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'parameters')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.amount')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'amount')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.fee')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'fee')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{this.formatValue(processedValues, attributes, 'status')}</TitleTxt>
                        <ContentTxt>
                          {t('components.entityModal.operation.at_level', { level: this.formatValue(processedValues, attributes, 'block_level') })} {t('components.entityModal.operation.in_cycle', { cycle: this.formatValue(processedValues, attributes, 'cycle') })}: &nbsp; {this.formatValue(processedValues, attributes, 'block_hash', true)}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.timestamp')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'timestamp')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.consumed_gas')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'consumed_gas')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'gas_limit')}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.operation_group_hash')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'operation_group_hash')}</ContentTxt>
                      </RowContainer>
                    </Fragment>
                  )}
                  {opKind === 'endorsement' && (
                    <Fragment>
                      <RowContainer>
                        <TitleTxt>{this.formatValue(processedValues, attributes, 'kind')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'branch')} {t('components.entityModal.at')} {this.formatValue(processedValues, attributes, 'level')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.delegate')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'delegate')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.slots')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'number_of_slots')}: {this.formatValue(processedValues, attributes, 'slots')}</ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.timestamp')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'timestamp')} {t('components.entityModal.in')} {this.formatValue(processedValues, attributes, 'block_hash')} {t('components.entityModal.at')} {this.formatValue(processedValues, attributes, 'block_level')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'cycle')}
                        </ContentTxt>
                      </RowContainer>
                    </Fragment>
                  )}
                  {opKind === 'delegation' && (
                    <Fragment>
                      <RowContainer>
                        <TitleTxt>{this.formatValue(processedValues, attributes, 'kind')}</TitleTxt>
                        {(processedValues.find(i => i.name === 'delegate') === undefined) && (
                          <ContentTxt>{this.formatValue(processedValues, attributes, 'source')} {t('components.entityModal.to')} {t('components.entityModal.clear')}</ContentTxt>
                        )}

                        {(processedValues.find(i => i.name === 'delegate') !== undefined) && (
                          <ContentTxt>{this.formatValue(processedValues, attributes, 'source')} {t('components.entityModal.to')} {this.formatValue(processedValues, attributes, 'delegate')}</ContentTxt>
                        )}
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.timestamp')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'timestamp')} {t('components.entityModal.in')} {this.formatValue(processedValues, attributes, 'block_hash')} {t('components.entityModal.at')} {this.formatValue(processedValues, attributes, 'block_level')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'cycle')}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.status')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'status')} {t('components.entityModal.in')} {this.formatValue(processedValues, attributes, 'operation_group_hash')}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.consumed_gas')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'consumed_gas')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'gas_limit')}
                        </ContentTxt>
                      </RowContainer>
                    </Fragment>
                  )}
                  {opKind === 'origination' && (
                    <Fragment>
                      <RowContainer>
                        <TitleTxt>{this.formatValue(processedValues, attributes, 'kind')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'originated_contracts')} {t('components.entityModal.by')} {this.formatValue(processedValues, attributes, 'source')}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.timestamp')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'timestamp')} {t('components.entityModal.in')} {this.formatValue(processedValues, attributes, 'block_hash')} {t('components.entityModal.at')} {this.formatValue(processedValues, attributes, 'block_level')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'cycle')}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.status')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'status')} {t('components.entityModal.in')} {this.formatValue(processedValues, attributes, 'operation_group_hash')}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.consumed_gas')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'consumed_gas')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'gas_limit')}
                        </ContentTxt>
                      </RowContainer>
                    </Fragment>
                  )}
                  {opKind === 'reveal' && (
                    <Fragment>
                      <RowContainer>
                        <TitleTxt>{this.formatValue(processedValues, attributes, 'kind')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'public_key')} {t('components.entityModal.by')} {this.formatValue(processedValues, attributes, 'source')}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.timestamp')}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, 'timestamp')} &nbsp; {t('components.entityModal.in')} &nbsp; {this.formatValue(processedValues, attributes, 'block_hash')} {t('components.entityModal.at')} {this.formatValue(processedValues, attributes, 'block_level')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'cycle')}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.status')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'status')} &nbsp; {t('components.entityModal.in')} {this.formatValue(processedValues, attributes, 'operation_group_hash')}
                        </ContentTxt>
                      </RowContainer>

                      <RowContainer>
                        <TitleTxt>{t('attributes.operations.consumed_gas')}</TitleTxt>
                        <ContentTxt>
                          {this.formatValue(processedValues, attributes, 'consumed_gas')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'gas_limit')}
                        </ContentTxt>
                      </RowContainer>
                    </Fragment>
                  )}

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
                        <BottomColTitle>{t(`attributes.operations.${name}`)}</BottomColTitle>
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
