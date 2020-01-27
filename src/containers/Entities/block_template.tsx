import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Modal from '@material-ui/core/Modal';

import { formatValueForDisplay, formatValueWithLink } from '../../utils/render';
import { getNoEmptyFields } from '../../utils/attributes';
import Loader from '../../components/Loader';

import Table from '../../components/Table';

import styled from 'styled-components';

import {
  ScrollContainer, ModalContainer, ListContainer, CloseIcon,
  ModalTitle, RowContainer, TitleTxt, ContentTxt, ButtonContainer,
  CloseButton, BottomRowContainer, BottomCol, BottomColTitle, BottomColContent
} from './style';

type OwnProps = {
  open: boolean;
  items: any[];
  subItems: any[];
  attributes: any[];
  opsAttributes: any[];
  isLoading: boolean;
  title: string;
  onClickPrimaryKey: () => void;
  onClose: () => void;
};

interface States {
  count: number;
  subItemsView: boolean;
}

type Props = OwnProps & WithTranslation;

const Button = styled.div`
  color: #56c2d9;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

class EntityModal extends React.Component<Props, States> {
  explicitKeys: string[] = [];
  explicitMinorKeys: string[] = []//['fitness', 'signature', 'chain_id', 'operations_hash', 'nonce_hash'];

  constructor(props) {
    super(props);
    this.state = { count: 0, subItemsView: false };
  }

  changeCount = (count: number) => { this.setState({count}); }

  onClickModal = (event: any) => { event.stopPropagation(); }

  formatValue = (processedValues: any[], attributes: any[], key: string, truncate: boolean = false) => {
    this.explicitKeys.push(key);
    if (processedValues.find(i => i.name === key) === undefined) { return ''; }
    return formatValueForDisplay('platform', 'network', 'blocks', processedValues.find(i => i.name === key).value, attributes.filter(a => a.name === key)[0], undefined, undefined, truncate);
  }

  opsColsName = (cols: string[]) => {
    const { t } = this.props;
    return cols.map(col => {
      return {
        name: col,
        displayName: t(`attributes.operations.${col}`)
      }
    })
  }
  
  opsItems = (cols: { name: string }[]) => {
    const { subItems, opsAttributes } = this.props;
    return subItems.map(item => {
      const newItem = { ...item };
      const opsValues = getNoEmptyFields(opsAttributes, item);
      cols.map((col: { name: string }) => {
        if (col.name === 'kind') return newItem[col.name] = newItem[col.name].slice(0, 1).toLocaleUpperCase().concat(newItem[col.name].slice(1))
        return newItem[col.name] = this.formatValue(opsValues, opsAttributes, col.name, true);
      })
      return newItem;
    })
  }

  onClickSubItem = () => {
    this.setState({
      subItemsView: true
    })
  }

  onBackToDetails = () => {
    this.setState({
      subItemsView: false
    })
  }

  render() {
    const { open, items, subItems, attributes, isLoading, onClose, title, t } = this.props;
    const { count, subItemsView } = this.state;
    const total = items ? items.length : 0;
    const processedValues = total > 0 ? getNoEmptyFields(attributes, items[count]) : [];
    this.explicitKeys = [...this.explicitMinorKeys];

    const subItem = !isLoading && subItems.length && formatValueWithLink({ 
      value: subItems.length,
      onClick: this.onClickSubItem
    });
    const cols = !isLoading && subItemsView && this.opsColsName(['kind', 'amount', 'fee', 'operation_group_hash']);
    const opsItems = !isLoading && subItemsView && this.opsItems(cols);

    return (
      <Modal open={open} disableEnforceFocus>
        <ScrollContainer onClick={onClose}>
          <ModalContainer onClick={(event) => this.onClickModal(event)}>
            <CloseIcon onClick={onClose} size="19px" color="#9b9b9b" iconName="icon-close" />
              <ModalTitle>
                {(processedValues.find(i => i.name === 'script') === undefined) && (
                  !isLoading && subItemsView ?
                    <Button onClick={this.onBackToDetails}>{t('components.entityModal.details', {title})}</Button> : 
                    t('components.entityModal.details', {title})
                )}
                {' '}
                {!isLoading && subItemsView && '/Operations'}
              </ModalTitle>

              {isLoading && <Loader />}

              {!isLoading && !subItemsView && (
                <ListContainer>
                  <RowContainer>
                    <TitleTxt>{t('attributes.blocks.hash')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'hash', true)}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.blocks.level')}</TitleTxt>
                  <ContentTxt>{this.formatValue(processedValues, attributes, 'level')} {t('components.entityModal.of')} {t('attributes.blocks.meta_cycle').toLowerCase()} {this.formatValue(processedValues, attributes, 'meta_cycle')} {t('components.entityModal.in')} {t('attributes.blocks.meta_voting_period').toLowerCase()} {this.formatValue(processedValues, attributes, 'meta_voting_period')}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.blocks.baker')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'baker')} {t('components.entityModal.of')} {t('attributes.blocks.priority').toLowerCase()} {this.formatValue(processedValues, attributes, 'priority')}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.blocks.protocol')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'proto')}: {this.formatValue(processedValues, attributes, 'protocol', true)}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('general.nouns.period')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'period_kind')}</ContentTxt>
                  </RowContainer>

                  {processedValues.filter(i => !(this.explicitKeys.includes(i.name))).map((item, index) => {
                    const { entity, name } = item;
                    return (
                      <RowContainer key={index}>
                        <TitleTxt>{t(`attributes.${entity}.${name}`)}</TitleTxt>
                        <ContentTxt>{this.formatValue(processedValues, attributes, name, true)}</ContentTxt>
                      </RowContainer>
                    );
                  })}
                  {this.explicitMinorKeys.length ? (
                    <BottomRowContainer>
                    {this.explicitMinorKeys.filter(name => processedValues.find(i => i.name === name) !== undefined).map(name => (
                      <BottomCol key={name}>
                        <BottomColTitle>{t(`attributes.blocks.${name}`)}</BottomColTitle>
                        <BottomColContent>{this.formatValue(processedValues, attributes, name, true)}</BottomColContent>
                      </BottomCol>
                    ))}
                  </BottomRowContainer>
                  ) : null}
                  {!isLoading && subItems.length ? (
                    <BottomRowContainer>
                      <BottomCol>
                        <BottomColTitle>Block Operations</BottomColTitle>
                        <BottomColContent>{subItem}</BottomColContent>
                      </BottomCol>
                    </BottomRowContainer>
                  ) : null}
                </ListContainer>
              )}
              {!isLoading && subItemsView &&
                <Table
                  cols={cols}
                  items={opsItems}
                />
              }
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
