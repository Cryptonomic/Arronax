import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { setValueAction } from '../../reducers/app/actions';

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
  filter?: object;
  inputProps?: object;
  InputProps?: object;
  placeholder?: string;
  setValue: (value: object) => void;
}

class FilterInput extends React.Component<Props> {
  handleChange = (event, filter) => {
    const { setValue } = this.props;
    if (event.target.value.length > 4) {
      const value = { [filter]: event.target.value };
      setValue(value);
    }
  };

  render() {
    const { placeholder, InputProps, inputProps, filter } = this.props;
    return (
      <Container>
        <TextInput
          inputProps={inputProps}
          InputProps={InputProps}
          placeholder={placeholder}
          onChange={event => this.handleChange(event, filter)}
        />
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setValue: (value: object) => dispatch(setValueAction(value)),
});

export default connect(
  null,
  mapDispatchToProps
)(FilterInput);
