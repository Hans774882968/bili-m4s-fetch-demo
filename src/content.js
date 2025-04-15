import { getUrlsFromBiliBili } from './common/getUrlsFromBiliBili';
import { renderDownloaderDialog } from './main';

const isDev = import.meta.env.MODE === 'development';

window.addEventListener('load', () => {
  const initialUrls = getUrlsFromBiliBili();

  if (isDev) {
    renderDownloaderDialog(initialUrls);
  } else {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'openDownloaderDialog') {
        renderDownloaderDialog(initialUrls);
      }
    });
  }
});

console.log('[bili-m4s-fetch-demo] content.js loaded');
