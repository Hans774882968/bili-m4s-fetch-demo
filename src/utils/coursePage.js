// TODO: 这样写也 OK ，后续改成在 useEffect 中拿
export function isInCoursePage() {
  const url = window.location.pathname;
  return url.startsWith('/cheese/play');
}

export function getEpIdOrSeasonId(url) {
  const urlObj = new URL(url);
  const curUrlPathParts = urlObj.pathname.split('/');
  const episodeIdOrSeasonId = curUrlPathParts[curUrlPathParts.length - 1];
  const pureId = episodeIdOrSeasonId.slice(2);
  const idNumber = parseInt(pureId);
  if (episodeIdOrSeasonId.startsWith('ep')) {
    return { epId: idNumber, seasonId: null };
  }
  return { epId: null, seasonId: idNumber };
}
