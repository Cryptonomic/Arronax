import * as React from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const Container = styled.div``;
const TextInput = styled(TextField)`
  margin-top: 17px !important;
  margin-left: 10px !important;
  color: #9b9b9b;
  font-size: 18px;
  font-weight: normal;
  height: 17px;
  letter-spacing: 0;
  line-height: 17px;
  width: 150px;
`;

interface Props {
  filterName: string;
  filterOperator: string;
  inputProps?: object;
  InputProps?: object;
  placeholder?: string;
  setFilterInput: (
    val: string,
    filterName: string,
    filterOperator: string
  ) => void;
}

class StartBetweenInput extends React.Component<Props> {
  state = {
    value: '',
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleClick = event => {
    const { value } = this.state;
    const { setFilterInput, filterName, filterOperator } = this.props;
    const className = event.target.className;
    if (!className.baseVal && className.baseVal !== '') {
      if (className.includes('RunButton')) {
        setFilterInput(value, filterName, filterOperator);
      }
    }
  };

  render() {
    const { placeholder, InputProps, inputProps } = this.props;
    const { value } = this.state;
    return (
      <Container>
        <ClickAwayListener onClickAway={event => this.handleClick(event)}>
          <TextInput
            key={value}
            value={value}
            inputProps={inputProps}
            InputProps={InputProps}
            placeholder={placeholder}
            onChange={event => this.handleChange(event)}
          />
        </ClickAwayListener>
      </Container>
    );
  }
}

export default StartBetweenInput;
