import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import { fetchValues } from '../../reducers/app/thunks';
import {
  getAvailableValues,
  getEntity,
  getAttributes,
  getSelectedFilters,
  getOperators,
  getSelectedValues,
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

type Props = {
  selectedValues: object[];
  availableValues: object[];
  selectedEntity: string;
  attributes: any[];
  filters: object[];
  operators: object[];
  filterInputState: object[];
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
  filters: object[];
};

class FilterPanel extends React.Component<Props, States> {
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
    const itemToRemove = filterInputState.find(
      value => Object.keys(value).toString() === filter.name
    );
    setFilterInputState(
      null,
      Object.keys(itemToRemove).toString(),
      filter.operator
    );
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
    const { filters, selectedEntity, changeFilter } = this.props;
    const selectedFilter: any = filters[index];
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

  render() {
    const {
      selectedEntity,
      attributes,
      filters,
      operators,
      selectedValues,
      availableValues,
      filterInputState,
      setFilterInputState,
    } = this.props;
    const entityName = attrTabValue[selectedEntity];
    const cards = attributes.reduce((acc, current) => {
      if (current.cardinality < 15 && current.cardinality !== null) {
        acc.push(current.name);
      }
      return acc;
    }, []);

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
                {filter.operator && (
                  <ValueSelect
                    setFilterInputState={setFilterInputState}
                    filterInputState={filterInputState}
                    attributes={attributes}
                    placeholder={`Select Value`}
                    filter={filter.name}
                    selectedValues={selectedValues}
                    availableValues={availableValues}
                    onChange={value => this.onValueChange(value)}
                    filterOperator={filter.operator}
                    InputProps={{ disableUnderline: true }}
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
          <AddFilterButton onClick={this.onAddFilter}>
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
  selectedEntity: getEntity(state),
  attributes: getAttributes(state),
  filters: getSelectedFilters(state),
  availableValues: getAvailableValues(state),
  selectedValues: getSelectedValues(state),
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
