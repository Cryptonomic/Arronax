import * as React from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

const Container = styled(FormControl)`
  width: 100%;
`;

const TextFieldWrapper = styled(TextField)`
  &&& {
    font-size: 16px;
    font-weight: 300;
    margin: 0;

    input {
      padding: 10px;
    }
  }
}`;
const LabelWrapper = styled(FormHelperText)`
  &&& {
    color: rgba(0, 0, 0, 0.38);
    font-size: 14px;
  }
}`;

interface Props {
  label: string;
  value?: any;
  type: string;
  onChange: (value: string, type: string) => void;
}

const FilterItem: React.StatelessComponent<Props> = (props) => {
  const {value, label, type, onChange} = props;
  let realValue = '';
  if (type === 'limit') {
    realValue = value;
  } else {
    value.forEach((item, index) => {
      if (index === 0) {
        realValue = item;
      } else {
        realValue += ', ' + item;
      }
    })
  }
  return (
    <Container>
      <LabelWrapper>{label}</LabelWrapper>
      <TextFieldWrapper
        value={realValue}
        margin="normal"
        variant="outlined"
        onChange={event => onChange(event.target.value, type)}
      />
    </Container>    
  );
};
FilterItem.defaultProps = {
  value: []
}

export default FilterItem;
