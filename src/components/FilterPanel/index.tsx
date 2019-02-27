import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import {
  getEntity,
  getAttributes,
  getSelectedFilters,
  getOperators,
} from '../../reducers/app/selectors';
import {
  addFilterAction,
  removeFilterAction,
  changeFilterAction,
} from '../../reducers/app/actions';
import FilterSelect from '../FilterSelect';
import FilterInput from '../FilterInput';

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

const AndBlock = styled.div`
  color: #4a4a4a;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 400;
  padding-right: 10px;
  padding-left: 10px;
`;

const attrTabValue = {
  blocks: 'block',
  operations: 'operation',
  accounts: 'account',
};

type Props = {
  selectedEntity: string;
  attributes: any[];
  filters: object[];
  operators: object[];
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

  onRemoveFilter = index => {
    const { removeFilter, selectedEntity } = this.props;
    removeFilter(selectedEntity, index);
  };

  onFilterNameChange = (val, index) => {
    const { filters, selectedEntity, changeFilter } = this.props;
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

  generateFilter = filter => {
    const { attributes } = this.props;
    const attr = attributes.map(attr => attr);
    const cards = attr.reduce((acc, current) => {
      if (current.cardinality < 15) {
        acc.push(current.name);
      }
      return acc;
    }, []);
    console.log(cards);
    if (!filter.operator) {
      return;
    } else if (filter.operator === 'ISNULL') {
      return;
    } else if (filter.operator === 'BETWEEN' || filter.operator === 'IN') {
      return (
        <React.Fragment>
          <HR />
          <FilterInput
            InputProps={{ disableUnderline: true }}
            placeholder={`e.g. 123456`}
          />
          <HR />
          <AndBlock>and</AndBlock>
          <HR />
          <FilterInput
            InputProps={{ disableUnderline: true }}
            placeholder={`e.g. 123456`}
          />
        </React.Fragment>
      );
    } else if (
      filter.operator !== 'ISNULL' &&
      filter.operator !== 'BETWEEN' &&
      filter.operator !== 'IN' &&
      cards.includes(filter.name)
    ) {
      return (
        <React.Fragment>
          <FilterInput />
          dropdown
        </React.Fragment>
      );
    } else {
      return <FilterInput />;
    }
  };

  render() {
    const { selectedEntity, attributes, filters, operators } = this.props;
    const entityName = attrTabValue[selectedEntity];
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
                {this.generateFilter(filter)}
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
  operators: getOperators(state),
});

const mapDispatchToProps = dispatch => ({
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
