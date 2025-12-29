import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { FlatIcon } from 'src/components/flaticon';

// ----------------------------------------------------------------------

export function ThemeModeToggle() {
  const { mode, setMode } = useColorScheme();

  const handleToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <IconButton onClick={handleToggle} color="default">
      <FlatIcon icon={mode === 'light' ? 'moon' : 'sun'} width={24} />
    </IconButton>
  );
}
