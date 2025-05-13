import { Form, Input, Select, Button, Modal } from 'antd';
import { M4sUrlDesc } from '../common/M4sUrlDesc';
import { QuestionCircleOutlined } from '@ant-design/icons';

const qualityOptions = [
  { value: 'unknown', label: 'unknown' },
  { value: '30280', label: '30280' },
  { value: '30232', label: '30232' },
  { value: '30216', label: '30216' },
  { value: '125', label: '125' },
  { value: '120', label: '120' },
  { value: '116', label: '116' },
  { value: '112', label: '112' },
  { value: '80', label: '80' },
  { value: '64', label: '64' },
  { value: '32', label: '32' },
  { value: '16', label: '16' }
];
const typeOptions = [
  { value: '视频', label: '视频' },
  { value: '音频', label: '音频' }
];
const backupUrlOptions = [
  { value: '后备', label: '后备' },
  { value: '正主', label: '正主' }
];

const { TextArea } = Input;

const M4sUrlAddForm = ({
  isM4sFormDlgOpen,
  handleM4sFormDlgClose,
  onAddUrl
}) => {
  const [form] = Form.useForm();

  const onUrlFieldKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.submit();
    }
  };

  const onFinish = (values) => {
    const { url, quality, type, isBackupUrl } = values;
    const typeValue = type === '视频' ? M4sUrlDesc.VIDEO : M4sUrlDesc.AUDIO;
    const isBackupUrlValue = isBackupUrl === '后备';
    const newUrlDesc = new M4sUrlDesc(
      url,
      quality,
      typeValue,
      isBackupUrlValue
    );
    onAddUrl(newUrlDesc);
    form.resetFields();
  };

  const urlFieldTooltip = {
    title: '按F12键打开开发者工具，在Network栏抓包',
    icon: <QuestionCircleOutlined />
  };
  const qualityFieldTooltip = {
    title: '请求用不到，仅供展示。数据源： playInfo 的 accept_quality 和 m4s URL',
    icon: <QuestionCircleOutlined />
  };

  return (
    <Modal
      title="手动添加URL到URL列表"
      open={isM4sFormDlgOpen}
      footer={[]}
      onCancel={handleM4sFormDlgClose}
      width={660}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="URL"
          tooltip={urlFieldTooltip}
          name="url"
          rules={[{ required: true, message: '请输入m4s URL' }]}
        >
          <TextArea
            rows={6}
            placeholder="请输入m4s URL"
            showCount
            onKeyDown={onUrlFieldKeyDown}
          />
        </Form.Item>

        <Form.Item
          label="品质"
          tooltip={qualityFieldTooltip}
          name="quality"
          initialValue="unknown"
        >
          <Select options={qualityOptions} />
        </Form.Item>

        <Form.Item
          label="类型"
          name="type"
          initialValue="音频"
        >
          <Select options={typeOptions} />
        </Form.Item>

        <Form.Item
          label="是否后备URL"
          name="isBackupUrl"
          initialValue="正主"
        >
          <Select options={backupUrlOptions} />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default M4sUrlAddForm;
