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
  value?: string;
  index: number;
  onChange: (value: string, index: number) => void;
}

const FilterItem: React.StatelessComponent<Props> = (props) => {
  const {value, label, index, onChange} = props;
  return (
    <Container>
      <LabelWrapper>{label}</LabelWrapper>
      <TextFieldWrapper
        value={value}
        margin="normal"
        variant="outlined"
        onChange={event => onChange(event.target.value, index)}
      />
    </Container>    
  );
};
FilterItem.defaultProps = {
  value: ''
}

export default FilterItem;
