import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

let dialogRef = null;

export function renderDownloaderDialog(initialUrls = [], initialDashboardData = {}) {
  if (dialogRef) {
    return;
  }
  const dialog = document.createElement('div');
  dialog.id = 'bili-downloader-dialog';
  dialog.style.position = 'relative'; // for expand-dialog-btn, may be unnecessary
  document.body.appendChild(dialog);
  dialogRef = dialog;
  createRoot(dialog).render(
    <StrictMode>
      <App
        initialUrls={initialUrls}
        initialDashboardData={initialDashboardData}
      />
    </StrictMode>,
  );
}
