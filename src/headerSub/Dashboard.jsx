import { Modal, Form, Select } from 'antd';
import ReactJsonView from '@microlink/react-json-view';
import { useState } from 'react';

export default function Dashboard({
  dashboardData,
  isDashboardDlgOpen,
  handleDashboardDlgClose,
}) {
  const sourceText = dashboardData.getSourceText();
  const errText = dashboardData.getErrText();
  const { err, playInfoJson } = dashboardData;
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

  return (
    <Modal
      title="仪表盘"
      open={isDashboardDlgOpen}
      footer={[]}
      onCancel={handleDashboardDlgClose}
      width={800}
    >
      <Form layout="horizontal">
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
                />
              </Form.Item>
            </>
          )
        }
      </Form>
    </Modal>
  );
}
