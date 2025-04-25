import { getPlayInfoMock } from '../play-info-mock-dev/playInfoMock';

const placeholder = '<play-info-mock />';

export const playInfoMockPlugin = () => {
  return {
    name: 'play-info-mock-plugin',
    enforce: 'post',
    transformIndexHtml(code) {
      if (!code.includes(placeholder)) {
        return null;
      }
      console.log('[play-info-mock-plugin] modifying index.html:', placeholder);
      const playInfoMock = getPlayInfoMock();
      return code.replaceAll(placeholder, playInfoMock);
    }
  };
};
