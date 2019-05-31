import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
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

const styles = {
  checkbox: {
    '&$checked': {
      color: '#56c2d9',
    },
  },
  checked: {},
};

interface Props {
  isChecked?: boolean;
  name: string;
  classes: any;
  onClick: () => void;
}

const ColumnItem: React.FC<Props> = (props) => {
  const { isChecked, name, classes, onClick } = props;
  return (
    <Container onClick={onClick}>
      <Checkbox
        classes={{
          root: classes.checkbox,
          checked: classes.checked,
        }}
        disableRipple={true}
        checked={isChecked}
      />
      {name}
      {/* {isChecked && <DraggableIcon size="23px" color="#d8d8d8" iconName="icon-reorder"/>} */}
    </Container>    
  );
};

ColumnItem.defaultProps = {
  isChecked: false
}

export default withStyles(styles)(ColumnItem);
