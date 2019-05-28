import * as React from 'react';
import styled from 'styled-components';
import InputBase from '@material-ui/core/InputBase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TextInput = styled(InputBase)`
  &&& {
    color: #9b9b9b;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 17px;
    width: 150px;
    padding-left: 10px;
  }
`;

const DatePickerWrapper = styled(DatePicker)`
  color: #9b9b9b;
  font-size: 18px;
  letter-spacing: 0;
  line-height: 17px;
  width: 220px;
  padding-left: 10px;
  border: none;
  outline: none;
`;

interface Props {
  type: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string | number) => void;
}

const InputItem: React.StatelessComponent<Props> = props => {
  const {
    type,
    value,
    onChange
  } = props;
  if (type === 'dateTime') {
    const newValue = value? new Date(Number(value)) : '';
    return (
      <DatePickerWrapper
        selected={newValue}
        placeholderText='Select a date'
        showTimeSelect
        timeFormat='HH:mm'
        timeIntervals={15}
        dateFormat='MMMM d, yyyy h:mm aa'
        timeCaption='time'
        onChange={(val) => onChange(new Date(val).getTime())}
      />
    )
  }
  return (
    <TextInput
      value={value}
      placeholder='Insert Value'
      onChange={event => onChange(event.target.value)}
    />
  )
}

InputItem.defaultProps = {
  disabled: false
}

export default InputItem;
