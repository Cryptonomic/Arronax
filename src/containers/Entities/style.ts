import styled from 'styled-components';
import { ArronaxIcon } from '../../components/ArronaxIcon';

export const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 77px 0;
`;

export const ModalContainer = styled.div`
  background-color: #ffffff;
  outline: none;
  position: relative;
  padding: 27px 30px 30px 30px;
  margin: 0 auto;
  width: 798px;
  min-height: 100%;
`;

export const ListContainer = styled.div`
  width: 100%;
`;

export const CloseIcon = styled(ArronaxIcon)`
  cursor: pointer;
  position: absolute;
  top: 30px;
  right: 30px;
`;

export const ModalTitle = styled.div`
  padding: 0 0 19px 0;
  font-size: 24px;
  line-height: 28px;
  font-weight: 400;
  color: #9b9b9b;
  display: flex;
  align-items: center;
`;

export const RowContainer = styled.div`
  display: flex;
  padding: 15px 0;
  font-size: 16px;
  line-height: 19px;
  border-bottom: 1px solid #dcdcdc;
  letter-spacing: 0.23px;
  color: rgb(74, 74, 74);
`;

export const TitleTxt = styled.div`
  width: 198px;
  font-weight: 400;
`;

export const ContentTxt = styled.span`
display: flex;
align-items: center;
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

export const GotoOpBtn = styled.div`
  color: #56c2d9;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 12px;
`;

