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
  Tabs,
} from "antd";
const { Content } = Layout;
const { Title } = Typography;

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IconPlus } from "@tabler/icons-react";

import { DishModal } from "../../components/modals/DishModal";
import { EditDishModal } from "../../components/modals/EditDishModal";
import { IntroModal } from "../../components/modals/IntroModal";
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

// 메뉴 관리 컴포넌트
const MenuManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<TMenuItem | null>(null);
  const { dishes, loading, error, refetch } = useDishes();

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
    message.success("메뉴가 성공적으로 수정되었습니다.");
    refetch();
  };

  const handleDelete = async (dish: TMenuItem) => {
    try {
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
              refetch();
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
      width: 150,
      ellipsis: true,
    },
    {
      title: "이미지",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (imageUrl: string, record: TMenuItem) => (
        <SafeImage
          src={imageUrl || ""}
          alt={record.name}
          width={60}
          height={60}
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
      width: 100,
      render: (category: string) => (
        <Tag color="blue">{getCategoryName(category)}</Tag>
      ),
    },
    {
      title: "재료",
      dataIndex: "ingredients",
      key: "ingredients",
      width: 180,
      ellipsis: true,
    },
    {
      title: "설명",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
    },
    {
      title: "가격",
      dataIndex: "price",
      key: "price",
      width: 80,
      render: (price: number) => <div>₩{price.toLocaleString()}</div>,
    },
    {
      title: "베스트셀러",
      dataIndex: "bestSeller",
      key: "bestSeller",
      width: 80,
      render: (bestSeller: boolean) => (
        <Tag color={bestSeller ? "red" : "default"}>
          {bestSeller ? "베스트" : "일반"}
        </Tag>
      ),
    },
    {
      title: "작업",
      key: "action",
      width: 80,
      render: (_: any, record: TMenuItem) => (
        <Space size="small">
          <Button
            type="text"
            icon={
              <EditOutlined
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            shape="circle"
            size="small"
            title="수정"
            onClick={() => showEditModal(record)}
          />
          <Button
            type="text"
            danger
            icon={
              <DeleteOutlined
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            shape="circle"
            size="small"
            title="삭제"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0px 0px 30px 0px",
        }}
      >
        <Title style={{ margin: 0 }} level={4}>
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
        style={{ fontSize: "12px" }}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / 총 ${total}개`,
        }}
      />

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
    </div>
  );
};

// 인트로 관리 컴포넌트
const IntroManagement = () => {
  const [intros, setIntros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntro, setSelectedIntro] = useState<any | null>(null);

  const fetchIntros = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/restaurant/intros");
      if (!response.ok) {
        throw new Error("인트로 정보를 가져오는데 실패했습니다.");
      }
      const result = await response.json();
      setIntros(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntros();
  }, []);

  const showModal = () => {
    setSelectedIntro(null);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedIntro(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedIntro(null);
  };

  const showEditModal = (intro: any) => {
    console.log("Opening edit modal for intro:", intro);
    setSelectedIntro(intro);
    setIsModalOpen(true);
  };

  const handleIntroUpdate = async (updatedIntro: any) => {
    try {
      const response = await fetch(
        `/api/restaurant/intros/${updatedIntro.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedIntro.title,
            content: updatedIntro.content,
            display_order: updatedIntro.display_order,
            intro_type: updatedIntro.intro_type,
            title_align: updatedIntro.title_align,
            content_align: updatedIntro.content_align,
            is_active: updatedIntro.is_active,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "인트로 수정에 실패했습니다.");
      }

      const result = await response.json();
      // 리스트에서 해당 intro만 교체
      setIntros((prev) =>
        prev.map((item) => (item.id === updatedIntro.id ? result.data : item))
      );

      message.success("인트로가 성공적으로 수정되었습니다.");
      handleOk(); // 모달 닫기
      // fetchIntros(); // 필요하다면 전체 동기화
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "수정에 실패했습니다."
      );
    }
  };

  const handleDelete = async (intro: any) => {
    try {
      Modal.confirm({
        title: "인트로 삭제 확인",
        content: (
          <div>
            <p>이 인트로를 정말로 삭제하시겠습니까?</p>
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
            const response = await fetch(`/api/restaurant/intros/${intro.id}`, {
              method: "DELETE",
            });

            if (!response.ok) {
              throw new Error("인트로 삭제에 실패했습니다.");
            }

            message.success("인트로가 성공적으로 삭제되었습니다.");
            fetchIntros();
          } catch (error) {
            message.error(
              error instanceof Error ? error.message : "삭제에 실패했습니다."
            );
          }
        },
      });
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "삭제에 실패했습니다."
      );
    }
  };

  const columns = [
    {
      title: "순서",
      dataIndex: "display_order",
      key: "display_order",
      width: 80,
    },
    {
      title: "활성화",
      dataIndex: "is_active",
      key: "is_active",
      width: 80,
      render: (is_active: boolean) => (
        <Tag color={is_active ? "green" : "red"}>
          {is_active ? "활성" : "비활성"}
        </Tag>
      ),
    },
    {
      title: "타입",
      dataIndex: "intro_type",
      key: "intro_type",
      width: 100,
      render: (intro_type: string) => {
        const typeColors: { [key: string]: string } = {
          text: "blue",
          highlight: "orange",
        };
        const typeLabels: { [key: string]: string } = {
          text: "일반 텍스트",
          highlight: "강조",
        };
        return (
          <Tag color={typeColors[intro_type] || "default"}>
            {typeLabels[intro_type] || intro_type}
          </Tag>
        );
      },
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: true,
    },
    {
      title: "제목 정렬",
      dataIndex: "title_align",
      key: "title_align",
      width: 100,
      render: (title_align: string) => {
        const alignLabels: { [key: string]: string } = {
          left: "좌측",
          center: "가운데",
          right: "우측",
        };
        const alignColors: { [key: string]: string } = {
          left: "blue",
          center: "green",
          right: "orange",
        };
        return (
          <Tag color={alignColors[title_align] || "default"}>
            {alignLabels[title_align] || title_align}
          </Tag>
        );
      },
    },
    {
      title: "내용",
      dataIndex: "content",
      key: "content",
      width: 300,
      ellipsis: true,
    },
    {
      title: "내용 정렬",
      dataIndex: "content_align",
      key: "content_align",
      width: 100,
      render: (content_align: string) => {
        const alignLabels: { [key: string]: string } = {
          left: "좌측",
          center: "가운데",
          right: "우측",
        };
        const alignColors: { [key: string]: string } = {
          left: "blue",
          center: "green",
          right: "orange",
        };
        return (
          <Tag color={alignColors[content_align] || "default"}>
            {alignLabels[content_align] || content_align}
          </Tag>
        );
      },
    },
    {
      title: "작업",
      key: "action",
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            icon={
              <EditOutlined
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            shape="circle"
            size="small"
            title="수정"
            onClick={() => showEditModal(record)}
          />
          <Button
            type="text"
            danger
            icon={
              <DeleteOutlined
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            shape="circle"
            size="small"
            title="삭제"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="데이터 로딩 오류"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={fetchIntros}>
            다시 시도
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0px 0px 30px 0px",
        }}
      >
        <Title style={{ margin: 0 }} level={4}>
          인트로 관리 ({intros.length}개)
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
          인트로 추가
        </Button>
      </div>

      <Table
        size="small"
        columns={columns}
        dataSource={intros}
        rowKey="id"
        style={{ fontSize: "12px" }}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / 총 ${total}개`,
        }}
      />

      <IntroModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onIntroAdded={fetchIntros}
        intro={selectedIntro}
        onUpdate={handleIntroUpdate}
      />
    </div>
  );
};

const adminPage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { useToken } = theme;
  const { token } = useToken();

  const tabItems = [
    {
      key: "menu",
      label: "메뉴 관리",
      children: <MenuManagement />,
    },
    {
      key: "intro",
      label: "인트로 관리",
      children: <IntroManagement />,
    },
  ];

  return (
    <DishLayout
      title="Admin Dashboard"
      pageDescription="Admin all your restaurant dishes in one place"
      imageUrl={process.env.NEXT_PUBLIC_OG_IMAGE_URL || "/images/og-image.png"}
    >
      <Content
        style={{
          padding: "0px 16px",
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
              marginBottom: "3rem",
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

            <Card
              style={{ width: "100%", maxWidth: "1200px", overflowX: "auto" }}
            >
              <Tabs
                defaultActiveKey="menu"
                items={tabItems}
                style={{ marginTop: "20px" }}
              />
            </Card>
          </div>
        </main>
      </Content>
    </DishLayout>
  );
};

export default adminPage;
