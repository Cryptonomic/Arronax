import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  getLoading,
  getNetwork,
  getTab,
  getItems,
} from '../../reducers/app/selectors';
import {
  changeNetwork,
  fetchItemsAction,
  setColumns,
} from '../../reducers/app/thunks';
import { setTabAction } from '../../reducers/app/actions';
import Header from 'components/Header';
import FilterTool from 'components/FilterTool';
import FilterPanel from 'components/FilterPanel';
import Footer from 'components/Footer';
import CustomTable from 'components/CustomTable';

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
  selectedTab: string;
  items: object[];
  changeNetwork(network: string): void;
  changeTab: (type: string) => void;
  fetchItems: (type: string) => void;
  setColumns(category: string, items: object[]): void;
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

  componentDidMount = () => {
    const { fetchItems, selectedTab } = this.props;
    fetchItems(selectedTab);
  };

  onChangeNetwork = event => {
    const { changeNetwork } = this.props;
    changeNetwork(event.target.value);
  };

  onChangeTab = async (value: string) => {
    const { changeTab, fetchItems, setColumns } = this.props;
    const columns = await this.findTab(value);
    await changeTab(value);
    await setColumns(value, columns);
    await fetchItems(value);
  };

  findTab = (value: string) => {
    switch (value) {
      case 'blocks':
        return [
          { title: 'Level', dataIndex: 'level', key: 'level' },
          { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
          { title: 'Block Hash', dataIndex: 'hash', key: 'blockHash' },
          {
            title: 'Predecessor Hash',
            dataIndex: 'predecessor',
            key: 'predecessor',
          },
          {
            title: 'Operations Hash',
            dataIndex: 'operationsHash',
            key: 'operationsHash',
          },
        ];
      case 'operations':
        return [
          { title: 'Kind', dataIndex: 'kind', key: 'kind' },
          { title: 'Source', dataIndex: 'source', key: 'source' },
          {
            title: 'Destination',
            dataIndex: 'destination',
            key: 'destination',
          },
          { title: 'Amount', dataIndex: 'amount', key: 'amount' },
          { title: 'Fee', dataIndex: 'fee', key: 'fee' },
        ];
      case 'accounts':
        return [
          { title: 'Account ID', dataIndex: 'accountId', key: 'accountId' },
          { title: 'Manager', dataIndex: 'manager', key: 'manager' },
          {
            title: 'Spendable',
            dataIndex: 'spendable',
            key: 'spendable',
            isIcon: true,
          },
          {
            title: 'Delegatable',
            dataIndex: 'delegateSetable',
            key: 'delegateSetable',
            isIcon: true,
          },
          {
            title: 'Delegate',
            dataIndex: 'delegate',
            key: 'delegateValue',
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
    const { isLoading, network, selectedTab, items } = this.props;
    const { isFilterCollapse } = this.state;

    return (
      <MainContainer>
        <Header network={network} onChangeNetwork={this.onChangeNetwork} />
        <Container>
          <TabsWrapper value={selectedTab}>
            {tabsArray.map((item, index) => (
              <Tab
                key={index}
                value={item.value}
                component={() => (
                  <TabItem
                    isSelected={selectedTab === item.value}
                    onClick={() => this.onChangeTab(item.value)}
                  >
                    {item.title}
                  </TabItem>
                )}
              />
            ))}
          </TabsWrapper>
          <FilterPanel
            selectedTab={selectedTab}
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
            <CustomTable items={items} category={selectedTab} />
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
  selectedTab: getTab(state),
  items: getItems(state),
});

const mapDispatchToProps = dispatch => ({
  setColumns: (category: string, items: object[]) =>
    dispatch(setColumns(category, items)),
  changeNetwork: (network: string) => dispatch(changeNetwork(network)),
  changeTab: (type: string) => dispatch(setTabAction(type)),
  fetchItems: (type: string) => dispatch(fetchItemsAction(type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
