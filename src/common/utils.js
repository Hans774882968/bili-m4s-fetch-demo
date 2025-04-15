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
