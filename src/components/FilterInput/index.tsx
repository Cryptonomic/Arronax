import * as React from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

const Container = styled.div``;
const TextInput = styled(TextField)`
  margin-top: 17px !important;
  margin-left: 10px !important;
  color: #9b9b9b;
  font-size: 18px;
  font-weight: normal;
  height: 17px;
  letter-spacing: 0;
  line-height: 17px;
  width: 150px;
`;

interface Props {
  inputProps?: object;
  InputProps?: object;
  placeholder?: string;
}

class FilterInput extends React.Component<Props> {
  //   handleChange = item => {
  //     const { onChange } = this.props;
  //     onChange(item.name);
  //     this.setState({ anchorEl: null });
  //   };

  render() {
    const { placeholder, InputProps, inputProps } = this.props;
    return (
      <Container>
        <TextInput
          inputProps={inputProps}
          InputProps={InputProps}
          placeholder={placeholder}
        />
      </Container>
    );
  }
}

export default FilterInput;
