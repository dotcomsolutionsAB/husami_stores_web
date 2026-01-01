import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

type PageLoaderProps = {
  height?: number | string;
};

export function PageLoader({ height = 450 }: PageLoaderProps) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height,
      }}
    >
      <CircularProgress />
    </Card>
  );
}
