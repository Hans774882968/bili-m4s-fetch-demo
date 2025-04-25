import { useState } from 'react';
import './App.scss';
import { Button, Layout, List, message, Modal, Tag, Tooltip } from 'antd';
import {
  ArrowsAltOutlined,
  CopyOutlined,
  DownloadOutlined,
  QuestionCircleTwoTone,
  ReloadOutlined
} from '@ant-design/icons';
import { downloadM4s } from './common/request';
import { formatFileSize, getM4sFileName } from './common/utils';
import HansClamp from './clamp-js/HansClamp';
import { getNewUrlsFromHtml } from './common/getUrlsFromBiliBili';
import { downloadFileByALink } from './common/downloadFile';
import Copyright from './contentSub/Copyright';

const { Header, Content, Footer } = Layout;

function getFileSizeText(fileSize) {
  const strSize = formatFileSize(fileSize);
  return fileSize ? ` (${strSize})` : '';
}

const App = ({ initialUrls }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [urls, setUrls] = useState(initialUrls);
  const [base64Result, setBase64Result] = useState('');
  const [blobResult, setBlobResult] = useState(null);
  const base64SizeText = getFileSizeText(base64Result.length);
  const blobSizeText = getFileSizeText(blobResult?.size || 0);

  const [isDownloading, setIsDownloading] = useState(false);
  const copyBtnDisabled = base64Result === '';

  const [m4sFileName, setM4sFileName] = useState('');

  const handleDownload = async (m4sUrlDesc) => {
    const { url } = m4sUrlDesc;
    try {
      setIsDownloading(true);
      const { base64Str, blob } = await downloadM4s(url);
      setBase64Result(base64Str);
      setBlobResult(blob);
      setM4sFileName(getM4sFileName(m4sUrlDesc));
      messageApi.success('下载完成');
    } catch (error) {
      console.error('Error fetching URL:', error);
      messageApi.error('下载出错');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExport = () => {
    downloadFileByALink(blobResult, m4sFileName);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64Result);
    messageApi.success('已复制到剪贴板');
  };

  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const expandDialog = () => {
    setIsDialogOpen(true);
  };

  const updateM4sUrls = async () => {
    const newUrls = await getNewUrlsFromHtml();
    setUrls(newUrls);
    messageApi.success('同步完成');
  };

  const syncBtnTooltipTitle = (
    <span>
      TODO: 由于时间仓促，先不实现列表的自动更新，只提供手动更新列表功能
      <br />
      更新原理：向当前页面发请求，拿到最新的 window.__playinfo__
    </span>
  );
  const expandDialogBtn = !isDialogOpen && (
    <Button
      type="primary"
      className="expand-dialog-btn"
      style={{ position: 'fixed', zIndex: 114514, top: '80px', right: '16px' }}
      icon={<ArrowsAltOutlined />}
      onClick={expandDialog}
    >
      展开下载助手
    </Button>
  );

  const dialogNode = (
    <Modal
      title="B站视频下载助手"
      open={isDialogOpen}
      footer={[]}
      onCancel={handleDialogClose}
      width={1000}
    >
      <Layout className="dialog-container">
        <Header className="download-helper-toolbar">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={updateM4sUrls}
          >
            同步
          </Button>
          <Tooltip title={syncBtnTooltipTitle}>
            <QuestionCircleTwoTone style={{ fontSize: '16px' }} />
          </Tooltip>
        </Header>

        <Content className="request-container">
          <Layout className="url-list">
            <Header
              className="sub-div-header"
              style={{
                backgroundColor: 'white'
              }}
            >
              <span>URL列表</span>
            </Header>
            <Content className="sub-div-content list-content">
              <List
                itemLayout="horizontal"
                dataSource={urls}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div>
                          <Tag color="blue">{item.getTypeStr()}</Tag>
                          <span>quality: {item.quality}</span>
                        </div>
                      }
                      description={
                        <div className="url-item">
                          <span className="url-text" title={item.url}>{item.url}</span>
                          <Button
                            type="primary"
                            size="small"
                            autoInsertSpace={false}
                            onClick={() => handleDownload(item)}
                            loading={isDownloading}
                          >
                            获取
                          </Button>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                pagination={{
                  showTotal: (total) => `${total}条`,
                  showSizeChanger: true,
                }}
              />
            </Content>
          </Layout>

          <Layout className="result-container">
            {
              m4sFileName && (
                <Header className="sub-div-header">
                  <span>{m4sFileName}{blobSizeText}</span>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                  >
                    下载
                  </Button>
                </Header>
              )
            }
            <Header className="sub-div-header">
              <span>m4s数据的Base64{base64SizeText}</span>
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={handleCopy}
                disabled={copyBtnDisabled}
              >
                复制
              </Button>
            </Header>
            <Content className="sub-div-content result-content">
              <HansClamp
                lines={10}
                text={base64Result || '暂无，请先发请求'}
              />
            </Content>
          </Layout>
        </Content>

        <Footer className="copyright-container">
          <Copyright />
        </Footer>
      </Layout>
    </Modal>
  );

  return (
    <>
      {contextHolder}
      {expandDialogBtn}
      {dialogNode}
    </>
  );
};

export default App;
