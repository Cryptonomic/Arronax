import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Modal from '@material-ui/core/Modal';

import { formatValueForDisplay } from '../../utils/render';
import { getNoEmptyFields } from '../../utils/attributes';
import Loader from '../../components/Loader';

import {
  ScrollContainer, ModalContainer, ListContainer, CloseIcon,
  ModalTitle, RowContainer, TitleTxt, ContentTxt, ButtonContainer,
  CloseButton
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

    const processedValues = total > 0 ? getNoEmptyFields(attributes, items[count]) : [];
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
