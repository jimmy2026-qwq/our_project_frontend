import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AppErrorBoundary } from '@/app/AppErrorBoundary';
import {
  AppFeedbackProvider,
  AuthProvider,
  DialogProvider,
  RealtimeProvider,
} from '@/providers';
import { router } from '@/router';

import './index.css';

const normalizeLegacyHashRoute = () => {
  const hash = window.location.hash;

  if (!hash.startsWith('#/')) {
    return;
  }

  const nextPath = hash.slice(1);
  window.history.replaceState(null, '', nextPath);
};

normalizeLegacyHashRoute();

const container = document.getElementById('root');

if (!container) {
  throw new Error('App root #root was not found.');
}

createRoot(container).render(
  <StrictMode>
    <AppErrorBoundary>
      <AuthProvider>
        <RealtimeProvider>
          <DialogProvider>
            <AppFeedbackProvider>
              <RouterProvider router={router} />
            </AppFeedbackProvider>
          </DialogProvider>
        </RealtimeProvider>
      </AuthProvider>
    </AppErrorBoundary>
  </StrictMode>,
);
