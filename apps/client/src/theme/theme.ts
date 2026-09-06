import { createTheme } from '@mantine/core';

const fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const theme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  fontFamily,
  headings: {
    fontFamily,
    fontWeight: '600',
  },
});
