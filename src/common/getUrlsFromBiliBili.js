import { M4sUrlDesc } from './M4sUrlDesc';

/**
 * 对话框里展示的quality就是playinfo的id
 */
const isDev = import.meta.env.MODE === 'development';

function parseScriptTags(scriptTags) {
  for (const scriptTag of scriptTags) {
    const scriptContent = scriptTag.textContent;
    if (!scriptContent || !scriptContent.includes('window.__playinfo__')) continue;
    const startIndex = scriptContent.indexOf('{');
    const endIndex = scriptContent.lastIndexOf('}') + 1;
    const jsonString = scriptContent.slice(startIndex, endIndex);
    try {
      const playInfo = JSON.parse(jsonString);
      return playInfo;
    } catch (error) {
      console.error('Error parsing playInfo JSON:', error);
    }
  }
  return {};
}

export async function getNewPlayInfoFromHtml() {
  const resp = await fetch(window.location.href);
  const htmlStr = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, 'text/html');
  const scriptTags = [...doc.getElementsByTagName('script')];
  return parseScriptTags(scriptTags);
}

export function getPlayInfoFromScriptTag() {
  if (window.__playinfo__ && typeof window.__playinfo__ === 'object') {
    return window.__playinfo__;
  }
  const scriptTags = [...document.getElementsByTagName('script')];
  return parseScriptTags(scriptTags);
}

function getAudioUrlsFromPlayInfo(playInfo) {
  const audioList = playInfo?.data?.dash?.audio;
  if (!Array.isArray(audioList)) return [];
  const res = audioList.reduce((res, cur) => {
    const baseUrl = cur.baseUrl;
    if (baseUrl) {
      const m4sUrlDesc = new M4sUrlDesc(cur.baseUrl, cur.id, M4sUrlDesc.AUDIO);
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
      const m4sUrlDesc = new M4sUrlDesc(cur.baseUrl, cur.id, M4sUrlDesc.VIDEO);
      res.push(m4sUrlDesc);
      qualitySet.add(cur.id);
    }
    return res;
  }, []);
  return res;
}

export function getUrlsObjFromPlayInfo(playInfo) {
  const audioUrls = getAudioUrlsFromPlayInfo(playInfo);
  const videoUrls = getVideoUrlsFromPlayInfo(playInfo);
  return { audioUrls, videoUrls };
}

export function getUrlsFromBiliBili() {
  if (isDev) {
    return [
      new M4sUrlDesc('not a url 1', 80, M4sUrlDesc.VIDEO),
      new M4sUrlDesc('not a url 2', 64, M4sUrlDesc.VIDEO),
      new M4sUrlDesc('not a url 3', 32, M4sUrlDesc.VIDEO),
      new M4sUrlDesc('not a url 4', 16, M4sUrlDesc.VIDEO),
      new M4sUrlDesc('not a url 5', 30280, M4sUrlDesc.AUDIO),
      new M4sUrlDesc('not a url 6', 30232, M4sUrlDesc.AUDIO),
      new M4sUrlDesc('not a url 7', 30216, M4sUrlDesc.AUDIO),
      new M4sUrlDesc(`this is a ${'long'.repeat(200)} url`, 114514, M4sUrlDesc.AUDIO)
    ];
  }
  const playInfo = getPlayInfoFromScriptTag();
  const urlsObj = getUrlsObjFromPlayInfo(playInfo);
  const urls = [...urlsObj.videoUrls, ...urlsObj.audioUrls];
  return urls;
}

export async function getNewUrlsFromHtml() {
  const playInfo = await getNewPlayInfoFromHtml();
  const urlsObj = getUrlsObjFromPlayInfo(playInfo);
  const urls = [...urlsObj.videoUrls, ...urlsObj.audioUrls];
  return urls;
}
