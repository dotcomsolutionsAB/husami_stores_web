import type { ReactNode } from 'react';

import { useState, useCallback, createContext } from 'react';

import { ConfirmDialog } from './confirm-dialog';

// ----------------------------------------------------------------------

export interface ConfirmOptions {
  title?: string;
  content?: string;
  action?: React.ReactNode;
}

export interface ConfirmContextValue {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
}

// ----------------------------------------------------------------------

export const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

interface ConfirmDialogProviderProps {
  children: ReactNode;
}

export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts?: ConfirmOptions): Promise<boolean> => {
    setOptions(opts || {});
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (resolveRef) {
      resolveRef(false);
    }
  }, [resolveRef]);

  const handleConfirm = useCallback(() => {
    if (resolveRef) {
      resolveRef(true);
    }
  }, [resolveRef]);

  const contextValue: ConfirmContextValue = {
    confirm,
  };

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        open={open}
        title={options.title}
        content={options.content}
        action={options.action}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </ConfirmContext.Provider>
  );
}
