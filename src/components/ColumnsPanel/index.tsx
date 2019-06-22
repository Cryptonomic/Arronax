import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ArronaxIcon } from '../ArronaxIcon';
import ColumnItem from '../ColumnItem';
import ColumnDragItem from '../ColumnDragItem';
import { AttributeDefinition } from 'conseiljs';

import {
  getColumns,
  getAttributes,
  getEntity
} from '../../reducers/app/selectors';
import { resetColumns, setColumnsThunk } from '../../reducers/app/thunks';

const Container = styled.div<{ count: number }>`
  width: ${({ count }) => count*372 + 'px' };
  margin: auto;
  max-width: 100%;
`;

const MainContainer = styled.div`
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
  background-color: white;
  max-width: 100%;
  overflow-x: auto;
`;

const ColumnsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 310px;
`;

const RefreshIcon = styled(ArronaxIcon)`
  margin-right: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 25px;
  justify-content: flex-end;
`;

const RunButton = styled.div`
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

const ResetButton = styled.div`
  color: #56c2d9;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

type Props = {
  selectedColumns: AttributeDefinition[];
  selectedEntity: string;
  attributes: AttributeDefinition[];
  onSubmit: () => void;
  setColumns: (columns: AttributeDefinition[]) => void;
  onResetColumns: () => void;
};

type States = {
  selected: AttributeDefinition[];
  prevPropsSelected: AttributeDefinition[];
};

class ColumnsPanel extends React.Component<Props, States> {

  constructor(props: Props) {
    super(props);
    this.state = {
      selected: [],
      prevPropsSelected: []
    };
  }

  static getDerivedStateFromProps(props: Props, state: States) {
    if (props.selectedColumns !== state.prevPropsSelected) {
      return {
        prevPropsSelected: props.selectedColumns,
        selected: props.selectedColumns
      };
    }
    return null;
  }

  handleSubmit = async () => {
    const { selected } = this.state;
    const { selectedEntity, setColumns, onSubmit } = this.props;
    await setColumns(selected);
    await onSubmit();
  };

  handleChange = (attribute: AttributeDefinition) => {
    const { selected } = this.state;
    const positionInArray = selected.findIndex(
      (column: AttributeDefinition) => column.name === attribute.name
    );
    if (positionInArray === -1) {
      this.setState({
        selected: [...selected, attribute],
      });
    } else {
      selected.splice(positionInArray, 1);
      this.setState({
        selected: [...selected],
      });
    }
  };

  cancelChange = () => {
    const { onResetColumns } = this.props;
    onResetColumns();
  };

  onMoveItem = (dragIndex: number, hoverIndex: number) => {
    const { selected } = this.state;
    const selectedItem = selected[dragIndex];
    selected.splice(dragIndex, 1);
    selected.splice(hoverIndex, 0, selectedItem);
    this.setState({
      selected: [...selected],
    });
  }

  render() {
    const { attributes } = this.props;
    const { selected } = this.state;
    const columnsCount = Math.ceil(attributes.length / 6);
    return (
      <Container count={columnsCount}>
        <MainContainer>
          <ColumnsContainer>
            {selected.map((attribute: AttributeDefinition, index: number) => (
              <ColumnDragItem
                key={index}
                index={index}
                name={attribute.displayName}
                onClick={() => this.handleChange(attribute)}
                moveItem={this.onMoveItem}
              />
            ))}
            {attributes.sort((a: AttributeDefinition, b: AttributeDefinition) => (a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1))
              .map((attribute: AttributeDefinition, index: number) => {
                const pos = selected.findIndex((item: AttributeDefinition) => item.name === attribute.name);
                if (pos !== -1) {
                  return null;
                }
                return (
                  <ColumnItem
                    key={index}
                    name={attribute.displayName}
                    onClick={() => this.handleChange(attribute)}
                  />
                );
            })}
          </ColumnsContainer>
        </MainContainer>
        <ButtonContainer>
          <ResetButton onClick={this.cancelChange}>
            <RefreshIcon size="23px" color="#56c2d9" iconName="icon-reset"/>
            Reset
          </ResetButton>
          <RunButton onClick={this.handleSubmit}>
            Apply
          </RunButton>
        </ButtonContainer>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  selectedColumns: getColumns(state),
  attributes: getAttributes(state),
  selectedEntity: getEntity(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  setColumns: (columns: AttributeDefinition[]) => dispatch(setColumnsThunk(columns)),
  onResetColumns: () => dispatch(resetColumns())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnsPanel);

