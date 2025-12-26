import { useContext } from 'react';

import { ConfirmContext } from './confirm-dialog-provider';

// ----------------------------------------------------------------------

export function useConfirmDialog() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider');
  }

  return context;
}
