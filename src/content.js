import { getUrlsFromBiliBili } from './common/getUrlsFromBiliBili';
import { renderDownloaderDialog } from './main';

const isDev = import.meta.env.MODE === 'development';

/**
 * Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
 * content.js 不存在或没执行到 chrome.runtime.onMessage.addListener 就会报这个错
 * 所以需要去掉 window.addEventListener('load', () => {})
 */

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

console.log('[bili-m4s-fetch-demo] content.js loaded');
