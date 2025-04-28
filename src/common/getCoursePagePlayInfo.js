import { getEpIdOrSeasonId } from './coursePageUtils';

export function getWebSeasonApiUrl({ epId, seasonId }) {
  const WEB_SEASON_API_URL = 'https://api.bilibili.com/pugv/view/web/season';
  const webSeasonUrlParams = new URLSearchParams(epId ? {
    ep_id: epId, isGaiaAvoided: false
  } : {
    season_id: seasonId, isGaiaAvoided: false
  }).toString();
  const webSeasonApiUrl = `${WEB_SEASON_API_URL}?${webSeasonUrlParams}`;
  return webSeasonApiUrl;
}

export async function getWebSeasonInfo(epOrSeason) {
  const webSeasonApiUrl = getWebSeasonApiUrl(epOrSeason);
  const resp = await fetch(webSeasonApiUrl);
  if (!resp.ok) {
    return {
      err: new Error(`fetch ${webSeasonApiUrl}:: ${resp.statusText}`),
      webSeasonInfo: {}
    };
  }
  const webSeasonInfo = await resp.json();
  return {
    err: null,
    webSeasonInfo
  };
}

export function getPlayurlApiUrl(avid, cid, seasonIdPlayUrlUse, epIdPlayUrlUse) {
  const PLAYURL_PUGV_API_URL = 'https://api.bilibili.com/pugv/player/web/playurl';
  const playurlApiUrlParams = new URLSearchParams({
    avid,
    cid,
    fnver: 0,
    fnval: 16,
    fourk: 1,
    from_client: 'BROWSER',
    is_main_page: true,
    need_fragment: false,
    season_id: seasonIdPlayUrlUse,
    isGaiaAvoided: false,
    ep_id: epIdPlayUrlUse,
    voice_balance: 1,
    drm_tech_type: 2
  }).toString();
  const playurlApiUrl = `${PLAYURL_PUGV_API_URL}?${playurlApiUrlParams}`;
  return playurlApiUrl;
}

export async function getCoursePagePlayInfoFromApi() {
  const epOrSeason = getEpIdOrSeasonId(window.location.href);
  const { epId, seasonId } = epOrSeason;
  const { err, webSeasonInfo } = await getWebSeasonInfo(epOrSeason);
  if (err) {
    return {
      err,
      playInfo: {}
    };
  }
  const episodes = webSeasonInfo?.data?.episodes || [];
  if (!Array.isArray(episodes) || episodes.length === 0) {
    return {
      err: new Error(`fetch webSeasonInfo failed: episodes is not valid array. ${episodes}`),
      playInfo: {}
    };
  }
  // TODO: /ss20821 这种情况暂且只拿第一条数据
  const wantedEpisode = epId ? episodes.find(ep => ep.id === epId) : episodes[0];
  const avid = wantedEpisode?.aid;
  const cid = wantedEpisode?.cid;
  const seasonIdPlayUrlUse = seasonId || webSeasonInfo?.data?.season_id;
  const epIdPlayUrlUse = epId || wantedEpisode?.id;
  if (!wantedEpisode || !avid || !cid || !seasonIdPlayUrlUse || !epIdPlayUrlUse) {
    return {
      err: new Error(`fetch playInfo failed: wantedEpisode is not valid. ${wantedEpisode}`),
      playInfo: {}
    };
  }
  const playurlApiUrl = getPlayurlApiUrl(avid, cid, seasonIdPlayUrlUse, epIdPlayUrlUse);
  const resp = await fetch(playurlApiUrl);
  if (!resp.ok) {
    return {
      err: new Error(`fetch ${playurlApiUrl}:: ${resp.statusText}`),
      playInfo: {}
    };
  }
  const playInfo = await resp.json();
  return {
    err: null,
    playInfo
  };
}
