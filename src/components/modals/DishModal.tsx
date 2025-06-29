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
import { ImageUpload } from "../ui/ImageUpload";

interface DishModalProps {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  onDishAdded: () => void;
  categories?: any[];
  categoriesLoading?: boolean;
}

export const DishModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  onDishAdded,
  categories = [],
  categoriesLoading = false,
}: DishModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const newDish = {
        name: values.name,
        ingredients: values.ingredients || "",
        description: values.description || "",
        price: values.price,
        bestSeller: values.bestSeller || false,
        imageUrl: imageUrl || "",
        category: values.category,
      };

      // API 호출
      const response = await fetch("/api/dishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDish),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "메뉴 추가에 실패했습니다.");
      }

      const result = await response.json();

      if (result.message) {
        message.success("메뉴가 성공적으로 추가되었습니다.");
        onDishAdded();
        handleOk();
        form.resetFields();
        setImageUrl("");
      } else {
        throw new Error(result.error || "메뉴 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("메뉴 추가 오류:", error);
      message.error(
        error instanceof Error ? error.message : "메뉴 추가에 실패했습니다."
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
    setImageUrl("");
    handleCancel();
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    form.setFieldValue("imageUrl", url);
  };

  const handleImageRemove = () => {
    setImageUrl("");
    form.setFieldValue("imageUrl", "");
  };

  // 동적 카테고리 옵션 생성
  const categoryOptions =
    categories.length > 0
      ? categories.map((category) => ({
          value: category.name,
          label: category.name,
        }))
      : [
          { value: "Dishes", label: "Dishes" },
          { value: "Coffee", label: "Coffee" },
          { value: "Beer", label: "Beer" },
          { value: "Wine", label: "Wine" },
          { value: "Desserts", label: "Desserts" },
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
            rules={[{ required: false, message: "재료를 입력하세요" }]}
          >
            <TextArea
              rows={2}
              placeholder="재료를 입력하세요 (선택사항, 예: 감자, 버섯, 치즈)"
            />
          </Form.Item>

          <Form.Item
            label="설명"
            name="description"
            rules={[{ required: false, message: "설명을 입력하세요" }]}
          >
            <TextArea
              rows={3}
              placeholder="메뉴에 대한 설명을 입력하세요 (선택사항)"
            />
          </Form.Item>

          <Form.Item
            label="카테고리"
            name="category"
            rules={[{ required: true, message: "카테고리를 선택하세요" }]}
            initialValue={categoryOptions[0]?.value || "Dishes"}
          >
            <Select
              style={{ width: "100%" }}
              options={categoryOptions}
              placeholder="카테고리를 선택하세요"
              loading={categoriesLoading}
              disabled={categoriesLoading}
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
            label="이미지"
            name="imageUrl"
            rules={[{ required: false, message: "이미지를 업로드하세요" }]}
          >
            <ImageUpload
              currentImageUrl={imageUrl}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              disabled={loading}
            />
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
              추가
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
