import * as React from 'react';
import styled from 'styled-components';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/CloseOutlined';
import PlusIcon from '@material-ui/icons/Add';

const Container = styled.div`
  position: relative;
  padding: 50px 77px 50px 50px;
  background: #ECEDEF;
`;

const FilterTxt = styled.div`
  color: #4A4A4A;
  font-size: 20px;
  margin-bottom: 14px;
`;

const DisplayTxt = styled(FilterTxt)`
  margin-top: 20px;
`;

const AddFilterContainer = styled.div`
  width: 100%;
  background: #FBFBFB;
  border: 1px solid #EDEDED;
  border-radius: 3px;
`;

const AddFilterFooter = styled.div`
  width: 100%;
  height: 93px;
  display: flex;
  align-items: center;
  padding-left: 24px;
`;

const AddFilterButton = styled.div`
  color: #56C2D9;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const PlusIconWrapper = styled(PlusIcon)`
  &&& {
    color: #56C2D9;
    font-size: 27px;
  }  
`;

const FilterExpTxt = styled.div`
  color: #9B9B9B;
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
    color: #9B9B9B;
    font-size: 27px;
  }
`;

interface Props {
  isCollapse: boolean;
  onClose: () => void;
}

const FilterPanel: React.StatelessComponent<Props> = (props) => {
  const {isCollapse, onClose} = props;
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
            <FilterExpTxt>You can filter by all block attributes and more.</FilterExpTxt>

          </AddFilterFooter>

        </AddFilterContainer>

        <DisplayTxt>Display</DisplayTxt>
      </Container>
    </Collapse>    
  );
};

export default FilterPanel;
