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
  onClickPrimaryKey: () => void
};

interface States {
  count: number;
}

type Props = OwnProps & WithTranslation;

class EntityModal extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  changeCount = (count: number) => {
    this.setState({count});
  }

  onClickModal = (event: any) => {
    event.stopPropagation();
  }

  formatValue = (processedValues: any[], attributes: any[], key: string, truncate: boolean = false) => {
    const { onClickPrimaryKey } = this.props;
    if (processedValues.find(i => i.name === key) === undefined) { return ''; }
    return formatValueForDisplay('platform', 'network', 'operations', processedValues.find(i => i.name === key).value, attributes.filter(a => a.name === key)[0], onClickPrimaryKey, undefined, truncate);
  }

  render() {
    const { open, items, attributes, isLoading, onClose, title, t } = this.props;
    const { count } = this.state;
    const total = items ? items.length : 0;
    const processedValues = total > 0 ? getNoEmptyFields(attributes, items[count]) : [];

    return (
      <Modal open={open} disableEnforceFocus>
        <ScrollContainer onClick={onClose}>
          <ModalContainer onClick={(event) => this.onClickModal(event)}>
            <CloseIcon onClick={onClose} size="19px" color="#9b9b9b" iconName="icon-close" />
              <ModalTitle>{t('components.entityModal.details', {title})}</ModalTitle>
              {!isLoading && (
                <ListContainer>
                  {processedValues.map((item, index) => {
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
              {isLoading && <Loader />}

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
