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

interface Filter {
  name: string;
  operator: string;
}

interface Props {
  filter: Filter;
  inputProps?: object;
  InputProps?: object;
  value: string;
  filterInputState: object;
  selectedEntity: string;
  onInputChange: (value: string) => void;
  onBetweenInputChange: (value: string) => void;
}

class ValueInput extends React.Component<Props> {
  handleInputChange = value => {
    const { onInputChange } = this.props;
    onInputChange(value);
  };

  handleBetweenChange = value => {
    const { onBetweenInputChange } = this.props;
    onBetweenInputChange(value);
  };

  render() {
    const {
      InputProps,
      inputProps,
      filter,
      filterInputState,
      selectedEntity,
    } = this.props;
    let input;

    // Find state value that matches this filter
    const findStateValue = filterInputState[selectedEntity].find(
      value => Object.keys(value).toString() === filter.name
    );
    const currentStateValue = findStateValue
      ? Object.values(findStateValue).toString()
      : '';
    // Render specific input type based on operators
    if (filter.operator === 'BETWEEN' || filter.operator === 'IN') {
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
    } else if (
      filter.operator === 'ISNULL' ||
      filter.operator === 'ISNOTNULL'
    ) {
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
