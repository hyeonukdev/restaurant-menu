import { useState, useEffect } from "react";
import Image from "next/image";

import {
  Layout,
  theme,
  Typography,
  Alert,
  Table,
  Space,
  Button,
  Card,
  Tag,
  Spin,
  message,
  Modal,
} from "antd";
const { Content } = Layout;
const { Title } = Typography;

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IconPlus } from "@tabler/icons-react";

import { DishModal } from "../../components/modals/DishModal";
import { EditDishModal } from "../../components/modals/EditDishModal";
import { DishLayout } from "@/components/layouts";
import { SafeImage } from "@/components/ui";
import { useDishes } from "@/utils/useDishes";
import { TMenuItem } from "@/types/dish";

// 카테고리 매핑
const getCategoryName = (sectionName: string) => {
  const categoryMap: { [key: string]: string } = {
    Dishes: "메인 요리",
    Coffee: "커피",
    Beer: "맥주",
    Wine: "와인",
    Desserts: "디저트",
  };
  return categoryMap[sectionName] || sectionName;
};

// 모든 메뉴 아이템을 평면화하는 함수
const flattenMenuItems = (sections: any[]): TMenuItem[] => {
  return sections.flatMap((section) =>
    section.items.map((item: TMenuItem) => ({
      ...item,
      category: section.name, // 카테고리 정보 추가
    }))
  );
};

const adminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<TMenuItem | null>(null);
  const { dishes, loading, error, refetch } = useDishes();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { useToken } = theme;
  const { token } = useToken();

  // 모든 메뉴 아이템을 평면화
  const allMenuItems = dishes ? flattenMenuItems(dishes) : [];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showEditModal = (dish: TMenuItem) => {
    setSelectedDish(dish);
    setIsEditModalOpen(true);
  };

  const handleEditOk = () => {
    setIsEditModalOpen(false);
    setSelectedDish(null);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setSelectedDish(null);
  };

  const handleDishUpdate = (updatedDish: TMenuItem) => {
    // 로컬 상태 업데이트 (실제로는 refetch를 호출하여 서버에서 최신 데이터를 가져옴)
    message.success("메뉴가 성공적으로 수정되었습니다.");
    refetch(); // 데이터를 다시 가져와서 UI 업데이트
  };

  const handleDelete = async (dish: TMenuItem) => {
    try {
      // 확인 대화상자
      Modal.confirm({
        title: "메뉴 삭제 확인",
        content: (
          <div>
            <p>"{dish.name}" 메뉴를 정말로 삭제하시겠습니까?</p>
            <p style={{ color: "#ff4d4f", fontSize: "12px" }}>
              ⚠️ 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
        ),
        okText: "삭제",
        okType: "danger",
        cancelText: "취소",
        onOk: async () => {
          try {
            // API 호출
            const response = await fetch(`/api/dishes/${dish.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "메뉴 삭제에 실패했습니다.");
            }

            const result = await response.json();

            if (result.message) {
              message.success(
                `"${dish.name}" 메뉴가 성공적으로 삭제되었습니다.`
              );
              refetch(); // 데이터를 다시 가져와서 UI 업데이트
            } else {
              throw new Error("메뉴 삭제에 실패했습니다.");
            }
          } catch (error) {
            console.error("메뉴 삭제 오류:", error);
            message.error(
              error instanceof Error
                ? error.message
                : "메뉴 삭제에 실패했습니다."
            );
          }
        },
      });
    } catch (error) {
      console.error("메뉴 삭제 오류:", error);
      message.error(
        error instanceof Error ? error.message : "메뉴 삭제에 실패했습니다."
      );
    }
  };

  const columns = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "이미지",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 120,
      render: (imageUrl: string, record: TMenuItem) => (
        <SafeImage
          src={imageUrl || ""}
          alt={record.name}
          width={80}
          height={80}
          fallbackText=""
          showIcon={false}
          hideOnError={true}
          priority={record.bestSeller}
        />
      ),
    },
    {
      title: "카테고리",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: string) => (
        <Tag color="blue">{getCategoryName(category)}</Tag>
      ),
    },
    {
      title: "재료",
      dataIndex: "ingredients",
      key: "ingredients",
      width: 200,
      ellipsis: true,
    },
    {
      title: "설명",
      dataIndex: "description",
      key: "description",
      width: 250,
      ellipsis: true,
    },
    {
      title: "가격",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => <div>₩{price.toLocaleString()}</div>,
    },
    {
      title: "베스트셀러",
      dataIndex: "bestSeller",
      key: "bestSeller",
      width: 100,
      render: (bestSeller: boolean) => (
        <Tag color={bestSeller ? "red" : "default"}>
          {bestSeller ? "베스트" : "일반"}
        </Tag>
      ),
    },
    {
      title: "작업",
      key: "action",
      width: 120,
      render: (_: any, record: TMenuItem) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            shape="circle"
            title="수정"
            onClick={() => showEditModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            shape="circle"
            title="삭제"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <DishLayout
        title="Admin Dashboard"
        pageDescription="Admin all your restaurant dishes in one place"
        imageUrl={
          process.env.NEXT_PUBLIC_OG_IMAGE_URL || "/images/og-image.png"
        }
      >
        <Content
          style={{
            padding: "0px 24px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Spin size="large" />
        </Content>
      </DishLayout>
    );
  }

  if (error) {
    return (
      <DishLayout
        title="Admin Dashboard"
        pageDescription="Admin all your restaurant dishes in one place"
        imageUrl={
          process.env.NEXT_PUBLIC_OG_IMAGE_URL || "/images/og-image.png"
        }
      >
        <Content
          style={{
            padding: "0px 24px",
            borderRadius: "10px",
          }}
        >
          <Alert
            message="데이터 로딩 오류"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={refetch}>
                다시 시도
              </Button>
            }
          />
        </Content>
      </DishLayout>
    );
  }

  return (
    <DishLayout
      title="Admin Dashboard"
      pageDescription="Admin all your restaurant dishes in one place"
      imageUrl={process.env.NEXT_PUBLIC_OG_IMAGE_URL || "/images/og-image.png"}
    >
      <Content
        style={{
          padding: "0px 24px",
          borderRadius: "10px",
        }}
      >
        <main
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: " 3rem",
            }}
          >
            <Alert
              message="실제 API 데이터를 사용하는 관리자 대시보드입니다"
              type="success"
              showIcon
            />

            <Title
              level={2}
              style={{
                color: token.colorPrimary,
                marginTop: "10px",
              }}
            >
              관리자 페이지
            </Title>

            <Card style={{ width: "100%", maxWidth: "1400px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "0px 0px 30px 0px",
                }}
              >
                <Title
                  style={{ color: token.colorPrimary, margin: 0 }}
                  level={3}
                >
                  메뉴 관리 ({allMenuItems.length}개)
                </Title>

                <Button
                  icon={<IconPlus />}
                  onClick={showModal}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  메뉴 추가
                </Button>
              </div>

              <Table
                size="small"
                columns={columns}
                dataSource={allMenuItems}
                rowKey="id"
                scroll={{ x: 1200, y: 600 }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} / 총 ${total}개`,
                }}
              />
            </Card>
          </div>
        </main>

        <DishModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          onDishAdded={refetch}
        />

        <EditDishModal
          isModalOpen={isEditModalOpen}
          handleOk={handleEditOk}
          handleCancel={handleEditCancel}
          dish={selectedDish}
          onUpdate={handleDishUpdate}
        />
      </Content>
    </DishLayout>
  );
};

export default adminPage;
