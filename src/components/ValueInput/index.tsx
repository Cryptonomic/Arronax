import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConseilOperator } from 'conseiljs';

import { ValueInputItem } from '../ValueInputItem';

import {
  HR,
  AndBlock
} from './styles';

import { ValueInputProps } from './types';

const ValueInput = (props: ValueInputProps) => {
  const { t } = useTranslation();
  const { operator, values, attribute, onChange } = props;

  const changeSingle = (val: string) => {
    const l = val.split(',').map(v => v.trim());
    onChange([l[0]]);
  }

  const changeRange = (val: string, index: number) => {
    values[index] = val;
    onChange(values);
  }

  const changeList = (val: string) => {
    onChange([...(new Set(val.split(',').map(v => v.trim())))]);
  }

  // Render specific input type based on operators
  switch (operator) {
    case ConseilOperator.BETWEEN:
      return (
        <>
          <ValueInputItem
            attribute={attribute}
            value={values[0]}
            onChange={(val: any) => changeRange(val, 0)}
          />
          <HR />
          <AndBlock>{t('components.valueInput.and')}</AndBlock>
          <HR />
          <ValueInputItem
            attribute={attribute}
            disabled={!values[0]}
            value={values[1] ? values[1] : ''}
            onChange={(val: any) => changeRange(val, 1)}
          />
        </>
      );
    case ConseilOperator.IN:
    case 'notin':
      const newValue = values.join(', ');
      return (
        <ValueInputItem
          attribute={attribute}
          value={newValue}
          onChange={(val: any) => changeList(val)}
        />
      );
    case ConseilOperator.ISNULL: 
    case 'isnotnull': 
      return null;
    default:
      return (
        <ValueInputItem
          attribute={attribute}
          value={values[0]}
          onChange={(val: any) => changeSingle(val)}
        />
      );
  }
}

export default ValueInput;
