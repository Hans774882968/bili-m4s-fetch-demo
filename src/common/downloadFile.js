export function downloadFileByALink(blob, fileName) {
  const aLink = document.createElement('a');
  document.body.appendChild(aLink);
  aLink.style.display = 'none';
  const objectUrl = window.URL.createObjectURL(blob);
  aLink.href = objectUrl;
  aLink.download = fileName;
  aLink.click();
  document.body.removeChild(aLink);
}
