import * as React from 'react';
import styled from 'styled-components';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/CloseOutlined';
import SwipeableViews from 'react-swipeable-views';
import FilterPanel from '../FilterPanel';
import ColumnsPanel from '../ColumnsPanel';
import { ToolType } from '../../types';

const Container = styled.div`
  position: relative;
  padding: 40px 77px 12px 50px;
  background: rgb(236, 237, 239);
  box-shadow: inset 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
`;

const CloseIconContainer = styled.div`
  position: absolute;
  right: 26px;
  top: 26px;
  cursor: pointer;
`;

const CloseIconWrapper = styled(CloseIcon)`
  &&& {
    color: #9b9b9b;
    font-size: 27px;
  }
`;

interface Props {
  isCollapsed: boolean;
  selectedTool: string;
  onSubmit: () => void;
  onClose: () => void;
}

class SettingsPanel extends React.Component<Props, {}> {
  swipeableActions = null;
  componentDidMount() {
    this.swipeableActions.updateHeight();
  }
  render() {
    const {
      isCollapsed,
      selectedTool,
      onClose,
      onSubmit
    } = this.props;
    const activeIndex = selectedTool === ToolType.FILTER ? 0 : 1;
    return (
      <Collapse in={isCollapsed}>
        <Container>
          <CloseIconContainer onClick={onClose}>
            <CloseIconWrapper />
          </CloseIconContainer>
          <SwipeableViews
            index={activeIndex}
            action={actions => {
              this.swipeableActions = actions;
            }}
            animateHeight
          >
            <FilterPanel onSubmit={onSubmit} swipeRef={this.swipeableActions} />
            <ColumnsPanel onSubmit={onSubmit} />
          </SwipeableViews>
        </Container>
      </Collapse>
    );
  }
};

export default SettingsPanel;
