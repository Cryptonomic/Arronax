import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ConseilOperator, AttributeDefinition } from 'conseiljs';
import InputItem from '../ValueInputItem';
import { removeBlank } from '../../utils/general';

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
  values: string[];
  onChange: (values: string[]) => void;
}

const ValueInput: React.FC<Props> = props => {
    const {
      operator,
      values,
      attribute,
      onChange
    } = props;
    let input;
    const { t } = useTranslation();

    function changeByBetween(val: string, index: number) {
      values[index] = val;
      onChange(values);
    }

    function changeByOperator(val: string) {
      const splitVals = val.split(',');
      const newValues = splitVals.map(v => removeBlank(v));
      onChange(newValues);
    }

    // Render specific input type based on operators
    if (operator === ConseilOperator.BETWEEN) {
      input = (
        <React.Fragment>
          <Container>
            <InputItem
              attribute={attribute}
              value={values[0]}
              onChange={val => changeByBetween(val, 0)}
            />
          </Container>
          <HR />
          <AndBlock>{t('components.valueInput.and')}</AndBlock>
          <HR />
          <Container>
            <InputItem
              attribute={attribute}
              disabled={!values[0]}
              value={values[1] ? values[1] : ''}
              onChange={val => changeByBetween(val, 1)}
            />
          </Container>
        </React.Fragment>
      );
    } else if (operator === ConseilOperator.ISNULL || operator === 'isnotnull') {
      input = null;
    } else {
      let newValue = '';
      values.forEach((val, index) => {
        if (index === 0) {
          newValue = val;
        } else {
          newValue += `,${val}`;
        }
      });
      input = (
        <Container>
          <InputItem
            attribute={attribute}
            value={newValue}
            onChange={val => changeByOperator(val)}
          />
        </Container>
      );
    }
    return <React.Fragment>{input}</React.Fragment>;
}

export default ValueInput;
