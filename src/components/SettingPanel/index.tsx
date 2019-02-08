import * as React from 'react';
import styled from 'styled-components';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/CloseOutlined';
import PlusIcon from '@material-ui/icons/Add';
import ColumnsDisplay from '../ColumnsDisplay';

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

const AddFilterContainer = styled.div`
  width: 100%;
  background: #fbfbfb;
  border: 1px solid #ededed;
  border-radius: 3px;
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

const AddFilterFooter = styled.div`
  width: 100%;
  height: 93px;
  display: flex;
  align-items: center;
  padding-left: 24px;
`;

const AddFilterButton = styled.div`
  color: #56c2d9;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const PlusIconWrapper = styled(PlusIcon)`
  &&& {
    color: #56c2d9;
    font-size: 27px;
  }
`;

const FilterExpTxt = styled.div`
  color: #9b9b9b;
  font-size: 18px;
  margin-left: 21px;
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

const SettingPanel: React.StatelessComponent<Props> = props => {
  const { isCollapse, onClose } = props;
  return (
    <Collapse in={isCollapse}>
      <Container>
        <CloseIconContainer onClick={onClose}>
          <CloseIconWrapper />
        </CloseIconContainer>
        <FilterTxt>Filter</FilterTxt>
        <AddFilterContainer>
          <AddFilterFooter>
            <AddFilterButton>
              <PlusIconWrapper />
              Add Filter
            </AddFilterButton>
            <FilterExpTxt>
              You can filter by all block attributes and more.
            </FilterExpTxt>
          </AddFilterFooter>
        </AddFilterContainer>
        <DisplayTxt>Display</DisplayTxt>
        <DisplayContainer>
          <ColumnsDisplay />
        </DisplayContainer>
      </Container>
    </Collapse>
  );
};

export default SettingPanel;
