import React from 'react';
import { ConseilOperator } from 'conseiljs';

import { convertValue } from '../../utils/general';
import { MainMenuItem, CheckboxWrapper } from './styles';

import { ValueSelectItemsProps } from './types';

const ValueSelectItem = (props: ValueSelectItemsProps) => {
  const {
    operator,
    selectedValues,
    values,
    handleMultipleChange,
    handleChange,
  } = props;

  const items = values.map((value: string, index: number) => {
    if (operator === ConseilOperator.IN || operator === 'notin') {
      return (
        <MainMenuItem
          onClick={() => handleMultipleChange(value)}
          key={index}
          ismultiple={1}
        >
          <CheckboxWrapper
            disableRipple={true}
            checked={selectedValues.includes(value)}
          />
          {convertValue(value)}
        </MainMenuItem>
      );
    }

    return (
      <MainMenuItem
        onClick={() => handleChange(value)}
        key={index}
        selected={value === selectedValues[0]}
        ismultiple={0}
      >
        {convertValue(value)}
      </MainMenuItem>
    );
  });

  return <>{items}</>;
};

export default ValueSelectItem;
