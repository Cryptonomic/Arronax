import styled from 'styled-components';

import { ArronaxIcon } from '../../components/ArronaxIcon';

export const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 50px 0;
`;

export const ModalContainer = styled.div`
    background-color: #ffffff;
    outline: none;
    position: relative;
    padding: 0px 30px 30px 30px;
    margin: 0 auto;
    width: 798px;
    min-height: 100%;
    max-height: 80vh;
    overflow: auto;
`;

export const ListContainer = styled.div`
    width: 100%;
`;

export const Button = styled.div`
    color: #56c2d9;
    cursor: pointer;
    display: flex;
    align-items: center;
`;

export const CloseIcon = styled(ArronaxIcon)<{ top?: string; left?: string; right?: string }>`
    cursor: pointer;
    position: sticky;
    top: ${(props) => props.top};
    right: ${(props) => props.right};
    left: ${(props) => props.left};
    z-index: 1;
    display: flex;
    justify-content: flex-end;
    margin-bottom: -20px;
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

export const MultiLineContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const MultiLineItem = styled.div`
    align-items: center;
`;

export const TitleWrapper = styled.div`
    position: sticky;
    top: 0;
    background: #ffffff;
    padding-top: 27px;
`;

export const RowContainer = styled.div`
    display: flex;
    align-items: center;
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
    flex: 1;
    align-items: center;
`;

export const ButtonContainer = styled.div`
    display: flex;
    padding: 10px;
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

export const BottomColContent = styled.div`
    color: rgb(74, 74, 74);
    font-size: 16px;
    font-weight: 300;
    line-height: 19px;
    margin: 8px 0 0 0;
`;
