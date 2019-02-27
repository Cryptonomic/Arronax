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
  //   value: string;
  //   items: Array<object>;
  inputProps?: object;
  InputProps?: object;
  placeholder?: string;
  //   onChange: (value: string) => void;
}

class FilterInput extends React.Component<Props> {
  //   componentDidMount() {
  //     const { items } = this.props;
  //     if (items.length < 8) {
  //       this.setState({ isFadeBottom: false });
  //     } else {
  //       this.setState({ isFadeBottom: true });
  //     }
  //   }

  //   handleChange = item => {
  //     const { onChange } = this.props;
  //     onChange(item.name);
  //     this.setState({ anchorEl: null });
  //   };

  //   cancelChange = () => {
  //     this.setState({ anchorEl: null });
  //   };

  //   handleClick = event => {
  //     this.setState({ anchorEl: event.currentTarget });
  //   };

  //   handleScroll = event => {
  //     const { items } = this.props;
  //     const pos = event.target.scrollTop;
  //     const remainCount = items.length - 8;
  //     if (pos === 0) {
  //       this.setState({ isFadeTop: false, isFadeBottom: true });
  //     } else if (pos < remainCount * 46) {
  //       this.setState({ isFadeTop: true, isFadeBottom: true });
  //     } else {
  //       this.setState({ isFadeTop: true, isFadeBottom: false });
  //     }
  //   };

  render() {
    // const { items, value, placeholder } = this.props;
    const { placeholder, InputProps, inputProps } = this.props;
    console.log(inputProps);
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
