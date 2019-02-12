import * as React from 'react';
import styled from 'styled-components';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/CloseOutlined';
import ColumnsDisplay from '../ColumnsDisplay';
import FilterPanel from '../FilterPanel';

const Container = styled.div`
  position: relative;
  padding: 50px 77px 50px 50px;
  background: #ecedef;
`;

const FilterTxt = styled.div`
  color: #4a4a4a;
  font-size: 20px;
  margin-bottom: 14px;
`;

const DisplayTxt = styled(FilterTxt)`
  margin-top: 20px;
`;

const DisplayContainer = styled.div`
  align-items: center;
  padding-left: 24px;
  width: 100%;
  height: 93px;
  background: #fbfbfb;
  border: 1px solid #ededed;
  border-radius: 3px;
  display: flex;
  flex-grow: row;
`;

const CloseIconContainer = styled.div`
  position: absolute;
  right: 26px;
  top: 26px;
  cursor: pointer;
`;

const CloseIconWrapper = styled(CloseIcon)`
  &&& {
    color: #9b9b9b;
    font-size: 27px;
  }
`;

interface Props {
  selectedTab: string;
  isCollapse: boolean;
  onClose: () => void;
}

const SettingsPanel: React.StatelessComponent<Props> = props => {
  const { isCollapse, onClose } = props;
  return (
    <Collapse in={isCollapse}>
      <Container>
        <CloseIconContainer onClick={onClose}>
          <CloseIconWrapper />
        </CloseIconContainer>
        <FilterTxt>Filter</FilterTxt>
        <FilterPanel />        
        <DisplayTxt>Display</DisplayTxt>
        <DisplayContainer>
          <ColumnsDisplay />
        </DisplayContainer>
      </Container>
    </Collapse>
  );
};

export default SettingsPanel;
