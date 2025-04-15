chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'bili-m4s-fetch-demo',
    title: 'Bili M4S Fetch Demo',
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'bili-m4s-fetch-demo' && tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'openDownloaderDialog' });
  }
});

console.log('[bili-m4s-fetch-demo] background.js loaded');
