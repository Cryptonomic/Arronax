import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CustomTable from '../../components/CustomTable';

import { getItems, getTab } from '../../reducers/app/selectors';
import { fetchItemsAction } from '../../reducers/app/thunks';
import { setTabAction } from '../../reducers/app/actions';

const Container = styled.div`
  flex: 1;
  padding: 50px;
`;

const TabsWrapper = styled(Tabs)`

`;

const TabContainer = styled(Typography)`

`;

const TabWrapper = styled.div`

`;

const tabsArray = [
  {
    value: 'blocks',
    title: 'Blocks'
  },
  {
    value: 'operations',
    title: 'Operations'
  },
  {
    value: 'accounts',
    title: 'Accounts'
  }
];

interface Props {
    items: any[];
    selectedTab: string;
    fetchItems: (type: string) => void;
    changeTab: (type: string) => void
}

class DataPanel extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount = () => {
      const {fetchItems, selectedTab} = this.props;
      fetchItems(selectedTab);
    }

    onChangeTab = (event, value) => {
      const {changeTab, fetchItems} = this.props;
      changeTab(value);
      fetchItems(value);    
    }


    render() {
      const {selectedTab, items} = this.props;
      return (
        <Container>
          <TabsWrapper
            value={selectedTab}
            onChange={this.onChangeTab}
          >
            {tabsArray.map((item, index) => (
              <Tab
                key={index}
                value={item.value}
                component={() => <TabWrapper>{item.title}</TabWrapper>} />
            ))}
          </TabsWrapper>
          <TabContainer component="div">
            <CustomTable items={items} category={selectedTab} />
          </TabContainer>
        </Container>
          
      );
    }
}

const mapStateToProps = (state: any) => ({
  items: getItems(state),
  selectedTab: getTab(state)
});

const mapDispatchToProps = (dispatch) => ({
  fetchItems: (type: string) => dispatch(fetchItemsAction(type)),
  changeTab: (type: string) => dispatch(setTabAction(type))
  
});

export default connect(mapStateToProps, mapDispatchToProps)(DataPanel);
