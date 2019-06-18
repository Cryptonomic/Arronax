import React from 'react';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import Moment from 'react-moment';
import 'moment-timezone';
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
    const {
      open,
      item,
      attributes,
      isLoading,
      onClose,
      title
    } = this.props;
    return (
      <Modal open={open}>
        <ScrollContainer onClick={onClose}>
          <ModalContainer onClick={(event) => this.onClickModal(event)}>
            <CloseIcon onClick={onClose} size="19px" color="#9b9b9b" iconName="icon-close" />
            <ModalTitle>{title} Details</ModalTitle>
              {!isLoading && (
                <ListContainer>
                  {attributes.filter(c => (item[c.name] != null && item[c.name].length > 0)).map((column, index) => {
                    const { displayName, dataType, dataFormat, name } = column;
                    let value = item[name];
                    if (dataType === 'DateTime' && dataFormat) {
                      value = (
                        <Moment format={dataFormat}>
                          {value}
                        </Moment>
                      );
                    } else if (dataType === 'Decimal' && column.scale && column.scale !== 0) {
                        const n = Number(value);
                        const d = n/Math.pow(10, column.scale);
                        if (n < 10000) {
                            value = d.toFixed(4);
                        } else {
                            value = d.toFixed(2);
                        }
                    } else if (dataType === 'Boolean') {
                        value = value.toString();
                        value = value.charAt(0).toUpperCase() + value.substring(1);
                    }
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
