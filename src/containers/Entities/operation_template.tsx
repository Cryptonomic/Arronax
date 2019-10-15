import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';

import { formatValueForDisplay } from '../../utils/render';
import { ArronaxIcon } from '../../components/ArronaxIcon';
import Loader from '../../components/Loader';

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 77px 0;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  outline: none;
  position: relative;
  padding: 27px 30px 30px 30px;
  margin: 0 auto;
  width: 798px;
  min-height: 100%;
`;

const ListContainer = styled.div`
  width: 100%;
`;

const CloseIcon = styled(ArronaxIcon)`
  cursor: pointer;
  position: absolute;
  top: 30px;
  right: 30px;
`;

const ModalTitle = styled.div`
  padding: 0 0 19px 0;
  font-size: 24px;
  line-height: 28px;
  font-weight: 400;
  color: #9b9b9b;
  display: flex;
  align-items: center;
`;

const RowContainer = styled.div`
  display: flex;
  padding: 15px 0;
  font-size: 16px;
  line-height: 19px;
  border-bottom: 1px solid #dcdcdc;
  letter-spacing: 0.23px;
  color: rgb(74, 74, 74);
`;

const TitleTxt = styled.div`
  width: 198px;
  font-weight: 400;
`;

const ContentTxt = styled.span`
display: flex;
align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 15px;
  justify-content: flex-end;
`;

const CloseButton = styled.div`
  color: #56c2d9;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

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
  explicitKeys: string[] = [];

  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  changeCount = (count: number) => { this.setState({count}); }

  onClickModal = (event: any) => { event.stopPropagation(); }

  formatValue = (processedValues: any[], attributes: any[], key: string) => {
    this.explicitKeys.push(key);
    if (processedValues.find(i => i.name === key) === undefined) { return ''; }
    return formatValueForDisplay('platform', 'network', 'operations', processedValues.find(i => i.name === key).value, attributes.filter(a => a.name === key)[0], undefined, undefined);
  }

  render() {
    const { open, items, attributes, isLoading, onClose, title, t } = this.props;
    const { count } = this.state;
    const total = items ? items.length : 0;

    const processedValues = attributes
      .filter(c => total > 0 && items[count][c.name] != null && items[count][c.name] !== undefined)
      .sort((a, b) => {
          if (a.displayOrder === undefined && b.displayOrder === undefined) {
              if(a.displayName < b.displayName) { return -1; }
              if(a.displayName > b.displayName) { return 1; }
          }

          if (a.displayOrder === undefined && b.displayOrder !== undefined){
              return 1;
          }

          if (a.displayOrder !== undefined && b.displayOrder === undefined){
              return -1;
          }

          return a.displayOrder - b.displayOrder;
      }).map(c => {
        return { displayName: c.displayName, value: items[count][c.name], name: c.name, entity: c.entity };
      });

      const kind = processedValues.find(a => a.name === 'kind');
      const opKind = kind !== undefined ? kind.value : 'undefined';
      this.explicitKeys = [];

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

              {(!isLoading && opKind === 'transaction') && (
                <ListContainer>
                  <RowContainer>
                    <TitleTxt>{t('attributes.operations.amount')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'amount')}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.operations.fee')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'fee')}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{this.formatValue(processedValues, attributes, 'kind')}</TitleTxt>
                    <ContentTxt>
                      {this.formatValue(processedValues, attributes, 'source')} {t('components.entityModal.to')} {this.formatValue(processedValues, attributes, 'destination')}
                    </ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.operations.timestamp')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'timestamp')}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.operations.block_hash')}</TitleTxt>
                    <ContentTxt>
                      {this.formatValue(processedValues, attributes, 'block_hash')} at level {this.formatValue(processedValues, attributes, 'block_level')} in cycle {this.formatValue(processedValues, attributes, 'cycle')}
                    </ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.operations.status')}</TitleTxt>
                    <ContentTxt>
                      {this.formatValue(processedValues, attributes, 'status')} {t('components.entityModal.in')} &nbsp; {this.formatValue(processedValues, attributes, 'operation_group_hash')}
                    </ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.operations.consumed_gas')}</TitleTxt>
                    <ContentTxt>
                      {this.formatValue(processedValues, attributes, 'consumed_gas')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'gas_limit')}
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
                </ListContainer>
              )}

              {(!isLoading && opKind === 'endorsement') && (
                <ListContainer>
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

                  {processedValues.filter(i => !(this.explicitKeys.includes(i.name))).map((item, index) => {
                    const { entity, name } = item;
                    return (
                      <RowContainer key={index}>
                        <TitleTxt>{t(`attributes.${entity}.${name}`)}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, name)}</ContentTxt>
                      </RowContainer>
                    );
                  })}
                </ListContainer>
              )}

              {(!isLoading && opKind === 'delegation') && (
                <ListContainer>
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

                  {processedValues.filter(i => !(this.explicitKeys.includes(i.name))).map((item, index) => {
                    const { entity, name } = item;
                    return (
                      <RowContainer key={index}>
                        <TitleTxt>{t(`attributes.${entity}.${name}`)}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, name)}</ContentTxt>
                      </RowContainer>
                    );
                  })}
                </ListContainer>
              )}

               {(!isLoading && opKind === 'origination') && (
                <ListContainer>
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

                  {processedValues.filter(i => !(this.explicitKeys.includes(i.name))).map((item, index) => {
                    const { entity, name } = item;
                    return (
                      <RowContainer key={index}>
                        <TitleTxt>{t(`attributes.${entity}.${name}`)}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, name)}</ContentTxt>
                      </RowContainer>
                    );
                  })}
                </ListContainer>
              )}

              {(!isLoading && opKind === 'reveal') && (
                <ListContainer>
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

                  {processedValues.filter(i => !(this.explicitKeys.includes(i.name))).map((item, index) => {
                    const { entity, name } = item;
                    return (
                      <RowContainer key={index}>
                        <TitleTxt>{t(`attributes.${entity}.${name}`)}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, name)}</ContentTxt>
                      </RowContainer>
                    );
                  })}
                </ListContainer>
              )}
              
              {(!isLoading && !['transaction', 'endorsement', 'delegation', 'origination', 'reveal'].includes(opKind)) && (
                <ListContainer>
                  {processedValues.map((item, index) => {
                    const { value, entity, name } = item;
                    return (
                      <RowContainer key={index}>
                        <TitleTxt>{t(`attributes.${entity}.${name}`)}</TitleTxt>
                        <ContentTxt>{formatValueForDisplay('platform', 'network', entity, value, attributes.filter(a => a.name === name)[0], undefined, undefined)}</ContentTxt>
                      </RowContainer>
                    );
                  })}
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
