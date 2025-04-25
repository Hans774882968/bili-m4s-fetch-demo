const playurlSSRData = {
  'code': 0, 'message': 'success', 'result': {
    'video_info': {
      'durl': [
        {
          'url': 'not a url d1',
          'md5': '8851b33b845dd5cd7c3b9c4ef9bb249f',
          'order': 1,
          'backup_url': ['not a url db1', 'not a url db2']
        }
      ]
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
