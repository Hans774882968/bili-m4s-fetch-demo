window.addEventListener('load', () => {
  function getPlayInfoFromScriptTag() {
    const scriptTags = [...document.getElementsByTagName('script')];
    for (const scriptTag of scriptTags) {
      const scriptContent = scriptTag.textContent;
      if (!scriptContent || !scriptContent.includes('window.__playinfo__')) continue;
      const startIndex = scriptContent.indexOf('{');
      const endIndex = scriptContent.lastIndexOf('}') + 1;
      const jsonString = scriptContent.slice(startIndex, endIndex);
      try {
        const playInfo = JSON.parse(jsonString);
        return playInfo;
      } catch (error) {
        console.error('Error parsing playInfo JSON:', error);
      }
    }
    return {};
  }

  const playInfo = getPlayInfoFromScriptTag();
  const messageObj = {
    type: 'sendPlayInfoToBg',
    data: playInfo,
  };
  chrome.runtime.sendMessage(messageObj);
});

console.log('[bili-m4s-fetch-demo] content.js loaded');
