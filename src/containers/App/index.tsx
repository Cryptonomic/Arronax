import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  getAttributes,
  getLoading,
  getNetwork,
  getEntity,
  getItems,
} from '../../reducers/app/selectors';
import {
  changeNetwork,
  fetchItemsAction,
  setColumns,
  fetchAttributes,
} from '../../reducers/app/thunks';
import { setTabAction } from '../../reducers/app/actions';
import Header from 'components/Header';
import FilterTool from 'components/FilterTool';
import SettingsPanel from 'components/SettingsPanel';
import Footer from 'components/Footer';
import CustomTable from '../CustomTable';

const Container = styled.div`
  padding: 50px 0;
  min-height: calc(100vh - 405px);
`;

const MainContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  opacity: ${({ isDark }) => (isDark ? 0.74 : 1)};
  padding: 25px 30px 0 30px;
`;

const TabsWrapper = styled(Tabs)`
  &&& {
    padding: 0 30px;
    width: 100%;
    span[class*='MuiPrivateTabIndicator-root'] {
      background-color: #a6dfe2;
      height: 5px;
    }
  }
`;

const TabContainer = styled.div`
  padding: 0px 30px;
  position: relative;
  width: 100%;
`;

const TabItem = styled.div`
  color: #2e3b6c;
  font-size: 24px;
  letter-spacing: 3px;
  font-weight: ${({ isSelected }) => (isSelected ? 'normal' : 300)};
  margin-right: 133px;
  margin-bottom: 7px;
  cursor: pointer;
`;

const FilterExTxt = styled.span`
  font-size: 18px;
  color: #9b9b9b;
  margin-left: 21px;
