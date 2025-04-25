import dayjs from 'dayjs';

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

export function getM4sFileName(m4sUrlDesc) {
  const fileName = dayjs().format('YYYYMMDDHHmmss');
  const extName = m4sUrlDesc.isAudio() ? 'mp3' : 'mp4';
  return `${fileName}.${extName}`;
}
