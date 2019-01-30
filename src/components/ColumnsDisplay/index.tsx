import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getTab, getColumns } from '../../reducers/app/selectors';
import { setColumns } from '../../reducers/app/thunks';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import getColumnData from 'src/utils/getColumns';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DragIcon from '@material-ui/icons/DragHandle';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

const Container = styled.div`
  display: flex;
  border: 1px solid #d8d8d8;
  border-radius: 5px;
`;

const ButtonShell = styled(Button)`
  position: relative;
  width: 140px;
  height: 52px;
  border: 1px solid #d8d8d8;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
`;

const NestedTitle = styled.div`
  outline: none;
  display: flex;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 31px;
  color: #9b9b9b;
  font-family: Roboto-Medium;
  font-size: 16px;
  font-weight: 500;
  height: 19px;
  letter-spacing: 0;
  width: 333px;
`;

const DraggableIcon = styled(DragIcon)`
  float: right;
  margin-left: 25px;
  color: #d8d8d8;
`;

const ButtonContainer = styled.span`
  display: flex;
  float: right;
  margin: 4px 20px 15px 10px !important;
`;

const ArrowIcon = styled(KeyboardArrowDown)`
  color: #56c2d9;
  margin-left: 7px;
`;

const SubmitButton = styled(Button)`
  display: flex;
  background: #56c2d9 !important;
  border-radius: 5px 5px 5px 5px;
  height: 42px;
  width: 113px;
  color: #ffffff !important;
  font-family: Roboto-Bold;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2.43px;
  text-align: center;
  width: 113px;
`;
const CancelButton = styled(Button)`
  display: flex;
  color: #56c2d9 !important;
  border-radius: 5px 5px 5px 5px;
  height: 42px;
  width: 113px;
  font-family: Roboto-Bold;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2.43px;
  text-align: center;
  width: 113px;
  margin-right: 6px !important;
`;

const HR = styled.hr`
  border-color: #d8d8d8 !important;
  border-style: solid;
  margin-top: 10px;
`;

const styles = () => ({
  checkbox: {
    '&$checked': {
      color: '#56c2d9',
    },
  },
  checked: {},
});

interface SelectedColumnsData {
  dataIndex: string;
  title: string;
  key: string;
}

interface Props {
  selectedTab: string;
  setColumns(category: string, items: any[]);
  selectedColumns: any[];
  classes?: any;
}

interface States {
  selected: any[];
  anchorEl: boolean;
}

class ColumnDisplay extends React.Component<Props, States> {
  state = {
    selected: [],
    anchorEl: null,
  };

  componentDidMount() {
    const { selectedColumns } = this.props;
    this.setState({
      selected: [...selectedColumns],
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selectedColumns !== this.state.selected) {
      this.setState({
        selected: [...nextProps.selectedColumns],
      });
    }
  }

  handleSubmit = event => {
    const { selected } = this.state;
    const { selectedTab, setColumns, selectedColumns } = this.props;
    event.preventDefault();
    this.setState({ anchorEl: null });
    setColumns(selectedTab, selected);
  };

  handleChange = (name: SelectedColumnsData) => event => {
    const { selectedTab } = this.props;
    const { selected } = this.state;
    const positionInArray = selected.findIndex(
      selected => selected.dataIndex === name.dataIndex
    );
    if (positionInArray === -1) {
      this.setState({
        selected: [...selected, name],
      });
    } else {
      selected.splice(positionInArray, 1);
      this.setState({
        selected: [...selected],
      });
    }
    setColumns(selectedTab, selected);
  };

  cancelChange = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { selectedTab, selectedColumns, classes } = this.props;
    const { anchorEl, selected } = this.state;
    let tab;
    switch (selectedTab) {
      case 'blocks':
        tab = 'blocks';
        break;
      case 'operations':
        tab = 'operations';
        break;
      case 'accounts':
        tab = 'accounts';
        break;
    }
    const selectedDataIndex = selected.map(selected => {
      return selected.dataIndex;
    });

    return (
      <Container>
        <ButtonShell
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Columns ({selectedColumns.length})
          <ArrowIcon />
        </ButtonShell>
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}>
          <NestedTitle>Select Up to 6 Columns to Display</NestedTitle>
          {getColumnData(tab).map(name => (
            <MenuItem
              onClick={this.handleChange(name)}
              key={name.key}
              value={name.dataIndex}
            >
              <Checkbox
                classes={{ root: classes.checkbox, checked: classes.checked }}
                disableRipple={true}
                checked={selectedDataIndex.indexOf(name.dataIndex) > -1}
              />
              <ListItemText primary={name.title} />
              <DraggableIcon />
            </MenuItem>
          ))}
          <HR />
          <ButtonContainer>
            <CancelButton onClick={this.cancelChange}>Cancel</CancelButton>
            <SubmitButton onClick={this.handleSubmit} variant="contained">
              Done
            </SubmitButton>
          </ButtonContainer>
        </Menu>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  selectedTab: getTab(state),
  selectedColumns: getColumns(state),
});

const mapDispatchToProps = dispatch => ({
  setColumns: (category: string, items: any[]) =>
    dispatch(setColumns(category, items)),
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ColumnDisplay);
