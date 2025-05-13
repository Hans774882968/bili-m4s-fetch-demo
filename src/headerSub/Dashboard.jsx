import { Modal, Form, Select, Tag } from 'antd';
import './Dashboard.scss';
import ReactJsonView from '@microlink/react-json-view';
import { useState } from 'react';
import { getValidFileName, removeUselessSuffix } from '../utils/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function Dashboard({
  dashboardData,
  documentTitle,
  isDashboardDlgOpen,
  handleDashboardDlgClose,
}) {
  const sourceText = dashboardData.getSourceText();
  const errText = dashboardData.getErrText();
  const { err, playInfoJson } = dashboardData;
  const fileNamePreview = getValidFileName(documentTitle);
  const docTitleUsedInComparation = removeUselessSuffix(documentTitle);
  const titleEqualsFileName = fileNamePreview === docTitleUsedInComparation;

  const SUPPORTED_THEMES = [
    'apathy', 'apathy:inverted', 'ashes', 'bespin', 'brewer',
    'bright:inverted', 'bright', 'chalk', 'codeschool', 'colors',
    'eighties', 'embers', 'flat', 'google', 'grayscale',
    'grayscale:inverted', 'greenscreen', 'harmonic', 'hopscotch', 'isotope',
    'marrakesh', 'mocha', 'monokai', 'ocean', 'paraiso',
    'pop', 'railscasts', 'rjv-default', 'shapeshifter', 'shapeshifter:inverted',
    'solarized', 'summerfruit', 'summerfruit:inverted', 'threezerotwofour', 'tomorrow',
    'tube', 'twilight'
  ];
  const SUPPORTED_THEMES_OPTIONS = SUPPORTED_THEMES.map(theme => ({
    label: theme,
    value: theme,
  }));
  const [jsonViewerTheme, setJsonViewerTheme] = useState('mocha');

  const fNamePreviewTooltip = {
    title: '1. 文件名基于文档标题，并用日期兜底。2. “相等”标签表示，文档标题就是合法文件名。3. 文件名去除了后缀“_哔哩哔哩_bilibili”。',
    icon: <QuestionCircleOutlined />
  };

  return (
    <Modal
      title="仪表盘"
      open={isDashboardDlgOpen}
      footer={[]}
      onCancel={handleDashboardDlgClose}
      width={800}
    >
      <Form layout="horizontal">
        <Form.Item label="文档标题">
          <span>{documentTitle}</span>
        </Form.Item>
        <Form.Item label="文件名预览" tooltip={fNamePreviewTooltip}>
          <div className="file-name-preview-wrap">
            <span>{fileNamePreview}</span>
            {titleEqualsFileName && <Tag color="success">相等</Tag>}
          </div>
        </Form.Item>
        <Form.Item label="数据源">
          <span>{sourceText}</span>
        </Form.Item>
        {
          err && (
            <Form.Item label="错误">
              <span>{errText}</span>
            </Form.Item>
          )
        }
        {
          !err && (
            <>
              <Form.Item label="JSON查看器主题">
                <Select
                  value={jsonViewerTheme}
                  onChange={(value) => setJsonViewerTheme(value)}
                  options={SUPPORTED_THEMES_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="播放信息">
                <ReactJsonView
                  src={playInfoJson}
                  collapseStringsAfterLength={50}
                  displayDataTypes={false}
                  sortKeys={true}
                  theme={jsonViewerTheme}
                  collapsed={3}
                  style={{ overflow: 'auto' }}
                />
              </Form.Item>
            </>
          )
        }
      </Form>
    </Modal>
  );
}
