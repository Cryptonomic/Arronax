import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';

import { convertValue } from '../../utils/general';
import ValueSelectItems from './ValueSelectItems';

import {
  Container,
  ButtonShell,
  ArrowIcon,
  MenuContainer,
  MenuContents
} from './styles';

import { ValueSelectProps } from './types';

const ValueSelect = (props: ValueSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { 
    values, 
    selectedValues, 
    placeholder = '', 
    operator, 
    onChange
  } = props;

  const handleClick = (event: React.MouseEvent) => {
    const el = event.currentTarget;
    setAnchorEl(el);
  };

  const handleChange = (value: string) => {
    onChange([value]);
    setAnchorEl(null);
  };

  const handleMultipleChange = (value: string) => {
    const index = selectedValues.indexOf(value);
    let newValues = [];
    if (selectedValues[0] === '') {
      newValues = [value];
    } else if (index > -1) {
      selectedValues.splice(index, 1);
      newValues = selectedValues;
    } else {
      newValues = [...selectedValues, value];
    }
    onChange(newValues);
  }

  const cancelChange = () => setAnchorEl(null);

  let menuTitle: string = '';
  if (selectedValues[0] !== '') {
    menuTitle = selectedValues.map(value => convertValue(value)).join(', ');
  } else {
    menuTitle = placeholder;
  }

  return (
      <Container>
        <ButtonShell
          aria-controls="simple-menu"
          aria-haspopup="true"
          isactive={selectedValues.length}
          onClick={handleClick}
        >
          {menuTitle}
          <ArrowIcon />
        </ButtonShell>
        <MenuContainer>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={cancelChange}
          >
            <MenuContents>
              <ValueSelectItems
                values={values}
                operator={operator}
                selectedValues={selectedValues}
                handleMultipleChange={handleMultipleChange}
                handleChange={handleChange}
              />
            </MenuContents>
          </Menu>
        </MenuContainer>
      </Container>
    );
}

export default ValueSelect;
