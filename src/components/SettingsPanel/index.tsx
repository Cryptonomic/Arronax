import React from 'react';
import styled from 'styled-components';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/CloseOutlined';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import SwipeableViews from 'react-swipeable-views';
import FilterPanel from '../FilterPanel';
import ColumnsPanel from '../ColumnsPanel';
import AggregationPanel from '../AggregationPanel';
import { ToolType } from '../../types';

const Container = styled.div`
  position: relative;
  padding: 40px 77px 12px 50px;
  background: rgb(236, 237, 239);
  box-shadow: inset 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
  z-index: 100;
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
` as React.ComponentType<SvgIconProps>;

const SwipeableViewsWrapper = styled(SwipeableViews)`
  &&& {
    overflow-x: visible !important;
    [aria-hidden="true"] > div > div {
      opacity: 0;
    }
  }
`;


interface Props {
  isCollapsed: boolean;
  selectedTool: string;
  onSubmit: () => void;
  onClose: () => void;
}

class SettingsPanel extends React.Component<Props, {}> {
  swipeableActions: any;
  componentDidMount() {
    this.swipeableActions.updateHeight();
  }

  onChangeHeight() {
    this.swipeableActions.updateHeight();
  }

  render() {
    const {
      isCollapsed,
      selectedTool,
      onClose,
      onSubmit
    } = this.props;
    // const activeIndex = selectedTool === ToolType.FILTER ? 0 : 1;
    let activeIndex = 0;
    if (selectedTool === ToolType.COLUMN) {
      activeIndex = 1;
    } else if (selectedTool === ToolType.AGGREGATION) {
      activeIndex = 2;
    }
    return (
      <Collapse in={isCollapsed}>
        <Container>
          <CloseIconContainer onClick={onClose}>
            <CloseIconWrapper />
          </CloseIconContainer>
          <SwipeableViewsWrapper
            index={activeIndex}
            action={(actions: any) => {
              this.swipeableActions = actions;
            }}
            animateHeight
          >
            <FilterPanel onSubmit={onSubmit} swipeRef={this.swipeableActions} />
            <ColumnsPanel onSubmit={onSubmit} />
            <AggregationPanel onSubmit={onSubmit} swipeRef={this.swipeableActions} />
          </SwipeableViewsWrapper>
        </Container>
      </Collapse>
    );
  }
};

export default SettingsPanel;
