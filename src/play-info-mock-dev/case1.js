const tmpVar = {
  'code': 0,
  'message': '0',
  'ttl': 1,
  'data': {
    'dash': {
      'audio': [
        {
          'id': 30280,
          'baseUrl': 'mock baseUrl a1',
          'backupUrl': [
            'mock backupUrl a1',
            'mock backupUrl a2'
          ]
        },
        {
          'id': 30232,
          'baseUrl': 'mock baseUrl a2',
          'backupUrl': [
            'mock backupUrl a3',
            'mock backupUrl a4'
          ]
        },
        {
          'id': 30216,
          'baseUrl': 'mock baseUrl a3',
          'backupUrl': [
            'mock backupUrl a5',
            'mock backupUrl a6'
          ]
        }
      ],
      'video': [
        {
          'id': 80,
          'baseUrl': 'mock baseUrl v1',
          'backupUrl': [
            'mock backupUrl v1',
            'mock backupUrl v2'
          ]
        },
        {
          'id': 64,
          'baseUrl': 'mock baseUrl v2',
          'backupUrl': [
            'mock backupUrl v3',
            'mock backupUrl v4'
          ]
        }
      ]
    }
  }
};
if (tmpVar) {
  window.__playinfo__ = tmpVar;
}
