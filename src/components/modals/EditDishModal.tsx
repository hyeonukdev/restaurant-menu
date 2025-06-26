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
  message,
} from "antd";
const { Title } = Typography;
const { TextArea } = Input;
import { useState } from "react";
import { TMenuItem, PriceNameType } from "@/types/dish";

interface EditDishModalProps {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  dish: TMenuItem | null;
  onUpdate: (updatedDish: TMenuItem) => void;
}

export const EditDishModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  dish,
  onUpdate,
}: EditDishModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    { value: "Dishes", label: "메인 요리" },
    { value: "Coffee", label: "커피" },
    { value: "Beer", label: "맥주" },
    { value: "Wine", label: "와인" },
    { value: "Desserts", label: "디저트" },
  ];

  // 모달이 열릴 때 폼 초기값 설정
  const handleModalOpen = () => {
    if (dish) {
      form.setFieldsValue({
        name: dish.name,
        ingredients: dish.ingredients,
        description: dish.description,
        price: dish.prices[0]?.price || 0,
        bestSeller: dish.bestSeller,
        imageUrl: dish.imageUrl,
      });
    }
  };

  const onFinish = async (values: any) => {
    if (!dish) return;

    setLoading(true);
    try {
      const updatedDish: TMenuItem = {
        ...dish,
        name: values.name,
        ingredients: values.ingredients,
        description: values.description,
        prices: [{ name: PriceNameType.STANDARD, price: values.price }],
        bestSeller: values.bestSeller,
        imageUrl: values.imageUrl || "",
      };

      // API 호출
      const response = await fetch(`/api/dishes/${dish.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDish),
      });

      if (!response.ok) {
        throw new Error("메뉴 수정에 실패했습니다.");
      }

      const result = await response.json();

      if (result.success) {
        message.success("메뉴가 성공적으로 수정되었습니다.");
        onUpdate(updatedDish);
        handleOk();
        form.resetFields();
      } else {
        throw new Error(result.message || "메뉴 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("메뉴 수정 오류:", error);
      message.error(
        error instanceof Error ? error.message : "메뉴 수정에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("폼 입력을 확인해주세요.");
  };

  const handleCancelClick = () => {
    form.resetFields();
    handleCancel();
  };

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
            메뉴 수정
          </Title>
        }
        open={isModalOpen}
        footer={[]}
        onCancel={handleCancelClick}
        closable={false}
        width={600}
        afterOpenChange={(open) => {
          if (open) {
            handleModalOpen();
          }
        }}
      >
        <Divider />

        <Form
          form={form}
          name="editDishForm"
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
              disabled={loading}
            >
              취소
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              수정
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
