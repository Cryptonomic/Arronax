import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import { fetchValues } from '../../reducers/app/thunks';
import {
  getAvailableValues,
  getSelectedFilters,
  getOperators,
  getSelectedValues
} from '../../reducers/app/selectors';
import {
  setSelectedValueAction,
  removeValueAction,
  addFilterAction,
  removeFilterAction,
  changeFilterAction,
} from '../../reducers/app/actions';
import FilterSelect from '../FilterSelect';
import ValueSelect from '../ValueSelect';
import ValueInput from '../ValueInput';

const Container = styled.div`
  width: 100%;
  background: #fbfbfb;
  border: 1px solid #ededed;
  border-radius: 3px;
`;

const FilterItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 0 30px;
`;

const FilterItemGr = styled.div`
  border-radius: 5px;
  border: 1px solid #ecedef;
  display: flex;
`;

const AddFilterFooter = styled.div`
  width: 100%;
  height: ${({ isFilters }) => (isFilters ? '67px' : '93px')};
  display: flex;
  align-items: center;
  padding-left: 24px;
  border-top: ${({ isFilters }) => (isFilters ? '1px solid #ECEDEF' : 'none')};
  margin-top: ${({ isFilters }) => (isFilters ? '18px' : '0')};
`;

const AddFilterButton = styled.div`
  color: #56c2d9;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'initial')};
`;

const PlusIconWrapper = styled(PlusIcon)`
  &&& {
    color: #56c2d9;
    font-size: 27px;
  }
`;

const DeleteIconWrapper = styled(DeleteIcon)`
  &&& {
    color: #d8d8d8;
    font-size: 37px;
  }
`;

const FilterExpTxt = styled.div`
  color: #9b9b9b;
  font-size: 18px;
  margin-left: 21px;
`;

const HR = styled.div`
  width: 1px;
  background-color: #ecedef;
