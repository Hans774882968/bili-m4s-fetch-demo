import { M4sUrlDesc } from './M4sUrlDesc';
import { parsePlayInfoFromJSCode } from './parsePlayInfoFromJSCode';

/**
 * 对话框里展示的quality就是playinfo的id
 */
const isDev = import.meta.env.MODE === 'development';

function parseScriptTags(scriptTags) {
  for (const scriptTag of scriptTags) {
    const scriptContent = scriptTag.textContent;
    if (!scriptContent || !scriptContent.includes('window.__playinfo__')) continue;
    const playInfo = parsePlayInfoFromJSCode(scriptContent);
    return playInfo;
  }
  return {};
}

// 在同一个url请求，会得到301，但无伤大雅
export async function getNewPlayInfoFromHtml() {
  const resp = await fetch(window.location.href);
  const htmlStr = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, 'text/html');
  const scriptTags = [...doc.getElementsByTagName('script')];
  return parseScriptTags(scriptTags);
}

export function getPlayInfoFromScriptTag() {
  if (!isDev) {
    if (window.__playinfo__ && typeof window.__playinfo__ === 'object') {
      return window.__playinfo__;
    }
  }
  const scriptTags = [...document.getElementsByTagName('script')];
  return parseScriptTags(scriptTags);
}

function getAudioUrlsFromPlayInfo(playInfo) {
  const audioList = playInfo?.data?.dash?.audio || playInfo?.result?.video_info?.dash?.audio;
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

function tryToGetVIPVideoPreview(playInfo) {
  const mp4VideoList = playInfo?.result?.video_info?.durl;
  if (!Array.isArray(mp4VideoList)) return [];
  return mp4VideoList.map((cur) => {
    const m4sUrlDesc = new M4sUrlDesc(cur.url, 'unknown', M4sUrlDesc.VIDEO);
    return m4sUrlDesc;
  });
}

function getVideoUrlsFromPlayInfo(playInfo) {
  const videoList = playInfo?.data?.dash?.video || playInfo?.result?.video_info?.dash?.video;
  if (!Array.isArray(videoList)) return tryToGetVIPVideoPreview(playInfo);
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
