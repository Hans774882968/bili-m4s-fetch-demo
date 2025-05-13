import dayjs from 'dayjs';
import filenamify from 'filenamify';

export function formatFileSize(fileSize) {
  if (fileSize < 1024) {
    return `${fileSize}B`;
  }
  if (fileSize < (1024 * 1024)) {
    const temp = fileSize / 1024;
    return `${temp.toFixed(2)}KB`;
  }
  if (fileSize < (1024 * 1024 * 1024)) {
    const temp = fileSize / (1024 * 1024);
    return `${temp.toFixed(2)}MB`;
  }
  const temp = fileSize / (1024 * 1024 * 1024);
  return `${temp.toFixed(2)}GB`;
}

export const M4S_FILENAME_SRC_TITLE = Symbol('src-title');
export const M4S_FILENAME_SRC_TIME = Symbol('src-time');

export function getM4sFileName(m4sUrlDesc, documentTitle, src = M4S_FILENAME_SRC_TITLE) {
  const getFileNameFromTime = () => dayjs().format('YYYYMMDDHHmmss');
  let fileName = '';
  if (src === M4S_FILENAME_SRC_TITLE) {
    fileName = getValidFileName(documentTitle);
    if (!fileName) {
      fileName = getFileNameFromTime();
    }
  } else {
    fileName = getFileNameFromTime();
  }
  const extName = m4sUrlDesc.isAudio() ? 'mp3' : 'mp4';
  return `${fileName}.${extName}`;
}

export function removeUselessSuffix(text) {
  const uselessSuffixTexts = [
    '_哔哩哔哩_bilibili', '-bilibili-哔哩哔哩', '-哔哩哔哩-bilibili', 'bilibili',
    '哔哩哔哩', '-番剧-高清独家在线观看'
  ];
  // 按长度从长到短排序，优先匹配更长的后缀
  const sortedSuffixes = [...uselessSuffixTexts].sort((a, b) => b.length - a.length);
  let res = text;
  let changed = false;
  do {
    changed = false;
    for (const suffix of sortedSuffixes) {
      if (res.endsWith(suffix)) {
        res = res.slice(0, -suffix.length);
        changed = true;
        break;
      }
    }
  } while (changed);
  return res;
}

export function getValidFileName(fileName) {
  let cleanedFileName = removeUselessSuffix(fileName);
  cleanedFileName = filenamify(cleanedFileName, { replacement: '_' });
  cleanedFileName = cleanedFileName.trim().replace(/^\.+|\.+$/g, '');
  return cleanedFileName;
}
