import * as React from 'react';
import { connect } from 'react-redux';
import { getTab } from '../../reducers/app/selectors';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import getDetailsColumns from 'src/utils/getDetailsColumns';
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

export interface Props {
  selectedTab: string;
}

class ColumnDisplay extends React.Component<Props> {
  state = {
    selected: [],
    anchorEl: null,
  };

  handleChange = name => event => {
    const { selected } = this.state;
    const positionInArray = selected.indexOf(name.dataIndex);
    if (positionInArray === -1) {
      this.setState({
        selected: [...selected, name.dataIndex],
      });
    } else {
      selected.splice(positionInArray, 1);
      this.setState({
        selected: [...selected],
      });
    }
  };

  cancelChange = name => {
    console.log('cancelling');
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    const { anchorEl } = this.state;
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { selectedTab } = this.props;
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
    const { anchorEl, selected } = this.state;
    return (
      <Container>
        <ButtonShell
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Columns ({selected.length})
          <ArrowIcon />
        </ButtonShell>
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}>
          <NestedTitle>Select Up to 6 Columns to Display</NestedTitle>
          {getDetailsColumns(tab).map(name => (
            <MenuItem
              onClick={this.handleChange(name)}
              key={name.key}
              value={name.dataIndex}
            >
              <Checkbox
                disableRipple={true}
                checked={selected.indexOf(name.dataIndex) > -1}
              />
              <ListItemText primary={name.title} />
              <DraggableIcon />
            </MenuItem>
          ))}
          <HR />
          <ButtonContainer>
            <CancelButton onClick={this.cancelChange}>Cancel</CancelButton>
            <SubmitButton variant="contained">Done</SubmitButton>
          </ButtonContainer>
        </Menu>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  selectedTab: getTab(state),
});

export default connect(
  mapStateToProps,
  null
)(ColumnDisplay);
