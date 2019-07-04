import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AttributeDefinition, AttrbuteDataType } from 'conseiljs';
import muiStyled from '@material-ui/styles/styled';
import InputBase from '@material-ui/core/InputBase';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TextInput = muiStyled(InputBase)({
  color: '#9b9b9b',
  fontSize: '18px',
  letterSpacing: 0,
  lineHeight: '17px',
  width: '150px',
  paddingLeft: '10px'
});

const DatePickerWrapper = styled(DatePicker)`
  color: #4A4A4A;
  font-size: 18px;
  letter-spacing: 0;
  line-height: 17px;
  width: 220px;
  padding-left: 10px;
  border: none;
  outline: none;
`;

interface Props {
  attribute: AttributeDefinition;
  value: string;
  disabled?: boolean;
  onChange: (value: string | number) => void;
}

const InputItem: React.FC<Props> = props => {
  const {
    attribute,
    value,
    onChange
  } = props;
  const { t } = useTranslation();
  if (attribute.dataType === AttrbuteDataType.DATETIME) {
    const newValue = value? new Date(Number(value)) : '';
    return (
      <DatePickerWrapper
        selected={newValue}
        placeholderText={t('components.valueInputItem.select_date')}
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
      placeholder={t('components.valueInputItem.insert_value')}
      onChange={event => onChange(event.target.value)}
    />
  )
}

InputItem.defaultProps = {
  disabled: false
}

export default InputItem;
