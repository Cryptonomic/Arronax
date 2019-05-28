import * as React from 'react';
import styled from 'styled-components';
import { ConseilOperator } from 'conseiljs';
import InputItem from '../ValueInputItem';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

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

interface Props {
  type: string;
  operator: string;
  values: Array<string>;
  onChange: (value: string | number, index: number) => void;
}

const ValueInput: React.StatelessComponent<Props> = props => {
    const {
      operator,
      values,
      type,
      onChange
    } = props;
    let input;

    // Render specific input type based on operators
    if (operator === ConseilOperator.BETWEEN || operator === ConseilOperator.IN) {
      input = (
        <React.Fragment>
          <Container>
            <InputItem
              type={type}
              value={values[0]}
              onChange={val => onChange(val, 0)}
            />
          </Container>
          <HR />
          <AndBlock>and</AndBlock>
          <HR />
          <Container>
            <InputItem
              type={type}
              disabled={!values[0]}
              value={values[1] ? values[1] : ''}
              onChange={val => onChange(val, 1)}
            />
          </Container>
        </React.Fragment>
      );
    } else if (operator === ConseilOperator.ISNULL || operator === 'isnotnull') {
      input = null;
    } else {
      input = (
        <Container>
          <InputItem
            type={type}
            value={values[0]}
            onChange={val => onChange(val, 0)}
          />
        </Container>
      );
    }
    return <React.Fragment>{input}</React.Fragment>;
}

export default ValueInput;
