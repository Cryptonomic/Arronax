import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Modal from '@material-ui/core/Modal';

import { formatValueForDisplay } from '../../utils/render';
import Loader from '../../components/Loader';

import {
  ScrollContainer, ModalContainer, ListContainer,
  CloseIcon, ModalTitle, RowContainer, TitleTxt,
  ContentTxt, ButtonContainer, CloseButton
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

  formatValue = (processedValues: any[], attributes: any[], key: string) => {
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

    return (
      <Modal open={open}>
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
