import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import muiStyled from '@material-ui/styles/styled';
import FormControl from '@material-ui/core/FormControl';
import SelectField from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { ArronaxIcon } from '../ArronaxIcon';

const Container = styled.div`
  position: absolute;
  right: 30px;
  top: 225px;
  height: 52px;
  display: flex;
  align-items: center;
`;

const SelectContainer = muiStyled(FormControl)({
  marginLeft: '12px'
});

const SelectWrapper = muiStyled(SelectField)({
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '1.95px',
  color: '#56c2d9',
  '&:before': {
    borderBottom: 0,
  },
  '&:after': {
    borderBottom: 0,
  },
  '&:hover:before': {
    borderBottom: '0 !important',
  }
});

const DownIcon = styled(ArronaxIcon)`
  position: absolute;
  top: -2px;
  right: -5px;
  z-index: -1;
`;

const MainMenuItem = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      background-color: rgba(101,  200, 206, 0.13);
    }
    &:hover {
      background-color: rgba(101,  200, 206, 0.1);
    }
  }
`;

const MainTxtWrapper = styled.div`
  color: #4a4a4a;
  font-size: 16px;
  letter-spacing: 1.95px;
  margin: 0 5px 0 2px;
`;

const LimitTxt = styled.div`
  color: #4a4a4a;
  font-size: 16px;
  letter-spacing: 1.95px;
  margin: 0;
`;

const ButtonWrapper = styled.div<{ isActive: number, isNext?: boolean }>`
  height: 52px;
  width: 52px;
  border: 1px solid #ecedef;
  border-color: ${({ isActive }) => (isActive ? '#DCDCDC' : '#ECEDEF')};
  background: ${({ isActive }) => (isActive ? '#FFFFFF' : '#FBFBFB')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ isActive }) => (isActive ? 'pointer' : 'default')};
  pointer-events: ${({ isActive }) => (isActive ? 'auto' : 'none')};
  border-radius: ${({ isNext }) => (isNext ? '0 5px 5px 0' : '5px 0 0 5px')};
  &:hover {
    border-color: rgb(180, 231, 242);
  }
`;

const TooltipButton = muiStyled(IconButton)({
  padding: '5px',
  marginRight: '14px'
});

const TooltipContainer = styled.div`
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: rgb(155, 155, 155);
  background: white;
`;

const ExportTxt = styled.span`
  color: #56c2d9;
  cursor: pointer;
`;

const TooltipWrapper = withStyles({
  tooltip: {
    maxWidth: '370px',
    padding: '23px 0px 23px 23px',
    boxShadow: '0px 0px 12px 0px rgba(0, 0, 0, 0.3)',
    background: 'white'
  },
  arrow: {
    color: 'white'
  }
})(Tooltip);

const getList = (pageCount: number, balance: number, rowsPerPage: number) => {
  let items = [];
  for (let i = 0; i < pageCount - 1; i++) {
    items.push(
      <MainMenuItem key={i} value={i}>
        {i * rowsPerPage + 1}-{(i + 1) * rowsPerPage}
      </MainMenuItem>
    );
  }

  if (balance) {
    const newCount = pageCount - 1;
    items.push(
      <MainMenuItem key={newCount} value={newCount}>
        {newCount * rowsPerPage + 1}-{newCount * rowsPerPage + balance}
      </MainMenuItem>
    );
  } else {
    const newCount = pageCount - 1;
    items.push(
      <MainMenuItem key={newCount} value={newCount}>
        {newCount * rowsPerPage + 1}-{(newCount + 1) * rowsPerPage}
      </MainMenuItem>
    );
  }
  return items;
};

const getLimitTooltip = (onExportCsv: () => void) => {
  return (
    <TooltipContainer>
      <Trans i18nKey='components.customPaginator.limit_query'>
        Queries on Arronax are limited to 1000 results. <ExportTxt onClick={onExportCsv}>Export to CSV</ExportTxt> to get the full result set.
      </Trans>
    </TooltipContainer>
  );
}

interface Props {
  rowsPerPage: number;
  page: number;
  totalNumber: number;
  onChangePage(page: number): void;
  onExportCsv: () => void;
}

const CustomPaginator: React.FC<Props> = props => {
  const { page, totalNumber, onChangePage, rowsPerPage, onExportCsv } = props;
  const pageCount = Math.ceil(totalNumber / rowsPerPage);
  const balance = totalNumber % rowsPerPage;
  return (
    <Container>
      <SelectContainer>
        <SelectWrapper
          value={page}
          onChange={(event: any) => onChangePage(event.target.value)}
          IconComponent={() =>
            <DownIcon iconName="icon-down-caret" size="40px" color="#65c8ce" />
          }
        >
          {getList(pageCount, balance, rowsPerPage)}
        </SelectWrapper>
      </SelectContainer>
      <MainTxtWrapper>of {totalNumber}</MainTxtWrapper>
      {totalNumber >= 1000 && (
        <>
          <LimitTxt>limit</LimitTxt>
          <TooltipWrapper
            interactive
            arrow
            placement="bottom-end"
            title={getLimitTooltip(onExportCsv)} >
            <TooltipButton>
              <ArronaxIcon iconName="icon-question" size="16px" color="#56c2d9" />
            </TooltipButton>
          </TooltipWrapper>
        </>
      )}
      <ButtonWrapper
        isActive={page !== 0 ? 1 : 0}
        onClick={() => onChangePage(page - 1)}
      >
        <ArronaxIcon iconName="icon-previous" size="16px" color={page !== 0 ? '#65C8CE' : '#D3D3D3'} />
      </ButtonWrapper>
      <ButtonWrapper
        isActive={page !== pageCount - 1 ? 1 : 0}
        isNext
        onClick={() => onChangePage(page + 1)}
      >
        <ArronaxIcon iconName="icon-next" size="16px" color={page !== pageCount - 1 ? '#65C8CE' : '#D3D3D3'} />
      </ButtonWrapper>
    </Container>
  );
};

export default CustomPaginator;
