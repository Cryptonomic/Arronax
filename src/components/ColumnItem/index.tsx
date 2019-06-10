import React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';

const Container = styled.div`
  display: flex;
  height: 51px;
  width: 372px;
  align-items: center;
  padding: 0 28px 0 10px;
  &:hover {
    background: rgba(101, 200, 206, 0.13);
  }
`;
interface Props {
  name: string;
  onClick: () => void;
}

const ColumnItem: React.FC<Props> = (props) => {
  const { name, onClick } = props;
  return (
    <Container onClick={onClick}>
      <Checkbox disableRipple={true}/>
      {name}
    </Container>    
  );
};

export default ColumnItem;
