import { LinkOutlined } from '@ant-design/icons';
import './Copyright.scss';
import { Button } from 'antd';

export default function Copyright() {
  return (
    <div className="copyright">
      Made with <span style={{ color: 'white' }}>❤</span> by
      <div className="author">
        <Button
          icon={<LinkOutlined />}
          size="large"
          type="link"
          href="https://github.com/Hans774882968"
          target="_blank">
          Hans
        </Button>
      </div>
    </div>
  );
}
