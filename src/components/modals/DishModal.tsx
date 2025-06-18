import { Button, Modal, Form, Input, Select, Divider, Typography } from "antd";
const { Title } = Typography;
export const DishModal = ({ isModalOpen, handleOk, handleCancel }) => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
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
            New Dish
          </Title>
        }
        open={isModalOpen}
        footer={[]}
        // onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        width={520}
      >
        <Divider />

        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="메뉴명"
            name="dishname"
            rules={[{ required: true, message: "메뉴명을 입력하세요" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="이미지 URL"
            name="imageurl"
            rules={[{ required: true, message: "이미지 URL을 입력하세요" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="카테고리"
            name="category"
            rules={[{ required: true, message: "카테고리를 선택하세요" }]}
            initialValue="dishes"
          >
            <Select
              style={{ width: "100%" }}
              onChange={handleChange}
              options={[
                { value: "dishes", label: "Dishes" },
                { value: "coffee", label: "Coffee" },
                { value: "beer", label: "Beer" },
                { value: "wine", label: "Wine" },
                { value: "desserts", label: "Desserts" },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item
            label="설명"
            name="description"
            rules={[{ required: true, message: "설명을 입력하세요" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="가격"
            name="price"
            rules={[{ required: true, message: "가격을 입력하세요" }]}
          >
            <Input />
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
              onClick={handleCancel}
              htmlType="reset"
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
