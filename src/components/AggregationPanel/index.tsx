import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
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
import { resetAggregations, setAggregationsThunk } from '../../reducers/app/thunks';
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

interface OwnProps {
  selectedEntity: string;
  columns: AttributeDefinition[];
  aggregations: Aggregation[];
  aggFunctions: any;
  swipeRef: any;
  setAggregations: (aggregations: Aggregation[]) => void;
  resetAggregations: () => void;
  onSubmit: () => void;
};

type Props = OwnProps & WithTranslation;

type States = {
  localAggs: Aggregation[];
  prevPropsAggs: Aggregation[];
};

class AggregationPanel extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      localAggs: [],
      prevPropsAggs: []
    };
  }

  static getDerivedStateFromProps(props: Props, state: States) {
    if (props.aggregations !== state.prevPropsAggs) {
      return {
        prevPropsAggs: props.aggregations,
        localAggs: props.aggregations
      };
    }
    return null;
  }

  onAddAggregation = async () => {
    const { swipeRef } = this.props;
    const { localAggs } = this.state;
    const newAgg: Aggregation = { field: '', type: '' };
    this.setState({localAggs: [...localAggs, newAgg]});
    setTimeout(() => {
      swipeRef.updateHeight();
    });
  };

  onRemoveAggregation = (index: number) => {
    const { localAggs } = this.state;
    localAggs.splice(index, 1);
    this.setState({localAggs});
  };

  onAggregationNameChange = (attr: any, index: number) => {
    const { aggFunctions } = this.props;
    const { localAggs } = this.state;
    const type = getOperatorType(attr.dataType);
    const aggregation = {
      field: attr.name,
      type,
      function: aggFunctions[type][0].name
    };
    localAggs[index] = aggregation;
    this.setState({localAggs});
  };

  onFunctionChange = (func: any, index: number) => {
    const { localAggs } = this.state;
    const aggregation: any = {
      ...localAggs[index],
      function: func.name
    };
    localAggs[index] = aggregation;
    this.setState({ localAggs });
  };

  onResetAggregations = () => {
    const { resetAggregations } = this.props;
    resetAggregations();
  };

  handleSubmit = async () => {
    const { localAggs } = this.state;
    const { setAggregations, onSubmit } = this.props;
    const realAggs = localAggs.filter(agg => !!agg.function);
    await setAggregations(realAggs);
    await onSubmit();
  };

  render() {
    const {
      selectedEntity,
      columns,
      aggFunctions,
      t
    } = this.props;
    const { localAggs } = this.state;
    const entityName = selectedEntity.replace(/_/gi, ' ').slice(0, -1);

    const aggLength = localAggs.length;
    const lastAgg: Aggregation = aggLength > 0 ? localAggs[aggLength - 1] : {field: '', type: ''};
    let disableAddAgg = aggLength > 0 && !lastAgg.function;

    return (
      <Container>
        <MainContainer>
          {localAggs.map((agg: Aggregation, index) => {
            return (
              <AggItemContainer key={index}>
                <AggItemGr>
                  <FilterSelect
                    value={agg.field}
                    placeholder={t('components.aggregationPanel.select_attribute', { entityName })}
                    items={columns}
                    type='attributes'
                    onChange={attr => this.onAggregationNameChange(attr, index)}
                  />
                  {agg.field && <HR />}
                  {agg.field && (
                    <FilterSelect
                      type='aggFunctions'
                      value={agg.function}
                      placeholder={t('components.aggregationPanel.select_function')}
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

          <AddAggFooter isFilters={localAggs.length > 0}>
            <AddButton
              onClick={this.onAddAggregation}
              isDisabled={disableAddAgg}
            >
              <PlusIconWrapper />
              {t('components.aggregationPanel.add_aggregation')}
            </AddButton>
          </AddAggFooter>
        </MainContainer>
        <ButtonContainer>
          <ResetButton onClick={this.onResetAggregations}>
            <RefreshIcon size="23px" color="#56c2d9" iconName="icon-reset"/>
            {t('general.verbs.reset')}
          </ResetButton>
          <RunButton onClick={this.handleSubmit}>
            {t('general.verbs.apply')}
          </RunButton>
        </ButtonContainer>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  aggregations: getAggregations(state),
  aggFunctions: getAggFunctions(state),
  columns: getColumns(state).concat().sort((a: any, b: any) => a['displayName'] > b['displayName']),
  selectedEntity: getEntity(state)
});

const mapDispatchToProps = (dispatch: any) => ({
  setAggregations: (aggregations: Aggregation[]) => dispatch(setAggregationsThunk(aggregations)),
  resetAggregations: () => dispatch(resetAggregations()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AggregationPanel));
