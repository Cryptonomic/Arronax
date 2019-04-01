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
} from '../../reducers/app/selectors';
import {
  setSelectedValuesAction,
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
`;

const DisableFilterButton = styled.div`
  opacity: 0.5;
  color: #56c2d9;
  font-size: 18px;
  font-weight: bold;
  cursor: default;
  display: flex;
  align-items: center;
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
}

type Props = {
  selectedValues: object[];
  availableValues: object[];
  selectedEntity: string;
  attributes: any[];
  filters: Array<Filter>;
  operators: object[];
  filterInputState: object;
  setFilterInputState: (
    value: string,
    filterName: string,
    filterOperator: string
  ) => void;
  removeValue: (value: object) => void;
  setSelectedValues: (value: object) => void;
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
    value: '',
  };

  onAddFilter = () => {
    const { addFilter, selectedEntity } = this.props;
    addFilter(selectedEntity);
  };

  onRemoveFilter = (index, filter) => {
    const {
      removeFilter,
      selectedEntity,
      removeValue,
      selectedValues,
      filterInputState,
      setFilterInputState,
    } = this.props;
    const itemToRemove = filterInputState[selectedEntity].find(
      value => Object.keys(value).toString() === filter.name
    );
    if (itemToRemove) {
      setFilterInputState(
        null,
        Object.keys(itemToRemove).toString(),
        filter.operator
      );
    }
    selectedValues.forEach(val => {
      const valueToRemove = Object.keys(val).toString();
      if (valueToRemove === filter.name) {
        removeValue(val);
      }
    });
    removeFilter(selectedEntity, index);
  };

  onFilterNameChange = (val, index) => {
    const {
      filters,
      selectedEntity,
      changeFilter,
      attributes,
      fetchValues,
    } = this.props;
    const cards = attributes.reduce((acc, current) => {
      if (current.cardinality < 15 && current.cardinality !== null) {
        acc.push(current.name);
      }
      return acc;
    }, []);
    if (cards.includes(val)) {
      fetchValues(val);
    }
    const selectedFilter: any = filters[index];
    selectedFilter.name = val;
    changeFilter(selectedEntity, selectedFilter, index);
  };

  onFilterOperatorChange = (val, index) => {
    const {
      filters,
      selectedEntity,
      changeFilter,
      filterInputState,
      setFilterInputState,
    } = this.props;
    const selectedFilter: any = filters[index];
    const findInput = filterInputState[selectedEntity].find(
      filter => Object.keys(filter).toString() === selectedFilter.name
    );
    // Check to see if input value for this attribute is populated and clear if so
    if (findInput) {
      setFilterInputState(
        null,
        Object.keys(findInput).toString(),
        selectedFilter.operator
      );
    }
    selectedFilter.operator = val;
    changeFilter(selectedEntity, selectedFilter, index);
  };

  onFilterAttributeChange = (val, index) => {
    const { filters, selectedEntity, changeFilter } = this.props;
    const selectedFilter: any = filters[index];
    selectedFilter.attribute = val;
    changeFilter(selectedEntity, selectedFilter, index);
  };

  onValueChange = val => {
    const { setSelectedValues } = this.props;
    setSelectedValues(val);
  };

  handleInputChange = (value, filter, filterOperator) => {
    const { setFilterInputState } = this.props;
    this.setState({ value: value });
    setFilterInputState(value, filter, filterOperator);
  };

  handleBetweenInputChange = (value, filter, filterOperator) => {
    const { setFilterInputState } = this.props;
    this.setState({ value: value });
    const betweenValue = `-${value}`;
    setFilterInputState(betweenValue, filter, filterOperator);
  };

  render() {
    const {
      selectedEntity,
      attributes,
      filters,
      operators,
      selectedValues,
      availableValues,
      filterInputState,
    } = this.props;
    const { value } = this.state;
    const entityName = attrTabValue[selectedEntity];
    const cards = attributes.reduce((acc, current) => {
      if (current.cardinality < 15 && current.cardinality !== null) {
        acc.push(current.name);
      }
      return acc;
    }, []);

    const disableAddFilter =
      (filters.length > 0 &&
        filters.length !==
          filterInputState[selectedEntity].length + selectedValues.length) ||
      (filters.length > 0 &&
        filters.length ===
          filterInputState[selectedEntity].length + selectedValues.length &&
        value === '');

    return (
      <Container>
        {filters.map((filter: any, index) => {
          let newAttributes = [];
          attributes.forEach((attr: any) => {
            if (attr.name === filter.name) {
              newAttributes.push(attr);
            }
            const index = filters.findIndex(
              (item: any) => item.name === attr.name
            );
            if (index < 0) {
              newAttributes.push(attr);
            }
          });
          return (
            <FilterItemContainer key={index}>
              <FilterItemGr>
                <FilterSelect
                  value={filter.name}
                  placeholder={`Select ${entityName} Attribute`}
                  items={newAttributes}
                  onChange={val => this.onFilterNameChange(val, index)}
                />
                {filter.name && <HR />}
                {filter.name && (
                  <FilterSelect
                    value={filter.operator}
                    placeholder={`Select Operator`}
                    items={operators}
                    onChange={event =>
                      this.onFilterOperatorChange(event, index)
                    }
                  />
                )}
                {filter.operator && <HR />}
                {filter.operator &&
                  filter.operator === 'EQ' &&
                  cards.includes(filter.name) && (
                    <ValueSelect
                      placeholder={`Select Value`}
                      filter={filter.name}
                      selectedValues={selectedValues}
                      availableValues={availableValues}
                      onChange={value => this.onValueChange(value)}
                    />
                  )}
                {filter.operator && !cards.includes(filter.name) && (
                  <ValueInput
                    value={value}
                    selectedEntity={selectedEntity}
                    filterInputState={filterInputState}
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
          {disableAddFilter ? (
            <DisableFilterButton>
              <PlusIconWrapper />
              Add Filter
            </DisableFilterButton>
          ) : (
            <AddFilterButton onClick={this.onAddFilter}>
              <PlusIconWrapper />
              Add Filter
            </AddFilterButton>
          )}
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
});

const mapDispatchToProps = dispatch => ({
  fetchValues: (value: string) => dispatch(fetchValues(value)),
  removeValue: (value: object) => dispatch(removeValueAction(value)),
  setSelectedValues: (value: object) =>
    dispatch(setSelectedValuesAction(value)),
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