`;

const attrTabValue = {
  blocks: 'block',
  operations: 'operation',
  accounts: 'account',
};

interface Filter {
  name: string;
  operator: string;
  operatorType: string;
  isCard?: boolean;
}

type Props = {
  selectedValues: object;
  availableValues: object;
  selectedEntity: string;
  attributes: any[];
  filters: Array<Filter>;
  operators: any;
  removeValue: (value: object) => void;
  setSelectedValue: (entity: string, attribute: string, value: string) => void;
  fetchValues: (value: string) => void;
  addFilter: (entity: string) => void;
  removeFilter: (entity: string, index: number) => void;
  changeFilter: (entity: string, filter: object, index: number) => void;
};

type States = {
  value: string;
};

class FilterPanel extends React.Component<Props, States> {
  state = {
    value: ''
  };

  onAddFilter = () => {
    const { addFilter, selectedEntity } = this.props;
    addFilter(selectedEntity);
  };

  // we have to modify
  onRemoveFilter = (index, filter) => {
    const {
      removeFilter,
      selectedEntity,
      removeValue,
      selectedValues
    } = this.props;
    removeFilter(selectedEntity, index);
  };

  onFilterNameChange = (attr, index) => {
    const {
      filters,
      selectedEntity,
      changeFilter,
      fetchValues,
      availableValues
    } = this.props;

    const isCard = attr.cardinality < 15 && attr.cardinality !== null;
    if (isCard && !availableValues[attr.name]) {
      fetchValues(attr.name);
    }
    let operatorType = 'dateTime';
    if (attr.dataType === 'Int' || attr.dataType === 'Decimal') {
      operatorType = 'numeric';
    } else if (attr.dataType === 'String') {
      operatorType = 'string';
    } else if (attr.dataType === 'Boolean') {
      operatorType = 'boolean';
    }
    const selectedFilter = {
      ...filters[index],
      name: attr.name,
      isCard,
      operatorType
    };
    changeFilter(selectedEntity, selectedFilter, index);
  };

  onFilterOperatorChange = (operator, index) => {
    const {
      filters,
      selectedEntity,
      changeFilter,
    } = this.props;
    const selectedFilter = {
      ...filters[index],
      operator: operator.name
    };
    changeFilter(selectedEntity, selectedFilter, index);
  };

  onValueChange = (val, attribute) => {
    const { setSelectedValue, selectedEntity } = this.props;
    setSelectedValue(selectedEntity, attribute, val);
  };

  // we have to modify
  handleInputChange = (value, filter, filterOperator) => {
    this.setState({ value: value });
  };

  // we have to modify
  handleBetweenInputChange = (value, filter, filterOperator) => {
    this.setState({ value: value });
    const betweenValue = `-${value}`;
  };

  render() {
    const {
      selectedEntity,
      attributes,
      filters,
      operators,
      selectedValues,
      availableValues
    } = this.props;
    const { value } = this.state;
    const entityName = attrTabValue[selectedEntity];

    const disableAddFilter = false;

    // const disableAddFilter =
    //   (filters.length > 0 &&
    //     filters.length !==
    //       filterInputState[selectedEntity].length + selectedValues.length) ||
    //   (filters.length > 0 &&
    //     filters.length ===
    //       filterInputState[selectedEntity].length + selectedValues.length &&
    //     selectedValues.length !== filters.length &&
    //     value === '');

    return (
      <Container>
        {filters.map((filter: Filter, index) => {
          const newAttributes = attributes.filter((attr: any) => {
            if (attr.name === filter.name) {
              return true;
            }
            const pos = filters.findIndex(
              (item: any) => item.name === attr.name
            );
            return pos === -1;
          });

          return (
            <FilterItemContainer key={index}>
              <FilterItemGr>
                <FilterSelect
                  value={filter.name}
                  placeholder={`Select ${entityName} Attribute`}
                  items={newAttributes}
                  onChange={attr => this.onFilterNameChange(attr, index)}
                />
                {filter.name && <HR />}
                {filter.name && (
                  <FilterSelect
                    value={filter.operator}
                    placeholder={`Select Operator`}
                    items={operators[filter.operatorType]}
                    onChange={operator =>
                      this.onFilterOperatorChange(operator, index)
                    }
                  />
                )}
                {filter.operator && <HR />}
                {(filter.operator && filter.operator === 'EQ') ||
                  (filter.operator === 'NOTEQ' &&
                    filter.isCard && (
                      <ValueSelect
                        placeholder={`Select Value`}
                        selectedValue={selectedValues[filter.name]}
                        values={availableValues[filter.name]}
                        onChange={value => this.onValueChange(value, filter.name)}
                      />
                    ))}
                {filter.operator && !filter.isCard && (
                  <ValueInput
                    value={value}
                    selectedEntity={selectedEntity}
                    InputProps={{ disableUnderline: true }}
                    filter={filter}
                    onInputChange={value =>
                      this.handleInputChange(
                        value,
                        filter.name,
                        filter.operator
                      )
                    }
                    onBetweenInputChange={value =>
                      this.handleBetweenInputChange(
                        value,
                        filter.name,
                        filter.operator
                      )
                    }
                  />
                )}
              </FilterItemGr>
              <IconButton
                aria-label="Delete"
                onClick={() => this.onRemoveFilter(index, filter)}
              >
                <DeleteIconWrapper />
              </IconButton>
            </FilterItemContainer>
          );
        })}

        <AddFilterFooter isFilters={filters.length > 0}>
          <AddFilterButton
            onClick={this.onAddFilter}
            isDisabled={disableAddFilter}
          >
            <PlusIconWrapper />
            Add Filter
          </AddFilterButton>
          {filters.length == 0 && (
            <FilterExpTxt>
              You can filter by all {entityName} attributes and more.
            </FilterExpTxt>
          )}
        </AddFilterFooter>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  filters: getSelectedFilters(state),
  availableValues: getAvailableValues(state),
  operators: getOperators(state),
  selectedValues: getSelectedValues(state)
});

const mapDispatchToProps = dispatch => ({
  fetchValues: (value: string) => dispatch(fetchValues(value)),
  removeValue: (value: object) => dispatch(removeValueAction(value)),
  setSelectedValue: (entity: string, attribute: string, value: string) =>
    dispatch(setSelectedValueAction(entity, attribute, value)),
  addFilter: (entity: string) => dispatch(addFilterAction(entity)),
  removeFilter: (entity: string, index: number) =>
    dispatch(removeFilterAction(entity, index)),
  changeFilter: (entity: string, filter: object, index: number) =>
    dispatch(changeFilterAction(entity, filter, index)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPanel);
