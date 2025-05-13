import { useState } from 'react';
import './App.scss';
import {
  Alert,
  Button,
  Layout,
  List,
  message,
  Modal,
  Progress,
  Tag,
  Tooltip
} from 'antd';
import {
  ArrowsAltOutlined,
  CopyOutlined,
  DashboardTwoTone,
  DownloadOutlined,
  PlusCircleTwoTone,
  QuestionCircleTwoTone,
  ReloadOutlined
} from '@ant-design/icons';
import { downloadM4s } from './common/request';
import { formatFileSize, getM4sFileName } from './utils/utils';
import HansClamp from './clamp-js/HansClamp';
import { getNewUrlsFromFetchApi } from './common/getUrlsFromBiliBili';
import { downloadFileByALink } from './common/downloadFile';
import Copyright from './contentSub/Copyright';
import Dashboard from './headerSub/Dashboard';
import { isInCoursePage } from './utils/coursePage';
import M4sUrlAddForm from './headerSub/M4sUrlAddForm';
import useDocumentTitle from './hooks/useDocumentTitle';

const { Header, Content, Footer } = Layout;

const progressColors = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

function getFileSizeText(fileSize) {
  const strSize = formatFileSize(fileSize);
  return fileSize ? ` (${strSize})` : '';
}

const App = ({ initialUrls, initialDashboardData }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const documentTitle = useDocumentTitle();

  const [urls, setUrls] = useState(initialUrls);
  const [base64Result, setBase64Result] = useState('');
  const [blobResult, setBlobResult] = useState(null);
  const base64SizeText = getFileSizeText(base64Result.length);
  const blobSizeText = getFileSizeText(blobResult?.size || 0);
  // 解决对话框从关闭到打开过程的卡顿问题
  const base64ResultOnDisplay = base64Result.substring(0, 1000);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const copyBtnDisabled = base64Result === '';

  const [m4sDownloadProgress, setM4sDownloadProgress] = useState(0);

  const [m4sFileName, setM4sFileName] = useState('');
  const m4sDownloadSuccessInfoText = `${m4sFileName}${blobSizeText}`;

  // TODO: 进度条数据滞后。原因不明
  function updateM4sDownloadProcess(receivedLength, contentLength) {
    if (contentLength <= 0) return;
    const newProgress = Math.round((receivedLength / contentLength) * 1000) / 10;
    setM4sDownloadProgress(newProgress);
  }

  const handleDownload = async (m4sUrlDesc) => {
    const { url } = m4sUrlDesc;
    try {
      setIsDownloading(true);
      const { base64Str, blob } = await downloadM4s(url, updateM4sDownloadProcess);
      setBase64Result(base64Str);
      setBlobResult(blob);
      setM4sFileName(getM4sFileName(m4sUrlDesc, documentTitle));
      messageApi.success('下载完成');
    } catch (error) {
      console.error(`Error fetching ${url}`, error);
      messageApi.error('下载出错！详见控制台');
    } finally {
      setIsDownloading(false);
      updateM4sDownloadProcess(0, 1);
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

  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [isDashboardDlgOpen, setIsDashboardDlgOpen] = useState(false);
  const openDashboardDialog = () => {
    setIsDashboardDlgOpen(true);
  };
  const handleDashboardDlgClose = () => {
    setIsDashboardDlgOpen(false);
  };

  const [isM4sFormDlgOpen, setIsM4sFormDlgOpen] = useState(false);
  const openM4sFormDialog = () => {
    setIsM4sFormDlgOpen(true);
  };
  const handleM4sFormDlgClose = () => {
    setIsM4sFormDlgOpen(false);
  };

  const addToM4sUrlList = (newUrlDesc) => {
    setUrls((prevUrls) => [newUrlDesc, ...prevUrls]);
    messageApi.success('成功添加到URL列表');
    setIsM4sFormDlgOpen(false);
  };

  const updateM4sUrls = async () => {
    setIsSyncing(true);
    const { urls: newUrls, dashboardData: newDashboardData } = await getNewUrlsFromFetchApi();
    setUrls(newUrls);
    setDashboardData(newDashboardData);
    const { err } = newDashboardData;
    if (!err) {
      messageApi.success('同步完成');
    } else {
      messageApi.error(`同步失败：${err}`);
    }
    setIsSyncing(false);
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

  const coursePageAlertNode = isInCoursePage() && (
    // 写 className 的话优先级比 :where(.css-1d4w9r2).ant-alert 低，所以用内联样式
    <Alert
      style={{
        marginBottom: '16px'
      }}
      message="在课程页面请直接点击“同步”获取音视频URL"
      type="info"
      showIcon
      closable
    />
  );

  const dashboardNode = (
    <Dashboard
      dashboardData={dashboardData}
      documentTitle={documentTitle}
      isDashboardDlgOpen={isDashboardDlgOpen}
      handleDashboardDlgClose={handleDashboardDlgClose}
    />
  );

  const m4sUrlAddFormNode = (
    <M4sUrlAddForm
      isM4sFormDlgOpen={isM4sFormDlgOpen}
      handleM4sFormDlgClose={handleM4sFormDlgClose}
      onAddUrl={addToM4sUrlList}
    />
  );

  const dialogNode = (
    <Modal
      title="B站音视频下载助手"
      open={isDialogOpen}
      footer={[]}
      onCancel={handleDialogClose}
      width={1000}
    >
      {coursePageAlertNode}
      <Layout className="dialog-container">
        <Header className="download-helper-toolbar">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={updateM4sUrls}
            loading={isSyncing}
          >
            同步
          </Button>
          <Tooltip title={syncBtnTooltipTitle}>
            <QuestionCircleTwoTone style={{ fontSize: '16px' }} />
          </Tooltip>
          <DashboardTwoTone
            style={{ fontSize: '16px' }}
            title="仪表盘"
            onClick={openDashboardDialog}
          />
          <PlusCircleTwoTone
            style={{ fontSize: '16px' }}
            title="手动添加URL"
            onClick={openM4sFormDialog}
          />
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
                          <Tag color="blue">{item.getBackupUrlStr()}</Tag>
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
                  defaultPageSize: 20,
                }}
              />
            </Content>
          </Layout>

          <Layout className="process-and-result-container">
            {
              isDownloading && (
                <Header className="sub-div-header">
                  <Progress
                    percent={m4sDownloadProgress}
                    strokeColor={progressColors}
                  />
                </Header>
              )
            }
            {
              m4sFileName && (
                <div className="m4s-download-info-wrap">
                  <HansClamp
                    lines={3}
                    text={m4sDownloadSuccessInfoText}
                    title={m4sDownloadSuccessInfoText}
                  />
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                  >
                    下载
                  </Button>
                </div>
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
                text={base64ResultOnDisplay || '暂无，请先发请求'}
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
      {dashboardNode}
      {m4sUrlAddFormNode}
      {dialogNode}
    </>
  );
};

export default App;
