import * as React from 'react';
import styled from 'styled-components';
import ColumnsDisplay from '../ColumnsDisplay';

// put a dropdown list inside this component that passes state (selected Columns) to Redux
// replace div with styled select and add blue down Icon
const Container = styled.div`
  position: relative;
  width: 107px;
  height: 52px;
  border: 1px solid black;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
`;

class FilterMenu extends React.Component {
  render() {
    return (
      <>
        <ColumnsDisplay />
      </>
    );
  }
}

export default FilterMenu;
