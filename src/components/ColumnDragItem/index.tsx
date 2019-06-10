import React, { useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import {
  DragSource,
  DropTarget,
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DropTargetConnector,
  DragSourceConnector,
  DragSourceMonitor,
} from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { ArronaxIcon } from '../ArronaxIcon';
import ItemTypes from '../../types/DragItemTypes';

const Container = styled.div<{isdragging: number}>`
  display: flex;
  height: 51px;
  width: 372px;
  align-items: center;
  padding: 0 28px 0 10px;
  opacity: ${({ isdragging }) => (isdragging ? 0.5 : 1)};
  &:hover {
    background: rgba(101, 200, 206, 0.13);
  }
`;

const DragIcon = styled(ArronaxIcon)`
  margin-left: auto;
`;

const CheckboxWrapper = withStyles({
  root: {
    '&$checked': {
      color: '#56c2d9',
    },
  },
  checked: {},
})(Checkbox);

interface Props {
  name: string;
  index: number;
  onClick: () => void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  moveItem: (dragIndex: number, hoverIndex: number) => void
}

interface CardInstance {
  getNode(): HTMLDivElement | null
}

const ColumnDragItem = React.forwardRef<HTMLDivElement, Props>(
  ({ name, onClick, isDragging, connectDragSource, connectDropTarget }, ref) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);

    useImperativeHandle<{}, CardInstance>(ref, () => ({
      getNode: () => elementRef.current,
    }));
    return (
      <Container ref={elementRef} isdragging={isDragging? 1 : 0}>
        <CheckboxWrapper
          disableRipple={true}
          checked={true}
          onClick={onClick}
        />
        {name}
        <DragIcon size="23px" color="#d8d8d8" iconName="icon-reorder"/>
      </Container>
    )
  },
)

export default DropTarget(
  ItemTypes.COLUMN,
  {
    hover(
      props: Props,
      monitor: DropTargetMonitor,
      component: CardInstance,
    ) {
      if (!component) {
        return null
      }
      // node = HTML Div element from imperative API
      const node = component.getNode()
      if (!node) {
        return null
      }

      const dragIndex = monitor.getItem().index
      const hoverIndex = props.index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      props.moveItem(dragIndex, hoverIndex)
      monitor.getItem().index = hoverIndex
    },
  },
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    ItemTypes.COLUMN,
    {
      beginDrag: (props: Props) => ({
        index: props.index,
      }),
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(ColumnDragItem),
);
