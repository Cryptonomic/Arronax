import React, { useState } from 'react';

import ClipboardView from './Clipboard-view';

const ClipboardContainer = ({ value }) => {
  const [open, setOpen] = useState(false);
  
  const onSuccess = () => setOpen(true);
  const onClose = () => setOpen(false);

  const props = {
    value,
    open,
    onSuccess,
    onClose
  }

  return <ClipboardView {...props} />
}

export default ClipboardContainer;