import React from 'react';

import { DatePickerInputProps } from './types';

const DatePickerInput = React.forwardRef(
  (props: DatePickerInputProps, ref: React.Ref<HTMLButtonElement>) => (
    <button className={props.className} ref={ref} onClick={props.onClick}>
      {props.value ? props.value : props.placeholder}
    </button>
  )
);

export default DatePickerInput;
