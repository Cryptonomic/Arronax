import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { number } from 'prop-types';

const Container = styled.div``;

const ButtonShell = styled(Button)`
  &&& {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    color: ${({ isactive }) => (isactive ? '#4A4A4A' : '#9b9b9b')};
    text-transform: capitalize;
  }
`;

const ArrowIcon = styled(KeyboardArrowDown)`
  color: #56c2d9;
  margin-left: 7px;
`;

const MenuContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const MenuContents = styled.div`
  flex: 1;
  outline: none;
  overflow: auto;
  min-height: 1.25em;
`;

const MainMenu = styled(Menu)`
  width: 220px;
`;

const MainMenuItem = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      background-color: rgba(101,  200, 206, 0.13);
    }
    &:hover {
      background-color: rgba(101,  200, 206, 0.1);
    }
    font-size: 20px;
    font-weight: 300;
    padding-left: 25px;
    padding-right: 25px;
    color: #4a4a4a;
  }
`;

interface Props {
  rowCount: number;
  setRowCount: (count: number) => void;
}

class LimitSelector extends React.Component<Props> {
  state = {
    anchorEl: null,
  };

  handleChange = rows => {
    const { setRowCount } = this.props;
    setRowCount(rows);
    this.setState({ anchorEl: null });
  };

  cancelChange = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { anchorEl } = this.state;
    const { rowCount } = this.props;
    const limitOptions = [10, 25, 50, 100, 250, 1000];
    const numberOfRows = rowCount !== null ? rowCount : 10;
    return (
      <Container>
        <ButtonShell
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          isactive={rowCount}
          onClick={this.handleClick}
        >
          {numberOfRows}
          <ArrowIcon />
        </ButtonShell>
        <MenuContainer>
          <MainMenu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.cancelChange}
          >
            <MenuContents>
              {limitOptions.map((rowCount, index) => (
                <MainMenuItem
                  key={index}
                  value={rowCount}
                  onClick={event => this.handleChange(rowCount)}
                >
                  {rowCount}
                </MainMenuItem>
              ))}
            </MenuContents>
          </MainMenu>
        </MenuContainer>
      </Container>
    );
  }
}

export default LimitSelector;
