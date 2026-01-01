import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { FlatIcon } from 'src/components/flaticon';

// ----------------------------------------------------------------------

type PageLoadErrorProps = {
  height?: number | string;
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function PageLoadError({
  height = 450,
  title = 'Failed to load data',
  message = 'Please check your connection and try again.',
  onRetry,
}: PageLoadErrorProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        gap: 2,
      }}
    >
      <FlatIcon icon="exclamation-triangle" width={48} />
      <Typography variant="h6" color="error">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
      <Button variant="contained" onClick={handleRetry}>
        Retry
      </Button>
    </Card>
  );
}
