const playurlSSRData = {
  'code': 0, 'message': 'success', 'result': {
    'video_info': {
      'dash': {
        'audio': [
          {
            'id': 302800,
            'baseUrl': 'not a url a1 very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long'
          }
        ],
        'video': []
      }
    }
  }
};
if (playurlSSRData) {
  const tmpVal = true;
  if (tmpVal) {
    window.__playinfo__ = playurlSSRData;
    const config = {};
    config.prefetch = {
      playUrl: playurlSSRData,
    };
  }
}
