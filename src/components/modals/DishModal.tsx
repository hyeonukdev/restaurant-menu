import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Divider,
  Typography,
  Switch,
  InputNumber,
} from "antd";
const { Title } = Typography;
const { TextArea } = Input;

interface DishModalProps {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

export const DishModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
}: DishModalProps) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values);
    // TODO: API 호출로 메뉴 추가
    handleOk();
    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancelClick = () => {
    form.resetFields();
    handleCancel();
  };

  const categoryOptions = [
    { value: "Dishes", label: "메인 요리" },
    { value: "Coffee", label: "커피" },
    { value: "Beer", label: "맥주" },
    { value: "Wine", label: "와인" },
    { value: "Desserts", label: "디저트" },
  ];

  return (
    <>
      <Modal
        title={
          <Title
            level={4}
            style={{
              margin: "10px 0px",
            }}
          >
            새 메뉴 추가
          </Title>
        }
        open={isModalOpen}
        footer={[]}
        onCancel={handleCancelClick}
        closable={false}
        width={600}
      >
        <Divider />

        <Form
          form={form}
          name="dishForm"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="메뉴명"
            name="name"
            rules={[{ required: true, message: "메뉴명을 입력하세요" }]}
          >
            <Input placeholder="메뉴명을 입력하세요" />
          </Form.Item>

          <Form.Item
            label="재료"
            name="ingredients"
            rules={[{ required: true, message: "재료를 입력하세요" }]}
          >
            <TextArea
              rows={2}
              placeholder="재료를 입력하세요 (예: 감자, 버섯, 치즈)"
            />
          </Form.Item>

          <Form.Item
            label="설명"
            name="description"
            rules={[{ required: true, message: "설명을 입력하세요" }]}
          >
            <TextArea rows={3} placeholder="메뉴에 대한 설명을 입력하세요" />
          </Form.Item>

          <Form.Item
            label="카테고리"
            name="category"
            rules={[{ required: true, message: "카테고리를 선택하세요" }]}
            initialValue="Dishes"
          >
            <Select
              style={{ width: "100%" }}
              options={categoryOptions}
              placeholder="카테고리를 선택하세요"
            />
          </Form.Item>

          <Form.Item
            label="기본 가격"
            name="price"
            rules={[{ required: true, message: "가격을 입력하세요" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="가격을 입력하세요"
              min={0}
              addonBefore="₩"
            />
          </Form.Item>

          <Form.Item
            label="베스트셀러"
            name="bestSeller"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="이미지 URL"
            name="imageUrl"
            rules={[{ required: false, message: "이미지 URL을 입력하세요" }]}
          >
            <Input placeholder="이미지 URL을 입력하세요 (선택사항)" />
          </Form.Item>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              alignItems: "end",
              width: "100%",
              marginTop: "20px",
            }}
          >
            <Button
              onClick={handleCancelClick}
              htmlType="reset"
              style={{ marginRight: "10px" }}
            >
              취소
            </Button>
            <Button type="primary" htmlType="submit">
              추가
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
