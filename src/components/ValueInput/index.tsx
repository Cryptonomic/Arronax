import React from 'react';
import styled from 'styled-components';
import { ConseilOperator, AttributeDefinition } from 'conseiljs';
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
  attribute: AttributeDefinition;
  operator: string;
  values: Array<string>;
  onChange: (value: string | number, index: number) => void;
}

const ValueInput: React.FC<Props> = props => {
    const {
      operator,
      values,
      attribute,
      onChange
    } = props;
    let input;

    // Render specific input type based on operators
    if (operator === ConseilOperator.BETWEEN || operator === ConseilOperator.IN || operator === 'notin') {
      input = (
        <React.Fragment>
          <Container>
            <InputItem
              attribute={attribute}
              value={values[0]}
              onChange={val => onChange(val, 0)}
            />
          </Container>
          <HR />
          <AndBlock>and</AndBlock>
          <HR />
          <Container>
            <InputItem
              attribute={attribute}
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
            attribute={attribute}
            value={values[0]}
            onChange={val => onChange(val, 0)}
          />
        </Container>
      );
    }
    return <React.Fragment>{input}</React.Fragment>;
}

export default ValueInput;
