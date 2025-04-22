const MENU_ITEM_ID = 'bili-m4s-fetch-demo';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ITEM_ID,
    title: 'Bili M4S Fetch Demo',
    documentUrlPatterns: ['https://www.bilibili.com/*']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_ITEM_ID && tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'openDownloaderDialog' });
  }
});

console.log(`[${MENU_ITEM_ID}] background.js loaded`);
