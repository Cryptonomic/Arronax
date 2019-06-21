
import styled from 'styled-components';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import PlusIcon from '@material-ui/icons/Add';
import { ArronaxIcon } from '../ArronaxIcon';

export const Container = styled.div`
  width: 100%;
`;

export const HeaderTxt = styled.div`
  color: #4a4a4a;
  font-size: 20px;
  margin-bottom: 14px;
`;

export const MainContainer = styled.div`
  width: 100%;
  background: #fbfbfb;
  border: 1px solid #ededed;
  border-radius: 3px;
`;

export const AggItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 0 30px;
`;

export const AggItemGr = styled.div`
  border-radius: 5px;
  border: 1px solid #ecedef;
  display: flex;
`;

export const AddAggFooter = styled.div<{isFilters: boolean}>`
  width: 100%;
  height: ${({ isFilters }) => (isFilters ? '67px' : '93px')};
  display: flex;
  align-items: center;
  padding-left: 24px;
  border-top: ${({ isFilters }) => (isFilters ? '1px solid #ECEDEF' : 'none')};
  margin-top: ${({ isFilters }) => (isFilters ? '18px' : '0')};
`;

export const AddButton = styled.div<{isDisabled: boolean}>`
  color: #56c2d9;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'initial')};
`;

export const PlusIconWrapper = styled(PlusIcon)`
  &&& {
    color: #56c2d9;
    font-size: 27px;
  }
` as React.ComponentType<SvgIconProps>;

export const HR = styled.div`
  width: 1px;
  background-color: #ecedef;
`;

export const RefreshIcon = styled(ArronaxIcon)`
  margin-right: 12px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  padding: 25px;
  justify-content: flex-end;
`;

export const RunButton = styled.div`
  cursor: pointer;
  margin-left: 40px;
  color: white;
  background: #56c2d9;
  border-radius: 9px;
  font-size: 20px;
  font-weight: 700;
  height: 60px;
  width: 158px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResetButton = styled.div`
  color: #56c2d9;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
`;