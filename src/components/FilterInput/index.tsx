import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { setValueAction } from '../../reducers/app/actions';
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
  filter?: object;
  inputProps?: object;
  InputProps?: object;
  placeholder?: string;
  filterInputVal: object[];
  setFilterInput: (
    val: string,
    filterName: string,
    filterOperator: string
  ) => void;
  setValue: (value: object) => void;
}

class FilterInput extends React.Component<Props> {
  state = {
    value: '',
  };
  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleClick = (event, filter) => {
    // handle case for clicking on trashcan
    console.log(event.target.className);
    const { value } = this.state;
    const { setFilterInput } = this.props;
    const newFilter = filter.name.toString();
    const filterOperator = filter.operator.toString();
    const className = event.target.className;
    if (
      className.includes('ResetButton') ||
      className.includes('RunButton') ||
      className.includes('MuiInputBase-input-35')
    ) {
      return;
    } else {
      setFilterInput(value, newFilter, filterOperator);
    }
  };

  render() {
    const {
      placeholder,
      InputProps,
      inputProps,
      filter,
      filterInputVal,
    } = this.props;
    return (
      <Container>
        <ClickAwayListener
          onClickAway={event => this.handleClick(event, filter)}
        >
          <TextInput
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

const mapDispatchToProps = dispatch => ({
  setValue: (value: object) => dispatch(setValueAction(value)),
});

export default connect(
  null,
  mapDispatchToProps
)(FilterInput);