`;

const tabsArray = [
  {
    value: 'blocks',
    title: 'Blocks',
  },
  {
    value: 'operations',
    title: 'Operations',
  },
  {
    value: 'accounts',
    title: 'Accounts',
  },
];

export interface Props {
  isLoading: boolean;
  network: string;
  selectedEntity: string;
  items: object[];
  attributes: object[];
  changeNetwork(network: string): void;
  changeTab: (type: string) => void;
  fetchItems: (type: string) => void;
  setColumns(entity: string, items: object[]): void;
  fetchAttributes: () => void;
}

export interface States {
  isFilterCollapse: boolean;
}

class Arronax extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isFilterCollapse: false,
    };
  }

  componentDidMount() {
    const {
      fetchItems,
      selectedEntity,
      attributes,
      fetchAttributes,
    } = this.props;
    fetchItems(selectedEntity);
    if (attributes.length === 0) {
      fetchAttributes();
    }
  }

  onChangeNetwork = event => {
    const { changeNetwork } = this.props;
    changeNetwork(event.target.value);
  };

  onChangeTab = async (value: string) => {
    const { changeTab, fetchItems, setColumns, fetchAttributes } = this.props;
    const columns = await this.findTab(value);
    await changeTab(value);
    await fetchAttributes();
    await setColumns(value, columns);
    await fetchItems(value);
  };

  findTab = (value: string) => {
    switch (value) {
      case 'blocks':
        return [
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Level',
            entity: 'blocks',
            keyType: 'UniqueKey',
            name: 'level',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Proto',
            entity: 'blocks',
            keyType: 'UniqueKey',
            name: 'proto',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Predecessor',
            entity: 'blocks',
            keyType: 'UniqueKey',
            name: 'predecessor',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Timestamp',
            entity: 'blocks',
            keyType: 'UniqueKey',
            name: 'timestamp',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Validation pass',
            entity: 'blocks',
            keyType: 'UniqueKey',
            name: 'validation_pass',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Fitness',
            entity: 'blocks',
            keyType: 'UniqueKey',
            name: 'fitness',
          },
        ];
      case 'operations':
        return [
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Kind',
            entity: 'operations',
            keyType: 'UniqueKey',
            name: 'kind',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Operation id',
            entity: 'operations',
            keyType: 'UniqueKey',
            name: 'operation_id',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Operation Group Hash',
            entity: 'operations',
            keyType: 'UniqueKey',
            name: 'operation_group_hash',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Level',
            entity: 'operations',
            keyType: 'UniqueKey',
            name: 'level',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Delegate',
            entity: 'operations',
            keyType: 'UniqueKey',
            name: 'delegate',
          },
          {
            cardinality: null,
            dataType: 'Int',
            displayName: 'Slots',
            entity: 'operations',
            keyType: 'UniqueKey',
            name: 'slots',
          },
        ];
      case 'accounts':
        return [
          {
            cardinality: 13628,
            dataType: 'String',
            displayName: 'Account id',
            entity: 'accounts',
            keyType: 'UniqueKey',
            name: 'account_id',
          },
          {
            cardinality: 1841,
            dataType: 'String',
            displayName: 'Block id',
            entity: 'accounts',
            keyType: 'NonKey',
            name: 'block_id',
          },
          {
            cardinality: 11813,
            dataType: 'String',
            displayName: 'Manager',
            entity: 'accounts',
            keyType: 'NonKey',
            name: 'manager',
          },
          {
            cardinality: 2,
            dataType: 'Boolean',
            displayName: 'Spendable',
            entity: 'accounts',
            keyType: 'NonKey',
            name: 'spendable',
          },
          {
            cardinality: 2,
            dataType: 'Boolean',
            displayName: 'Delegate setable',
            entity: 'accounts',
            keyType: 'NonKey',
            name: 'delegate_setable',
          },
          {
            cardinality: 76,
            dataType: 'String',
            displayName: 'Delegate value',
            entity: 'accounts',
            keyType: 'NonKey',
            name: 'delegate_value',
          },
        ];
    }
  };

  onFilterCollapse = () => {
    const { isFilterCollapse } = this.state;
    this.setState({ isFilterCollapse: !isFilterCollapse });
  };

  onCloseFilter = () => {
    this.setState({ isFilterCollapse: false });
  };

  render() {
    const { isLoading, network, selectedEntity, items } = this.props;
    const { isFilterCollapse } = this.state;
    return (
      <MainContainer>
        <Header network={network} onChangeNetwork={this.onChangeNetwork} />
        <Container>
          <TabsWrapper value={selectedEntity}>
            {tabsArray.map((item, index) => (
              <Tab
                key={index}
                value={item.value}
                component={() => (
                  <TabItem
                    isSelected={selectedEntity === item.value}
                    onClick={() => this.onChangeTab(item.value)}
                  >
                    {item.title}
                  </TabItem>
                )}
              />
            ))}
          </TabsWrapper>
          <SettingsPanel
            selectedEntity={selectedEntity}
            isCollapse={isFilterCollapse}
            onClose={this.onCloseFilter}
          />
          <FilterHeader isDark={isFilterCollapse}>
            <FilterTool value={2} onCollapse={this.onFilterCollapse} />
            <FilterExTxt>
              e.g. What were blocks where baked by Foudation Baker 1 in the past
              24 hours?
            </FilterExTxt>
          </FilterHeader>
          <TabContainer component="div">
            <CustomTable items={items} entity={selectedEntity} />
          </TabContainer>
        </Container>
        <Footer />
        {isLoading && (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        )}
      </MainContainer>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isLoading: getLoading(state),
  network: getNetwork(state),
  selectedEntity: getEntity(state),
  items: getItems(state),
  attributes: getAttributes(state),
});

const mapDispatchToProps = dispatch => ({
  setColumns: (entity: string, items: object[]) =>
    dispatch(setColumns(entity, items)),
  changeNetwork: (network: string) => dispatch(changeNetwork(network)),
  changeTab: (type: string) => dispatch(setTabAction(type)),
  fetchItems: (type: string) => dispatch(fetchItemsAction(type)),
  fetchAttributes: () => dispatch(fetchAttributes()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
