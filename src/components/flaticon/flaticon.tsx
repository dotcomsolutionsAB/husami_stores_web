import { forwardRef } from 'react';

import { Box } from '@mui/material';

export interface FlatIconProps {
  icon: string;
  width?: number | string;
  height?: number | string;
  sx?: any;
  [key: string]: any;
}

/**
 * Flaticon Fill component
 * Usage: <FlatIcon icon="home" width={24} />
 * This will automatically generate class "fi fi-sr-home"
 *
 * Icon names format: just the icon name (without fi-sr- prefix)
 * List of icons: https://www.flaticon.com/uicons
 */
export const FlatIcon = forwardRef<HTMLElement, FlatIconProps>(
  ({ icon, width = 24, height = 24, sx = {}, ...props }, ref) => {
    const size = typeof width === 'number' ? `${width}px` : width;
    const heightSize = typeof height === 'number' ? `${height}px` : height;

    // Flaticon requires both 'fi' and the specific icon class
    // If icon already starts with fi-, use it as is, otherwise add fi-sr- prefix
    const iconClass = icon.startsWith('fi-') ? `fi ${icon}` : `fi fi-sr-${icon}`;

    return (
      <Box
        ref={ref as any}
        component="i"
        className={iconClass}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size,
          lineHeight: 1,
          height: heightSize,
          width: size,
          ...sx,
        }}
        {...props}
      />
    );
  }
);

FlatIcon.displayName = 'FlatIcon';
