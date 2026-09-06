import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mantine/core/styles.css';
import App from './app/app';
import { theme } from './theme/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    // Fail fast instead of TanStack Query's default 3-retry exponential backoff:
    // the backend is a local dev dependency, not a flaky remote service, so a
    // single retry is enough to ride out a transient blip without making the
    // client feel like it's hanging when the server just isn't running.
    queries: { retry: 1, retryDelay: 500 },
    mutations: { retry: 0 },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
