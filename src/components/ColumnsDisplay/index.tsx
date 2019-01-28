import * as React from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import getDetailsColumns from 'src/utils/getDetailsColumns';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const Container = styled.div`
  position: relative;
  width: 107px;
  height: 52px;
  border: 1px solid #aaa;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
`;

class ColumnDisplay extends React.Component {
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

    // set state back to current state before manipulation
    this.setState({
      selected: [],
    });
  };

  handleClick = event => {
    const { anchorEl } = this.state;
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { anchorEl } = this.state;

    const { selected } = this.state;
    console.log(selected);
    return (
      <Container>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Open Menu
        </Button>
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}>
          {getDetailsColumns('blocks').map(name => (
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
            </MenuItem>
          ))}
          <button>Cancel</button>
          <button>Submit</button>
        </Menu>
        {/* <Select multiple value={selected} onChange={this.handleChange}>
            {' '}
            {getDetailsColumns('blocks').map(name => (
              <MenuItem key={name.key} value={name.dataIndex}>
                <Checkbox
                  disableRipple={true}
                  checked={selected.indexOf(name.dataIndex) > -1}
                />
                <ListItemText primary={name.title} />
              </MenuItem>
            ))}
            <button>Done</button>
            <button onClick={this.cancelChange}>Cancel</button>
          </Select> */}
      </Container>
    );
  }
}

export default ColumnDisplay;
