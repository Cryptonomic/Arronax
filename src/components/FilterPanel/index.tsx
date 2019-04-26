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
  getOperators
} from '../../reducers/app/selectors';
import {
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
  values: Array<string>;
}

type Props = {
  availableValues: object;
  selectedEntity: string;
  attributes: any[];
  filters: Array<Filter>;
  operators: any;
  fetchValues: (value: string) => void;
  addFilter: (entity: string) => void;
  removeFilter: (entity: string, index: number) => void;
  changeFilter: (entity: string, filter: object, index: number) => void;
};


class FilterPanel extends React.Component<Props, {}> {
  onAddFilter = () => {
    const { addFilter, selectedEntity } = this.props;
    addFilter(selectedEntity);
  };

  onRemoveFilter = (index) => {
    const {
      removeFilter,
      selectedEntity,
    } = this.props;
    removeFilter(selectedEntity, index);
  };

  onFilterNameChange = (attr, index) => {
    const {
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
      name: attr.name,
      isCard,
      operatorType,
      operator: '',
      values: ['']
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
      operator: operator.name,
      values: ['']
    };
    changeFilter(selectedEntity, selectedFilter, index);
  };

  onFilterValueChange = (value, index, pos) => {
    const {
      filters,
      selectedEntity,
      changeFilter
    } = this.props;

    const selectedFilter: Filter = {...filters[index]};
    selectedFilter.values[pos] = value;
    changeFilter(selectedEntity, selectedFilter, index);
  };

  render() {
    const {
      selectedEntity,
      attributes,
      filters,
      operators,
      availableValues
    } = this.props;
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
                    placeholder='Select Operator'
                    items={operators[filter.operatorType]}
                    onChange={operator =>
                      this.onFilterOperatorChange(operator, index)
                    }
                  />
                )}
                {filter.operator && <HR />}
                {filter.operator && (filter.operator === 'EQ' ||  filter.operator === 'NOTEQ') &&
                  filter.isCard && (
                    <ValueSelect
                      placeholder='Select Value'
                      selectedValue={filter.values[0]}
                      values={availableValues[filter.name]}
                      onChange={value => this.onFilterValueChange(value, index, 0)}
                    />
                )}
                {filter.operator && !filter.isCard && (
                  <ValueInput
                    values={filter.values}
                    operator={filter.operator}
                    InputProps={{ disableUnderline: true }}
                    onChange={(value, pos) => this.onFilterValueChange(value, index, pos)}
                  />
                )}
              </FilterItemGr>
              <IconButton
                aria-label="Delete"
                onClick={() => this.onRemoveFilter(index)}
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
  operators: getOperators(state)
});

const mapDispatchToProps = dispatch => ({
  fetchValues: (value: string) => dispatch(fetchValues(value)),
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
