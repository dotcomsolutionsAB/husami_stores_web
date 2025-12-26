import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// ----------------------------------------------------------------------

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content?: string;
  action?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

// ----------------------------------------------------------------------

export function ConfirmDialog({
  open,
  title = 'Confirm Action',
  content = 'Are you sure you want to proceed?',
  action,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', gap: 1, flex: '1 1 auto', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          {action || (
            <Button variant="contained" color="error" onClick={handleConfirm}>
              Confirm
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
