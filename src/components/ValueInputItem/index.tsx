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
  fontSize: '16px',
  letterSpacing: 0,
  lineHeight: '17px',
  width: '200px',
  paddingLeft: '10px'
});

const DatePickerWrapper = styled(DatePicker)`
  color: #4A4A4A;
  font-size: 16px;
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
  onChange: (value: string) => void;
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
        onChange={(val) => onChange(String(new Date(val).getTime()))}
      />
    )
  }
  if (attribute.dataType === AttrbuteDataType.STRING || attribute.dataType === AttrbuteDataType.HASH || attribute.dataType === AttrbuteDataType.ACCOUNT_ADDRESS) {
    return (
        <TextInput
          style={{ width: 350 }}
          value={value}
          placeholder={t('components.valueInputItem.insert_value')}
          onChange={event => onChange(event.target.value)}
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
