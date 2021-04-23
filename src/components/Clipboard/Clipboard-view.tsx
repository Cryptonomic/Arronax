import React from 'react';
import Clipboard from 'react-clipboard.js';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ContentCopy from '@material-ui/icons/FileCopyOutlined';

import { useClipboardWrapper, useCopyIconWrapper, useTooltipWrapper } from './Clipboard-styles';

import { ClipboardViewProps } from './Clipboard-types';

const ClipboardView = ({ value, open, onSuccess, onClose }: ClipboardViewProps) => {
  const ClipboardWrapper = useClipboardWrapper(Clipboard);
  const CopyIconWrapper = useCopyIconWrapper(ContentCopy);
  const TooltipWrapper = useTooltipWrapper(Tooltip);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <div>
        <TooltipWrapper
          PopperProps={{
            disablePortal: true
          }}
          onClose={onClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title="Copied!"
        >
          <ClipboardWrapper onSuccess={onSuccess} data-clipboard-text={value}>
            <CopyIconWrapper />
          </ClipboardWrapper>
        </TooltipWrapper>
      </div>
    </ClickAwayListener>
  )
}

export default ClipboardView;
