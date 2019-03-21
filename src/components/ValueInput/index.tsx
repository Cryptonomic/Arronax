// import * as React from 'react';
// import styled from 'styled-components';
// import TextField from '@material-ui/core/TextField';
// import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// import StartBetweenInput from '../StartBetweenInput';
// import EndBetweenInput from '../EndBetweenInput';

// const Container = styled.div``;

// const HR = styled.div`
//   width: 1px;
//   background-color: #ecedef;
// `;

// const AndBlock = styled.div`
//   color: #4a4a4a;
//   height: 52px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 18px;
//   font-weight: 400;
//   padding-right: 10px;
//   padding-left: 10px;
// `;

// const TextInput = styled(TextField)`
//   margin-top: 17px !important;
//   margin-left: 10px !important;
//   color: #9b9b9b;
//   font-size: 18px;
//   font-weight: normal;
//   height: 17px;
//   letter-spacing: 0;
//   line-height: 17px;
//   width: 150px;
// `;

// interface Props {
//   filterName: string;
//   filterOperator: string;
//   inputProps?: object;
//   InputProps?: object;
//   placeholder?: string;
//   setFilterInput: (
//     val: string,
//     filterName: string,
//     filterOperator: string
//   ) => void;
// }

// class ValueInput extends React.Component<Props> {
//   state = {
//     value: '',
//   };

//   handleChange = event => {
//     this.setState({ value: event.target.value });
//   };

//   handleClick = event => {
//     const { value } = this.state;
//     const { setFilterInput, filterName, filterOperator } = this.props;
//     const className = event.target.className;
//     // Only fire function if user clicks Run button
//     if (!className.baseVal && className.baseVal !== '') {
//       if (className.includes('RunButton')) {
//         const newValue = value.replace(',', '');
//         setFilterInput(newValue, filterName, filterOperator);
//       }
//     }
//   };

//   render() {
//     const {
//       placeholder,
//       InputProps,
//       inputProps,
//       filterOperator,
//       filterName,
//       setFilterInput,
//     } = this.props;
//     const { value } = this.state;
//     let input;
//     if (filterOperator === 'BETWEEN' || filterOperator === 'IN') {
//       input = (
//         <React.Fragment>
//           <HR />
//           <StartBetweenInput
//             setFilterInput={setFilterInput}
//             // filter={filter}
//             filterOperator={filterOperator}
//             InputProps={{ disableUnderline: true }}
//             placeholder={`e.g. 123456`}
//           />
//           <HR />
//           <AndBlock>and</AndBlock>
//           <HR />
//           <EndBetweenInput
//             setFilterInput={setFilterInput}
//             filterName={filterName}
//             filterOperator={filterOperator}
//             InputProps={{ disableUnderline: true }}
//             placeholder={`e.g. 123456`}
//           />
//         </React.Fragment>
//       );
//     } else if (filterOperator === 'ISNULL') {
//       input = null;
//     } else {
//       input = (
//         <Container>
//           <ClickAwayListener onClickAway={event => this.handleClick(event)}>
//             <TextInput
//               value={value}
//               inputProps={inputProps}
//               InputProps={InputProps}
//               placeholder={placeholder}
//               onChange={event => this.handleChange(event)}
//             />
//           </ClickAwayListener>
//         </Container>
//       );
//     }
//     return <React.Fragment>{input}</React.Fragment>;
//   }
// }

// export default ValueInput;
