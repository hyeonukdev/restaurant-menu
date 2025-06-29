import { useState, useEffect, useMemo, ReactElement } from "react";
import { Modal, Form, Input, Select, InputNumber, message } from "antd";
import {
  IconBread,
  IconCoffee,
  IconBeer,
  IconGlassFull,
  IconIceCream2,
  IconMeat,
  IconFish,
  IconSalad,
  IconChefHat,
  IconCake,
  IconPizza,
  IconApple,
  IconCup,
  IconBottle,
  IconCookie,
  IconCarrot,
  IconEgg,
  IconToolsKitchen2,
  IconSoup,
  IconBowl,
} from "@tabler/icons-react";

const { TextArea } = Input;
const { Option } = Select;

interface CategoryModalProps {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  onCategoryAdded: () => void;
  category?: any;
  onUpdate?: (updatedCategory: any) => void;
}

// 카테고리에 적합한 Tabler 아이콘 목록
const categoryIcons = [
  { name: "IconBread", label: "빵/요리", component: IconBread },
  { name: "IconCoffee", label: "커피", component: IconCoffee },
  { name: "IconBeer", label: "맥주", component: IconBeer },
  { name: "IconGlassFull", label: "와인/음료", component: IconGlassFull },
  { name: "IconIceCream2", label: "디저트", component: IconIceCream2 },
  { name: "IconMeat", label: "고기 요리", component: IconMeat },
  { name: "IconFish", label: "해산물", component: IconFish },
  { name: "IconSalad", label: "샐러드", component: IconSalad },
  { name: "IconChefHat", label: "시그니처", component: IconChefHat },
  { name: "IconCake", label: "케이크", component: IconCake },
  { name: "IconPizza", label: "피자", component: IconPizza },
  { name: "IconApple", label: "과일", component: IconApple },
  { name: "IconCup", label: "차/음료", component: IconCup },
  { name: "IconBottle", label: "병 음료", component: IconBottle },
  { name: "IconCookie", label: "쿠키/과자", component: IconCookie },
  { name: "IconCarrot", label: "채소", component: IconCarrot },
  { name: "IconEgg", label: "계란 요리", component: IconEgg },
  {
    name: "IconToolsKitchen2",
    label: "주방 특선",
    component: IconToolsKitchen2,
  },
  { name: "IconSoup", label: "수프/국물", component: IconSoup },
  { name: "IconBowl", label: "밥/면", component: IconBowl },
];

export const CategoryModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  onCategoryAdded,
  category,
  onUpdate,
}: CategoryModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!category;

  useEffect(() => {
    if (isModalOpen) {
      if (isEditMode && category) {
        form.setFieldsValue({
          name: category.name,
          description: category.description,
          icon: category.icon || "IconBread",
          display_order: category.display_order || 0,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          icon: "IconBread",
          display_order: 0,
        });
      }
    }
  }, [isModalOpen, category, form, isEditMode]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditMode) {
        // 수정 모드
        console.log("Editing category with ID:", category.id);

        const response = await fetch(`/api/categories/${category.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            id: category.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "카테고리 수정에 실패했습니다.");
        }

        const result = await response.json();
        console.log("Update successful:", result);

        message.success("카테고리가 성공적으로 수정되었습니다.");
        onUpdate?.({ ...values, id: category.id });
      } else {
        // 추가 모드
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "카테고리 추가에 실패했습니다.");
        }

        message.success("카테고리가 성공적으로 추가되었습니다.");
        onCategoryAdded();
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

  // 아이콘 렌더링 함수 (메모이제이션으로 성능 최적화)
  const renderIcon = useMemo(() => {
    const iconMap = categoryIcons.reduce((acc, icon) => {
      acc[icon.name] = <icon.component size={18} key={icon.name} />;
      return acc;
    }, {} as Record<string, ReactElement>);

    return (iconName: string) => {
      return iconMap[iconName] || <IconBread size={18} />;
    };
  }, []);

  // 옵션 렌더링 최적화
  const iconOptions = useMemo(
    () =>
      categoryIcons.map((icon) => (
        <Option key={icon.name} value={icon.name} label={icon.label}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "2px 0",
            }}
          >
            {renderIcon(icon.name)}
            <span>{icon.label}</span>
          </div>
        </Option>
      )),
    [renderIcon]
  );

  return (
    <Modal
      title={isEditMode ? "카테고리 수정" : "카테고리 추가"}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
        <Form.Item
          name="name"
          label="카테고리 이름"
          rules={[
            {
              required: true,
              message: "카테고리 이름을 입력해주세요.",
            },
            {
              max: 50,
              message: "카테고리 이름은 50자 이내로 입력해주세요.",
            },
          ]}
        >
          <Input placeholder="카테고리 이름을 입력하세요" maxLength={50} />
        </Form.Item>

        <Form.Item
          name="description"
          label="설명"
          rules={[
            {
              max: 200,
              message: "설명은 200자 이내로 입력해주세요.",
            },
          ]}
        >
          <TextArea
            placeholder="카테고리 설명을 입력하세요 (선택사항)"
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="icon"
          label="아이콘"
          rules={[
            {
              required: true,
              message: "아이콘을 선택해주세요.",
            },
          ]}
        >
          <Select
            placeholder="아이콘을 선택하세요"
            showSearch
            virtual
            listHeight={250}
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {iconOptions}
          </Select>
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
      </Form>
    </Modal>
  );
};
