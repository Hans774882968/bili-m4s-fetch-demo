// https://www.cnblogs.com/Sherries/p/14840404.html
export function blobToDataURI(blob) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (e) => {
      res(e.target.result);
    };
    reader.onerror = () => {
      rej(new Error('文件流异常'));
    };
  });
}

export async function sendFetchReq(
  url,
  callback = (receivedLength, contentLength) => { },
  options = { referer: '', rangeStart: 0 }
) {
  const { referer } = options;
  let { rangeStart } = options;
  rangeStart = typeof rangeStart === 'number' ? rangeStart : 0;
  const resp = await fetch(url, {
    headers: {
      'accept': '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'range': `bytes=${rangeStart}-`,
      // This header is unnecessary. 'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site'
    },
    ...(referer ? { referrer: referer } : {}),
    referrerPolicy: 'no-referrer-when-downgrade',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'omit'
  });
  const reader = resp.body.getReader();
  const contentLength = Number(resp.headers.get('content-length')) || 0;
  callback(0, contentLength);
  let receivedLength = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
    callback(receivedLength, contentLength);
  }
  return new Blob(chunks);
}

export async function downloadM4s(
  url,
  callback = (receivedLength, contentLength) => { },
  options = { referer: '' }
) {
  const { referer } = options;
  const blob = await sendFetchReq(url, callback, { referer, rangeStart: 0 });
  const dataURI = await blobToDataURI(blob);
  // data:application/octet-stream;base64,
  const rawBase64Str = String(dataURI);
  const base64Str = rawBase64Str.substring(rawBase64Str.indexOf('base64,') + 7);
  return { base64Str, blob };
}
