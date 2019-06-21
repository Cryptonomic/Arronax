import React from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import { AttributeDefinition } from 'conseiljs';
import { ArronaxIcon } from '../ArronaxIcon';
import {
  getAggregations,
  getAggFunctions,
  getColumns,
  getEntity
} from '../../reducers/app/selectors';
import {
  addAggregationAction,
  removeAggregationAction,
  changeAggregationAction,
  initAggregationAction
} from '../../reducers/app/actions';
import FilterSelect from '../FilterSelect';
import { Aggregation } from '../../types';
import { getOperatorType } from '../../utils/general';

import {
  Container,
  MainContainer,
  AggItemContainer,
  AggItemGr,
  AddAggFooter,
  AddButton,
  PlusIconWrapper,
  HR,
  RefreshIcon,
  ButtonContainer,
  RunButton,
  ResetButton
} from './style';

type Props = {
  selectedEntity: string;
  columns: AttributeDefinition[];
  aggregations: Aggregation[];
  aggFunctions: any;
  swipeRef: any;
  addAggregation: (entity: string) => void;
  removeAggregation: (entity: string, index: number) => void;
  changeAggregation: (entity: string, aggregation: Aggregation, index: number) => void;
  resetAggregations: () => void;
  onSubmit: () => void;
};

class AggregationPanel extends React.Component<Props, {}> {
  onAddAggregation = async () => {
    const { addAggregation, selectedEntity, swipeRef } = this.props;
    await addAggregation(selectedEntity);
    swipeRef.updateHeight();
  };

  onRemoveAggregation = (index: number) => {
    const {
      removeAggregation,
      selectedEntity,
    } = this.props;
    removeAggregation(selectedEntity, index);
  };

  onAggregationNameChange = (attr: any, index: number) => {
    const {
      selectedEntity,
      changeAggregation,
      aggFunctions
    } = this.props;

    const type = getOperatorType(attr.dataType);
    const aggregation = {
      name: attr.name,
      type,
      function: aggFunctions[type][0].name
    };
    changeAggregation(selectedEntity, aggregation, index);
  };

  onFunctionChange = (func: any, index: number) => {
    const {
      aggregations,
      selectedEntity,
      changeAggregation,
    } = this.props;

    const aggregation: any = {
      ...aggregations[index],
      function: func.name
    };
    changeAggregation(selectedEntity, aggregation, index);
  };


  onResetAggregations = () => {
    const { resetAggregations } = this.props;
    resetAggregations();
  };

  render() {
    const {
      selectedEntity,
      columns,
      aggregations,
      aggFunctions,
      onSubmit
    } = this.props;
    const entityName = selectedEntity.replace(/_/gi, ' ').slice(0, -1);

    const aggLength = aggregations.length;
    const lastAgg: Aggregation = aggLength > 0 ? aggregations[aggLength - 1] : {name: '', type: ''};
    let disableAddAgg = aggLength > 0 && !lastAgg.function;

    return (
      <Container>
        <MainContainer>
          {aggregations.map((agg: Aggregation, index) => {
            return (
              <AggItemContainer key={index}>
                <AggItemGr>
                  <FilterSelect
                    value={agg.name}
                    placeholder={`Select ${entityName} Attribute`}
                    items={columns}
                    onChange={attr => this.onAggregationNameChange(attr, index)}
                  />
                  {agg.name && <HR />}
                  {agg.name && (
                    <FilterSelect
                      value={agg.function}
                      placeholder='Select Function'
                      items={aggFunctions[agg.type]}
                      onChange={func =>
                        this.onFunctionChange(func, index)
                      }
                    />
                  )}
                </AggItemGr>
                <IconButton
                  aria-label="Delete"
                  onClick={() => this.onRemoveAggregation(index)}
                >
                  <ArronaxIcon size="37px" color="#d8d8d8" iconName="icon-delete" />
                </IconButton>
              </AggItemContainer>
            );
          })}

          <AddAggFooter isFilters={aggregations.length > 0}>
            <AddButton
              onClick={this.onAddAggregation}
              isDisabled={disableAddAgg}
            >
              <PlusIconWrapper />
              Add Aggregation
            </AddButton>
          </AddAggFooter>
        </MainContainer>
        <ButtonContainer>
          <ResetButton onClick={this.onResetAggregations}>
            <RefreshIcon size="23px" color="#56c2d9" iconName="icon-reset"/>
            Reset
          </ResetButton>
          <RunButton onClick={onSubmit}>
            Run
          </RunButton>
        </ButtonContainer>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  aggregations: getAggregations(state),
  aggFunctions: getAggFunctions(state),
  columns: getColumns(state),
  selectedEntity: getEntity(state)
});

const mapDispatchToProps = (dispatch: any) => ({
  addAggregation: (entity: string) => dispatch(addAggregationAction(entity)),
  removeAggregation: (entity: string, index: number) =>
    dispatch(removeAggregationAction(entity, index)),
  changeAggregation: (entity: string, aggregation: Aggregation, index: number) =>
    dispatch(changeAggregationAction(entity, aggregation, index)),
  resetAggregations: (entity: string) =>
    dispatch(initAggregationAction(entity)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AggregationPanel);
