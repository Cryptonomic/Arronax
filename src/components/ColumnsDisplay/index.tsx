import * as React from 'react';
import { connect } from 'react-redux';
import { getTab, getColumns } from '../../reducers/app/selectors';
import { setColumns } from '../../reducers/app/thunks';
import styled from 'styled-components';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import getColumnData from 'src/utils/getColumns';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
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
  cursor: default;
  flex-shrink: 0;
  outline: none;
  margin-top: 15px;
  margin-bottom: 12px;
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
  flex-shrink: 0;
  display: flex;
  float: right;
  margin: 4px 20px 15px 10px !important;
`;

const ArrowIcon = styled(KeyboardArrowDown)`
  color: #56c2d9;
  margin-left: 7px;
`;

const MenuContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const MenuContents = styled.div`
  height: 390px;
  flex: 1;
  outline: none;
  overflow: auto;
  min-height: 1.25em;
  padding-top: 10px;
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
  margin-top: 0px;
  outline: none;
`;

const FadeOut = styled.span`
  position: absolute;
  width: 100%;
  height: 20px;
`;

const FadeTop = styled(FadeOut)`
  margin-top: -20px;
  background-image: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(255, 255, 255, 1) 80%
  );
  z-index: 10;
`;

const FadeBottom = styled.div`
  overflow: visible;
  pointer-events: none;
  outline: none;
  position: absolute;
  width: 100%;
  margin-top: -55px;
  padding-top: 10px;
  height: 55px;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%
  );
  z-index: 10;
`;

const styles = {
  menuItem: {
    '&&&': {
      backgroundColor: 'transparent',
    },
  },
  removeSelector: {
    '&&&': {
      cursor: 'default',
    },
  },
  checkbox: {
    '&$checked': {
      color: '#56c2d9',
    },
  },
  checked: {},
};

interface SelectedColumnsData {
  dataIndex: string;
  title: string;
  key: string;
}

type Props = {
  selectedTab: string;
  setColumns: (category: string, items: object[]) => void;
  selectedColumns: object[];
  classes: any;
};

type States = {
  selected: object[];
  anchorEl: boolean;
  fadeBottom: boolean;
};

class ColumnDisplay extends React.Component<Props, States> {
  state = {
    selected: [],
    anchorEl: null,
    fadeBottom: true,
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
    const { selectedTab, setColumns } = this.props;
    event.preventDefault();
    this.setState({ anchorEl: null });
    setColumns(selectedTab, selected);
  };

  handleChange = (name: SelectedColumnsData) => event => {
    const { selected } = this.state;
    const positionInArray = selected.findIndex(
      selected => selected.dataIndex === name.dataIndex
    );
    if (positionInArray === -1 && selected.length <= 5) {
      this.setState({
        selected: [...selected, name],
      });
    } else if (positionInArray > -1 && selected.length <= 6) {
      selected.splice(positionInArray, 1);
      this.setState({
        selected: [...selected],
      });
    }
  };

  onClickAway = event => {
    const { selectedColumns } = this.props;
    if (
      event.target.tagName === 'DIV' &&
      !event.target.className.includes('MuiMenu-paper-51') &&
      !event.target.className.includes('MuiListItemText-root-222') &&
      !event.target.className.includes(
        'ColumnsDisplay__NestedTitle-jjrws9-2'
      ) &&
      !event.target.className.includes('ColumnsDisplay__MenuContents-jjrws9-7')
    ) {
      this.setState({ anchorEl: null });
      this.setState({ selected: [...selectedColumns] });
    }
  };

  cancelChange = () => {
    const { selectedColumns } = this.props;
    this.setState({ anchorEl: null });
    this.setState({ selected: [...selectedColumns] });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleScroll = event => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      this.setState({ fadeBottom: false });
    } else {
      this.setState({ fadeBottom: true });
    }
  };

  render() {
    const { selectedTab, selectedColumns, classes } = this.props;
    const { anchorEl, fadeBottom, selected } = this.state;
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
        <MenuContainer>
          <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}>
            <NestedTitle>Select Up to 6 Columns to Display</NestedTitle>
            <MenuContents onScroll={this.handleScroll}>
              <FadeTop />
              {getColumnData(tab).map(name => (
                <MenuItem
                  className={
                    selected.length >= 6 &&
                    selectedDataIndex.indexOf(name.dataIndex) === -1
                      ? classes.removeSelector
                      : null
                  }
                  classes={{ root: classes.menuItem }}
                  onClick={this.handleChange(name)}
                  key={name.key}
                  value={name.dataIndex}
                >
                  <Checkbox
                    className={
                      selected.length >= 6 &&
                      selectedDataIndex.indexOf(name.dataIndex) === -1
                        ? classes.removeSelector
                        : null
                    }
                    classes={{
                      root: classes.checkbox,
                      checked: classes.checked,
                    }}
                    disableRipple={true}
                    checked={selectedDataIndex.indexOf(name.dataIndex) > -1}
                  />
                  <ListItemText primary={name.title} />
                  <DraggableIcon />
                </MenuItem>
              ))}
            </MenuContents>
            {fadeBottom && <FadeBottom />}
            <HR />{' '}
            <ClickAwayListener onClickAway={this.onClickAway}>
              <ButtonContainer>
                <CancelButton onClick={this.cancelChange}>Cancel</CancelButton>
                <SubmitButton onClick={this.handleSubmit} variant="contained">
                  Done
                </SubmitButton>
              </ButtonContainer>
            </ClickAwayListener>
          </Menu>
        </MenuContainer>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  selectedTab: getTab(state),
  selectedColumns: getColumns(state),
});

const mapDispatchToProps = dispatch => ({
  setColumns: (category: string, items: object[]) =>
    dispatch(setColumns(category, items)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ColumnDisplay));
