import * as React from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import getDetailsColumns from 'src/utils/getDetailsColumns';

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
  };

  handleChange = event => {
    const { selected } = this.state;
    const checked = [...event.target.value];
    const currentState = [...selected];
    this.setState({
      selected: [...checked],
    });
  };

  render() {
    const { selected } = this.state;
    return (
      <Container>
        <FormControl>
          <Select multiple value={selected} onChange={this.handleChange}>
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
          </Select>
        </FormControl>
      </Container>
    );
  }
}

export default ColumnDisplay;
