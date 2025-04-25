import fs from 'fs';
import path from 'path';

const playInfoJSFileDir = __dirname;

function readMockCaseJS() {
  const files = fs.readdirSync(playInfoJSFileDir);
  const res = files.reduce((res, fileName) => {
    if (!fileName.endsWith('.js')) return res;
    if (!fileName.startsWith('case')) return res;
    try {
      const jsFilePath = path.resolve(playInfoJSFileDir, fileName);
      const jsCode = fs.readFileSync(jsFilePath, 'utf8');
      res.push(jsCode);
    } catch (e) {
      console.error('read js file error', fileName, e);
    }
    return res;
  }, []);
  return res;
}

export function getPlayInfoMock() {
  const mockCases = readMockCaseJS();
  const rndIdx = Math.floor(Math.random() * mockCases.length);
  const mockCase = mockCases.length ? mockCases[rndIdx] : '';
  const playInfoMock = `<script>${mockCase}</script>`;
  return playInfoMock;
}
