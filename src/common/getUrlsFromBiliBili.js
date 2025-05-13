import { isInBangumiPage } from '../utils/bangumiPage';
import { isInCoursePage } from '../utils/coursePage';
import { DashboardData, SOURCE_API_PUGV, SOURCE_GLOBAL } from './DashboardData';
import { getCoursePagePlayInfoFromApi } from './getCoursePagePlayInfo';
import { parsePlayInfoFromJSCode } from './parsePlayInfoFromJSCode';
import {
  BangumiPlayInfoParser,
  CoursePlayInfoParser,
  ParseRet,
  VideoDetailPlayInfoParser
} from './PlayInfoParsers';

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
  const htmlUrl = window.location.href;
  let resp = null;
  try {
    resp = await fetch(htmlUrl);
  } catch (err) {
    return {
      err: new Error(`fetch ${htmlUrl}:: ${err.message || ''}`),
      playInfo: {}
    };
  }
  if (!resp.ok) {
    return {
      err: new Error(`fetch ${htmlUrl}:: ${resp.statusText}`),
      playInfo: {}
    };
  }
  const htmlStr = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, 'text/html');
  const scriptTags = [...doc.getElementsByTagName('script')];
  const playInfo = parseScriptTags(scriptTags);
  return {
    err: null,
    playInfo
  };
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

/**
 * TODO: 很难修的开发环境BUG：开发环境只会走 else 分支，导致 case3.js 的情况拿不到数据。
 * 这是因为开发环境没法配套给出匹配的 URL 和 case3.js 。代码在生产环境没问题。
*/
export function videoDetailAndBangumiParsePlayInfo(playInfo) {
  let urlsObj = new ParseRet([], []);
  if (isInBangumiPage()) {
    const bpp = new BangumiPlayInfoParser(playInfo);
    urlsObj = bpp.parse();
  } else {
    const vdpp = new VideoDetailPlayInfoParser(playInfo);
    urlsObj = vdpp.parse();
  }
  const urls = [...urlsObj.videoUrls, ...urlsObj.audioUrls];
  return urls;
}

export async function getNewUrlsFromPlayUrlApi() {
  const { err, playInfo } = await getCoursePagePlayInfoFromApi();
  const coursePP = new CoursePlayInfoParser(playInfo);
  const urlsObj = coursePP.parse();
  const urls = [...urlsObj.videoUrls, ...urlsObj.audioUrls];
  const dashboardData = new DashboardData(SOURCE_API_PUGV, playInfo, err);
  return { urls, dashboardData };
}

export async function getNewUrlsFromCurPageHtml() {
  const { err, playInfo } = await getNewPlayInfoFromHtml();
  const urls = videoDetailAndBangumiParsePlayInfo(playInfo);
  const dashboardData = new DashboardData(SOURCE_GLOBAL, playInfo, err);
  return { urls, dashboardData };
}

// 入口1： content.js 调用
export function getUrlsFromBiliBili() {
  const playInfo = getPlayInfoFromScriptTag();
  const urls = videoDetailAndBangumiParsePlayInfo(playInfo);
  const dashboardData = new DashboardData(SOURCE_GLOBAL, playInfo, null);
  return { urls, dashboardData };
}

// 入口2：“同步”按钮调用
export async function getNewUrlsFromFetchApi() {
  if (isInCoursePage()) {
    return getNewUrlsFromPlayUrlApi();
  }
  return getNewUrlsFromCurPageHtml();
}
