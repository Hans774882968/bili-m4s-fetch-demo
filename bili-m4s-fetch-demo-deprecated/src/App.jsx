import { useState, useEffect } from 'react';
import './App.css';
import { Button, Layout, List, message } from 'antd';
import 'antd/dist/reset.css';
import { downloadM4s } from './common/request';

const { Header, Content } = Layout;

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [videoPageUrl, setVideoPageUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [base64Result, setBase64Result] = useState('');

  useEffect(() => {
    chrome.storage.sync.get('videoPageUrl', (videoPageUrlWrap) => {
      const newVideoPageUrl = videoPageUrlWrap.videoPageUrl;
      setVideoPageUrl(newVideoPageUrl);
    });

    // https://stackoverflow.com/questions/12265403/passing-message-from-background-js-to-popup-js
    chrome.storage.sync.get('playInfo', (playInfoWrap) => {
      const newPlayInfo = playInfoWrap.playInfo;
      const newUrls = [...newPlayInfo.videoUrls, ...newPlayInfo.audioUrls];
      setUrls(newUrls);
    });
  }, []);

  const [isDownloading, setIsDownloading] = useState(false);
  const copyBtnDisabled = base64Result === '';

  const handleDownload = async (url) => {
    try {
      setIsDownloading(true);
      const downloadOptions = {
        origin: 'https://www.bilibili.com',
        referer: videoPageUrl,
      };
      const base64Str = await downloadM4s(url, downloadOptions);
      setBase64Result(base64Str);
      messageApi.success('下载完成');
    } catch (error) {
      console.error('Error fetching URL:', error);
      messageApi.error('下载出错');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64Result);
    messageApi.success('已复制到剪贴板');
  };

  const appNode = (
    <div className="container">
      <div className="info-container">
        <span>视频页面URL: {videoPageUrl}</span>
      </div>
      <div className="request-container">
        <Layout className="url-list">
          <Header className="sub-div-header">
            <span>URL列表</span>
          </Header>
          <Content className="sub-div-content list-content">
            <List
              itemLayout="horizontal"
              dataSource={urls}
              renderItem={item => (
                <List.Item>
                  <div className="url-item">
                    <span>{item.url}</span>
                    <Button
                      type="primary"
                      onClick={() => handleDownload(item.url)}
                      loading={isDownloading}
                    >
                      获取
                    </Button>
                  </div>
                </List.Item>
              )}
              pagination
            />
          </Content>
        </Layout>

        <Layout className="result-container">
          <Header className="sub-div-header">
            <span>m4s数据的Base64</span>
            <Button
              type="primary"
              onClick={handleCopy}
              disabled={copyBtnDisabled}
            >
              复制
            </Button>
          </Header>
          <Content className="sub-div-content result-content lineclamp10">
            {base64Result}
          </Content>
        </Layout>
      </div>
    </div>
  );

  return (
    <>
      {contextHolder}
      {appNode}
    </>
  );
};

export default App;
