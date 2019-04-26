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
  operator: string;
  InputProps?: object;
  values: Array<string>;
  onChange: (value: string, index: number) => void;
}

const ValueInput: React.StatelessComponent<Props> = props => {
    const {
      InputProps,
      operator,
      values,
      onChange
    } = props;
    let input;

    // Render specific input type based on operators
    if (operator === 'BETWEEN' || operator === 'IN') {
      input = (
        <React.Fragment>
          <Container>
            <TextInput
              value={values[0]}
              InputProps={InputProps}
              placeholder='Insert Value'
              onChange={event => onChange(event.target.value, 0)}
            />
          </Container>
          <HR />
          <AndBlock>and</AndBlock>
          <HR />
          <Container>
            <TextInput
              disabled={!values[0]}
              value={values[1] ? values[1] : ''}
              InputProps={InputProps}
              placeholder='Insert Value'
              onChange={event => onChange(event.target.value, 1)}
            />
          </Container>
        </React.Fragment>
      );
    } else if (operator === 'ISNULL' || operator === 'ISNOTNULL') {
      input = null;
    } else {
      input = (
        <Container>
          <TextInput
            value={values[0]}
            InputProps={InputProps}
            placeholder='Insert Value'
            onChange={event => onChange(event.target.value, 0)}
          />
        </Container>
      );
    }
    return <React.Fragment>{input}</React.Fragment>;
}

export default ValueInput;
