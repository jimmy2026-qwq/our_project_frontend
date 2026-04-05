import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AppFeedbackProvider, AuthProvider, DialogProvider } from '@/providers';
import { router } from '@/router';

import './index.css';
import './styles/app.css';
import './styles/template-shell.css';

function normalizeLegacyHashRoute() {
  const hash = window.location.hash;

  if (!hash.startsWith('#/')) {
    return;
  }

  const nextPath = hash.slice(1);
  window.history.replaceState(null, '', nextPath);
}

normalizeLegacyHashRoute();

const container = document.getElementById('root');

if (!container) {
  throw new Error('App root #root was not found.');
}

createRoot(container).render(
  <StrictMode>
    <AuthProvider>
      <DialogProvider>
        <AppFeedbackProvider>
          <RouterProvider router={router} />
        </AppFeedbackProvider>
      </DialogProvider>
    </AuthProvider>
  </StrictMode>,
);
