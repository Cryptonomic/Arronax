import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AttributeDefinition, AttrbuteDataType } from 'conseiljs';
import muiStyled from '@material-ui/styles/styled';
import InputBase from '@material-ui/core/InputBase';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Container = styled.div<{isLong: boolean}>`
  width: ${({ isLong }) => (isLong ? '350px' : '200px')};
  height: 52px;
  display: flex;
  align-items: center;
`;

const TextInput = muiStyled(InputBase)({
  color: '#9b9b9b',
  fontSize: '16px',
  letterSpacing: 0,
  lineHeight: '17px',
  width: '100%',
  height: '100%',
  paddingLeft: '10px'
});

const DatePickerWrapper = styled(DatePicker)`
  color: #4A4A4A;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 17px;
  width: 220px;
  height: 52px;
  padding-left: 10px;
  border: none;
  outline: none;
`;

interface OwnProps {
  attribute: AttributeDefinition;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

type Props = OwnProps & WithTranslation;

interface States {
  prevValue: string;
  stateVal: string;
}

class InputItem extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      prevValue: '',
      stateVal: ''
    };
  }

  static defaultProps: any = {
    disabled: false
  };
  
  static getDerivedStateFromProps(props: Props, state: States) {
    if (props.value !== state.prevValue) {
      return {
        stateVal: props.value,
        prevValue: props.value
      };
    }
    return null;
  }

  onValueChange = (val: string) => {
    const { value, onChange } = this.props;
    const lastChar = val.slice(-1);
    if (value.length > val.length && lastChar === ',') {
      this.setState({stateVal: val});
    } else {
      onChange(val);
    }
  }
  render () {
    const {
      t,
      attribute,
      value,
      disabled,
      onChange
    } = this.props;
    const { stateVal } = this.state;

    const isLong = attribute.dataType === AttrbuteDataType.STRING || attribute.dataType === AttrbuteDataType.HASH || attribute.dataType === AttrbuteDataType.ACCOUNT_ADDRESS;

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
    return (
      <Container isLong={isLong}>
        <TextInput
          disabled={disabled}
          value={stateVal}
          placeholder={t('components.valueInputItem.insert_value')}
          onChange={event => this.onValueChange(event.target.value)}
        />
      </Container>
    )
  }
}


export default withTranslation()(InputItem);
