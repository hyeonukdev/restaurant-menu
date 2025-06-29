import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Switch, InputNumber, message } from "antd";

const { TextArea } = Input;
const { Option } = Select;

interface IntroModalProps {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  onIntroAdded: () => void;
  intro?: any;
  onUpdate?: (updatedIntro: any) => void;
}

export const IntroModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  onIntroAdded,
  intro,
  onUpdate,
}: IntroModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!intro;

  useEffect(() => {
    if (isModalOpen) {
      if (isEditMode && intro) {
        form.setFieldsValue({
          title: intro.title,
          content: intro.content,
          display_order: intro.display_order,
          intro_type: intro.intro_type,
          is_active: intro.is_active,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          display_order: 0,
          intro_type: "text",
          is_active: true,
        });
      }
    }
  }, [isModalOpen, intro, form, isEditMode]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditMode) {
        // 수정 모드
        console.log("Editing intro with ID:", intro.id);

        const response = await fetch(`/api/restaurant/intros/${intro.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            id: intro.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "인트로 수정에 실패했습니다.");
        }

        const result = await response.json();
        console.log("Update successful:", result);

        message.success("인트로가 성공적으로 수정되었습니다.");
        onUpdate?.({ ...values, id: intro.id });
      } else {
        // 추가 모드
        const response = await fetch("/api/restaurant/intros", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("인트로 추가에 실패했습니다.");
        }

        message.success("인트로가 성공적으로 추가되었습니다.");
        onIntroAdded();
      }

      handleOk();
    } catch (error) {
      console.error("Submit error:", error);
      message.error(
        error instanceof Error ? error.message : "작업에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditMode ? "인트로 수정" : "인트로 추가"}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
        <Form.Item
          name="title"
          label="제목"
          rules={[
            {
              required: false,
              message: "제목을 입력해주세요.",
            },
          ]}
        >
          <Input placeholder="제목을 입력하세요 (선택사항)" maxLength={255} />
        </Form.Item>

        <Form.Item
          name="content"
          label="내용"
          rules={[
            {
              required: true,
              message: "내용을 입력해주세요.",
            },
          ]}
        >
          <TextArea
            placeholder="내용을 입력하세요. 개행은 Enter 키를 사용하세요."
            rows={6}
            maxLength={1000}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="display_order"
          label="표시 순서"
          rules={[
            {
              required: true,
              message: "표시 순서를 입력해주세요.",
            },
          ]}
        >
          <InputNumber
            min={0}
            max={999}
            placeholder="0"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="intro_type"
          label="타입"
          rules={[
            {
              required: true,
              message: "타입을 선택해주세요.",
            },
          ]}
        >
          <Select placeholder="타입을 선택하세요">
            <Option value="text">일반 텍스트</Option>
            <Option value="highlight">하이라이트</Option>
            <Option value="menu">메뉴 소개</Option>
            <Option value="slogan">슬로건</Option>
          </Select>
        </Form.Item>

        <Form.Item name="is_active" label="활성화" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
