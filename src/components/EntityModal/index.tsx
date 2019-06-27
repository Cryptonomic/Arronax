import React from 'react';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { ArronaxIcon } from '../ArronaxIcon';

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
  text-transform: capitalize;
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

const ContentTxt = styled.div`
  font-weight: 300;
  word-break: break-word;
  flex: 1;
`;

const LoadingContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
`;

export const ButtonContainer = styled.div`
  display: flex;
  padding: 15px;
  justify-content: flex-end;
`;

export const CloseButton = styled.div`
  color: #56c2d9;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

type Props = {
  open: boolean;
  item: any;
  attributes: any[];
  isLoading: boolean;
  title: string;
  onClose: () => void;
};

class EntityModal extends React.Component<Props, {}> {
  onClickModal = (event: any) => {
    event.stopPropagation();
  }
  render() {
    const { open, item, attributes, isLoading, onClose, title } = this.props;

    const formattedValues = attributes
      .filter(c => item[c.name] != null && item[c.name] !== undefined)
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
      })
      .map(c => {
          let v = {displayName: '', value: undefined};
          v['displayName'] = c.displayName;
          if (c.dataType === 'DateTime' && c.dataFormat) {
              v['value'] = moment(item[c.name]).format(c.dataFormat);
          } else if (c.dataType === 'Decimal' && c.scale && c.scale !== 0) {
            const n = Number(item[c.name]);
            const d = n/Math.pow(10, c.scale);
            let minimumFractionDigits = 0;
            let maximumFractionDigits = 0;
            if (n < 10000) {
                minimumFractionDigits = 6;
                maximumFractionDigits = 6;
            } else if (n < 100000) {
                minimumFractionDigits = 4;
                maximumFractionDigits = 4;
            } else if (n < 1000000) {
                minimumFractionDigits = 2;
                maximumFractionDigits = 2;
            }

            v.value = (new Intl.NumberFormat(window.navigator.languages[0], { style: 'decimal', minimumFractionDigits, maximumFractionDigits })).format(d);
          } else if (c.dataType === 'Boolean') {
              v.value = item[c.name].toString();
              v.value = v.value.charAt(0).toUpperCase() + v.value.substring(1);
          } else {
              v.value = item[c.name].toString();
              if (v.value.length > 0 && c.cardinality && c.cardinality < 20) {
                  v.value = v.value.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
              }
          }

          return v;
      });

    return (
      <Modal open={open}>
        <ScrollContainer onClick={onClose}>
          <ModalContainer onClick={(event) => this.onClickModal(event)}>
            <CloseIcon onClick={onClose} size="19px" color="#9b9b9b" iconName="icon-close" />
            <ModalTitle>{title} Details</ModalTitle>
              {!isLoading && (
                <ListContainer>
                  {formattedValues.map((item, index) => {
                    const { displayName, value } = item;
                    return (
                      <RowContainer key={index}>
                        <TitleTxt>{displayName}</TitleTxt>
                        <ContentTxt>{value}</ContentTxt>
                      </RowContainer>
                    );
                  })}
                  <ButtonContainer>
                    <CloseButton onClick={onClose}>
                      Close
                    </CloseButton>
                  </ButtonContainer>
                </ListContainer>
              )}
              {isLoading && (
                <LoadingContainer>
                  <CircularProgress />
                </LoadingContainer>
              )}
          </ModalContainer>
        </ScrollContainer>
        
      </Modal>
    );
  }
};

export default EntityModal;
