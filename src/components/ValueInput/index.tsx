import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ConseilOperator, AttributeDefinition } from 'conseiljs';
import InputItem from '../ValueInputItem';

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
  const { operator, values, attribute, onChange } = props;
  const { t } = useTranslation();

  function changeSingle (val: string) {
    const l = val.split(',').map(v => v.trim());
    onChange([l[0]]);
  }

  function changeRange(val: string, index: number) {
    values[index] = val;
    onChange(values);
  }

  function changeList(val: string) {
    onChange([...(new Set(val.split(',').map(v => v.trim())))]);
  }

  // Render specific input type based on operators
  if (operator === ConseilOperator.BETWEEN) {
    return (
      <React.Fragment>
        <InputItem
          attribute={attribute}
          value={values[0]}
          onChange={val => changeRange(val, 0)}
        />
        <HR />
        <AndBlock>{t('components.valueInput.and')}</AndBlock>
        <HR />
        <InputItem
          attribute={attribute}
          disabled={!values[0]}
          value={values[1] ? values[1] : ''}
          onChange={val => changeRange(val, 1)}
        />
      </React.Fragment>
    );
  } else if (operator === ConseilOperator.ISNULL || operator === 'isnotnull') {
    return null;
  } else if (operator === ConseilOperator.IN || operator === 'notin') {
    const newValue = values.join(', ');

    return (
      <InputItem
        attribute={attribute}
        value={newValue}
        onChange={val => changeList(val)}
      />
    );
  }
  return (
    <InputItem
      attribute={attribute}
      value={values[0]}
      onChange={val => changeSingle(val)}
    />
  );
}

export default ValueInput;
