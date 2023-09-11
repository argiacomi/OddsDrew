import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StyleSheetManager } from 'styled-components/macro';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, GlobalStyles, GlobalTheme, shouldForwardProp } from '@styles';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <GlobalStyles />
      <StyleSheetManager
        // disableCSSOMInjection
        // enableVendorPrefixes
        shouldForwardProp={shouldForwardProp}
      >
        <GlobalTheme>
          <App />
        </GlobalTheme>
      </StyleSheetManager>
    </QueryClientProvider>
  </React.StrictMode>
);
