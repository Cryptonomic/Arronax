import * as React from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

const Container = styled.div``;

const HR = styled.div`
  width: 1px;
  background-color: #ecedef;
`;

const AndBlock = styled.div`
  color: #4a4a4a;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 400;
  padding-right: 10px;
  padding-left: 10px;
`;

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
  filter: string;
  filterOperator: string;
  inputProps?: object;
  InputProps?: object;
  placeholder?: string;
  filterInputState: any[];
  setFilterInputState: (
    value: string,
    filterName: string,
    filterOperator: string
  ) => void;
}

class ValueInput extends React.Component<Props> {
  handleInputChange = event => {
    const { filter, setFilterInputState, filterOperator } = this.props;
    setFilterInputState(event.target.value, filter, filterOperator);
  };

  handleBetweenChange = event => {
    const { filter, setFilterInputState, filterOperator } = this.props;
    setFilterInputState(`-${event.target.value}`, filter, filterOperator);
  };

  render() {
    const {
      InputProps,
      inputProps,
      filterOperator,
      filter,
      filterInputState,
    } = this.props;

    const findValue = filterInputState.find(
      value => Object.keys(value).toString() === filter
    );
    const currentValue = findValue ? Object.values(findValue).toString() : null;
    const betweenValue = findValue ? Object.values(findValue).toString() : null;
    const split = findValue ? betweenValue.split('-') : null;
    const firstBetweenValue = split ? split[0] : null;
    const secondBetweenValue = split ? split[1] : null;
    let input;
    if (filterOperator === 'BETWEEN' || filterOperator === 'IN') {
      input = (
        <React.Fragment>
          <Container>
            <TextInput
              value={firstBetweenValue ? firstBetweenValue : ''}
              inputProps={inputProps}
              InputProps={InputProps}
              placeholder={`Insert Value`}
              onChange={event => this.handleInputChange(event)}
            />
          </Container>
          <HR />
          <AndBlock>and</AndBlock>
          <HR />
          <Container>
            <TextInput
              disabled={firstBetweenValue ? false : true}
              value={secondBetweenValue ? secondBetweenValue : ''}
              inputProps={inputProps}
              InputProps={InputProps}
              placeholder={`Insert Value`}
              onChange={event => this.handleBetweenChange(event)}
            />
          </Container>
        </React.Fragment>
      );
    } else if (filterOperator === 'ISNULL') {
      input = null;
    } else {
      input = (
        <Container>
          <TextInput
            value={currentValue ? currentValue : ''}
            inputProps={inputProps}
            InputProps={InputProps}
            placeholder={`Insert Value`}
            onChange={event => this.handleInputChange(event)}
          />
        </Container>
      );
    }
    return <React.Fragment>{input}</React.Fragment>;
  }
}

export default ValueInput;
