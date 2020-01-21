import React from 'react';
import Clipboard from 'react-clipboard.js';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ContentCopy from '@material-ui/icons/FileCopyOutlined';

import { useClipboardWrapper, useCopyIconWrapper } from './Clipboard-styles';

import { ClipboardViewProps } from './Clipboard-types';

const ClipboardView = ({ open, value, onSuccess, onClose }: ClipboardViewProps) => {
  const ClipboardWrapper = useClipboardWrapper(Clipboard);
  const CopyIconWrapper = useCopyIconWrapper(ContentCopy)

  return (
    <ClickAwayListener onClickAway={onClose}>
      <div>
        <Tooltip
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
        </Tooltip>
      </div>
    </ClickAwayListener>
  )
}

export default ClipboardView;