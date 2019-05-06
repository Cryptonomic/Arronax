import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ArronaxIcon from '../ArronaxIcon';
import ColumnItem from '../ColumnItem';

import {
  getColumns,
  getAttributes,
  getEntity
} from '../../reducers/app/selectors';
import {
  setColumnsAction
} from '../../reducers/app/actions';

const Container = styled.div`
  width: ${({ count }) => count*372 + 'px' };
  margin: auto;
`;

const MainContainer = styled.div`
  border: 1px solid rgb(237, 237, 237);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
  background-color: white;
`;

const ColumnsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 510px;
`;

const HeaderTxt = styled.div`
  color: #4a4a4a;
  font-size: 20px;
  margin-bottom: 14px;
`;

const Title = styled.div`
  font-size: 16px;
  line-height: 19px;
  padding: 13px 25px;
  color: rgb(155, 155, 155);
  font-weight: 400;
`;

const RefreshIcon = styled(ArronaxIcon)`
  margin-right: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 25px;
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
  selectedColumns: any[];
  selectedEntity: string;
  attributes: any;
  onSubmit: () => void;
  setColumns: (entity: string, columns: object[]) => void;
};

type States = {
  selected: object[];
};

class ColumnsPanel extends React.Component<Props, States> {
  state = {
    selected: [],
    prevPropsSelected: []
  };

  static getDerivedStateFromProps(props, state) {
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
    await setColumns(selectedEntity, selected);
    await onSubmit();
  };

  handleChange = (attribute) => {
    const { selected } = this.state;
    const positionInArray = selected.findIndex(
      column => column.name === attribute.name
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
    const { selectedColumns } = this.props;
    this.setState({ selected: [...selectedColumns] });
  };

  render() {
    const { attributes } = this.props;
    const { selected } = this.state;
    const columnsCount = Math.ceil(attributes.length / 10);
    return (
      <Container count={columnsCount}>
        <HeaderTxt>Columns</HeaderTxt>
        <MainContainer>
          <Title>Select Columns to Display</Title>
          <ColumnsContainer>
            {selected.map((attribute, index) => (
              <ColumnItem
                key={index}
                isChecked
                name={attribute.displayName}
                onClick={() => this.handleChange(attribute)}
              />
            ))}
            {attributes.map((attribute, index) => {
              const pos = selected.findIndex(item => item.name === attribute.name);
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

const mapStateToProps = state => ({
  selectedColumns: getColumns(state),
  attributes: getAttributes(state),
  selectedEntity: getEntity(state),
});

const mapDispatchToProps = dispatch => ({
  setColumns: (entity: string, columns: object[]) =>
    dispatch(setColumnsAction(entity, columns))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnsPanel);

