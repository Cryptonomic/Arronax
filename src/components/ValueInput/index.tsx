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
  margin-top: 10px !important;
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
  value: string;
  filterInputState: object;
  selectedEntity: string;
  onChange: (value: string) => void;
}

class ValueInput extends React.Component<Props> {
  handleInputChange = value => {
    const { onChange } = this.props;
    onChange(value);
  };
  handleBetweenChange = value => {
    const { onChange } = this.props;
    onChange(`-${value}`);
  };

  render() {
    const {
      InputProps,
      inputProps,
      filterOperator,
      filterInputState,
      selectedEntity,
      filter,
    } = this.props;
    let input;

    // // Find state/redux value that matches this filter
    const findStateValue = filterInputState[selectedEntity].find(
      value => Object.keys(value).toString() === filter
    );
    const currentStateValue = findStateValue
      ? Object.values(findStateValue).toString()
      : '';

    if (filterOperator === 'BETWEEN' || filterOperator === 'IN') {
      const splitValues = currentStateValue.split('-');
      input = (
        <React.Fragment>
          <Container>
            <TextInput
              value={splitValues[0] ? splitValues[0] : ''}
              inputProps={inputProps}
              InputProps={InputProps}
              placeholder={`Insert Value`}
              onChange={event => this.handleInputChange(event.target.value)}
            />
          </Container>
          <HR />
          <AndBlock>and</AndBlock>
          <HR />
          <Container>
            <TextInput
              disabled={splitValues[0] ? false : true}
              value={splitValues[1] ? splitValues[1] : ''}
              inputProps={inputProps}
              InputProps={InputProps}
              placeholder={`Insert Value`}
              onChange={event => this.handleBetweenChange(event.target.value)}
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
            value={currentStateValue ? currentStateValue : ''}
            inputProps={inputProps}
            InputProps={InputProps}
            placeholder={`Insert Value`}
            onChange={event => this.handleInputChange(event.target.value)}
          />
        </Container>
      );
    }
    return <React.Fragment>{input}</React.Fragment>;
  }
}

export default ValueInput;
