import styled from 'styled-components';
import { ArronaxIcon } from '../ArronaxIcon';

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

export const BottomRowContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 25px;
`;

export const BottomCol = styled.div`
  width: 111px;
`;

export const BottomColTitle = styled.p`
  color: rgb(168, 168, 168);
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  margin: 0;
`;

export const BottomColContent = styled.p`
  color: rgb(74, 74, 74);
  font-size: 16px;
  font-weight: 300;
  line-height: 19px;
  margin: 8px 0 0 0;
`;
