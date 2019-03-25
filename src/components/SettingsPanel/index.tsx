import * as React from 'react';
import styled from 'styled-components';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/CloseOutlined';
import ColumnsDisplay from '../ColumnsDisplay';
import FilterPanel from '../FilterPanel';
import RefreshIcon from '@material-ui/icons/Refresh';

const Container = styled.div`
  position: relative;
  padding: 50px 77px 50px 50px;
  background: #ecedef;
`;

const QueryContainer = styled.div`
  display: flex;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
`;

const RunButton = styled.div`
  cursor: pointer;
  margin-left: 40px;
  color: white;
  background: #56c2d9;
  border-radius: 9px 9px 9px 9px;
  font-size: 18px;
  height: 47px;
  width: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResetButton = styled.div`
  color: #56c2d9;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
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
  padding-right: 24px;
  width: 50%;
  height: 93px;
  background: white;
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
  rowCount: number;
  selectedColumns: any;
  isCollapse: boolean;
  filterInputState: object[];
  selectedEntity: string;
  attributes: object[];
  setColumns: (columns: object[]) => void;
  setRowCount: (count: number) => void;
  submitValues: () => void;
  setFilterInputState: (
    value: string,
    filterName: string,
    filterOperator: string
  ) => void;
  onClose: () => void;
  resetValues: () => void;
}

const SettingsPanel: React.StatelessComponent<Props> = props => {
  const {
    isCollapse,
    onClose,
    selectedColumns,
    resetValues,
    submitValues,
    filterInputState,
    setFilterInputState,
    rowCount,
    setRowCount,
    selectedEntity,
    attributes,
    setColumns,
  } = props;
  return (
    <Collapse in={isCollapse}>
      <Container>
        <CloseIconContainer onClick={onClose}>
          <CloseIconWrapper />
        </CloseIconContainer>
        <FilterTxt>Filter</FilterTxt>
        <FilterPanel
          setFilterInputState={setFilterInputState}
          filterInputState={filterInputState}
        />
        <DisplayTxt>Display</DisplayTxt>
        <QueryContainer>
          <DisplayContainer>
            <ColumnsDisplay
              submitValues={submitValues}
              setColumns={setColumns}
              selectedEntity={selectedEntity}
              attributes={attributes}
              rowCount={rowCount}
              setRowCount={setRowCount}
              selectedColumns={selectedColumns}
            />
          </DisplayContainer>
          <ButtonsContainer>
            <ResetButton onClick={resetValues}>
              <RefreshIcon />
              {'  '}Reset
            </ResetButton>
            <RunButton onClick={submitValues}>Run</RunButton>
          </ButtonsContainer>
        </QueryContainer>
      </Container>
    </Collapse>
  );
};

export default SettingsPanel;
