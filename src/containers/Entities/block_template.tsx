import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';

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

      this.explicitKeys = [];

    return (
      <Modal open={open}>
        <ScrollContainer onClick={onClose}>
          <ModalContainer onClick={(event) => this.onClickModal(event)}>
            <CloseIcon onClick={onClose} size="19px" color="#9b9b9b" iconName="icon-close" />
              <ModalTitle>
                {(processedValues.find(i => i.name === 'script') === undefined) && (
                  t('components.entityModal.details', {title})
                )}
              </ModalTitle>

              {isLoading && <Loader />}

              {!isLoading && (
                <ListContainer>
                  <RowContainer>
                    <TitleTxt>{t('attributes.blocks.hash')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'hash')} {t('components.entityModal.at')} {this.formatValue(processedValues, attributes, 'level')} ({this.formatValue(processedValues, attributes, 'meta_cycle_position')}) {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'meta_cycle')}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.blocks.baker')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'baker')} {t('components.entityModal.of')} {this.formatValue(processedValues, attributes, 'priority')}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('attributes.blocks.protocol')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'proto')}: {this.formatValue(processedValues, attributes, 'protocol')}</ContentTxt>
                  </RowContainer>

                  <RowContainer>
                    <TitleTxt>{t('general.nouns.period')}</TitleTxt>
                    <ContentTxt>{this.formatValue(processedValues, attributes, 'meta_voting_period')}: {this.formatValue(processedValues, attributes, 'period_kind')}, {this.formatValue(processedValues, attributes, 'meta_voting_period_position')} {this.formatValue(processedValues, attributes, 'expected_commitment')} {this.formatValue(processedValues, attributes, 'current_expected_quorum')}</ContentTxt>
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
