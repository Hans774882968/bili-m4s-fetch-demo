chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'bili-m4s-fetch-demo',
    title: 'Bili M4S Fetch Demo',
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.storage.sync.set({ videoPageUrl: info.pageUrl });
  const popup_url = chrome.runtime.getURL('index.html');
  chrome.windows.create({ url: popup_url, type: 'popup', width: 1024, height: 768 });
});

function getAudioUrlsFromPlayInfo(playInfo) {
  const audioList = playInfo?.data?.dash?.audio;
  if (!Array.isArray(audioList)) return [];
  const res = audioList.reduce((res, cur) => {
    const baseUrl = cur.baseUrl;
    if (baseUrl) {
      const m4sUrlDesc = {
        url: cur.baseUrl,
        quality: cur.id || 'unknown',
      };
      res.push(m4sUrlDesc);
    }
    return res;
  }, []);
  return res;
}

function getVideoUrlsFromPlayInfo(playInfo) {
  const videoList = playInfo?.data?.dash?.video;
  if (!Array.isArray(videoList)) return [];
  const qualitySet = new Set();
  const res = videoList.reduce((res, cur) => {
    const baseUrl = cur.baseUrl;
    // TODO: cur.id 原则上存在，先不管它不存在的情况了
    if (baseUrl && !qualitySet.has(cur.id)) {
      const m4sUrlDesc = {
        url: cur.baseUrl,
        quality: cur.id || 'unknown',
      };
      res.push(m4sUrlDesc);
      qualitySet.add(cur.id);
    }
    return res;
  }, []);
  return res;
}

function getUrlsFromPlayInfo(playInfo) {
  const audioUrls = getAudioUrlsFromPlayInfo(playInfo);
  const videoUrls = getVideoUrlsFromPlayInfo(playInfo);
  return { audioUrls, videoUrls };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'sendPlayInfoToBg') return;
  const urlsObj = getUrlsFromPlayInfo(message.data);
  chrome.storage.sync.set({ playInfo: urlsObj });
});

console.log('[bili-m4s-fetch-demo] background.js loaded');
