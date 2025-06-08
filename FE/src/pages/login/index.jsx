import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { toast } from 'react-toastify';

// Import các phụ thuộc thực tế từ cấu trúc dự án của bạn
import api from '../../config/axios'; // Đảm bảo đường dẫn này chính xác tuyệt đối
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/userSlice'; // Đảm bảo đường dẫn này chính xác tuyệt đối

/**
 * Component LoginPage hoàn chỉnh, xử lý logic và giao diện người dùng cho trang đăng nhập.
 * Nó giao tiếp trực tiếp với API backend để xác thực người dùng và quản lý trạng thái qua Redux.
 */
function LoginPage() {
  const navigate = useNavigate(); // Hook từ react-router-dom để điều hướng sau khi đăng nhập thành công
  const dispatch = useDispatch();   // Hook từ react-redux để gửi các action đến Redux store

  /**
   * Xử lý khi biểu mẫu đăng nhập được gửi thành công.
   * Thực hiện cuộc gọi API để xác thực thông tin người dùng.
   * @param {object} values - Dữ liệu từ biểu mẫu (username và password).
   */
  const onFinish = async (values) => {
    console.log('Đang cố gắng đăng nhập với:', values); // Ghi lại dữ liệu gửi đi để gỡ lỗi

    try {
      const response = await api.post("login", values);
      console.log("Phản hồi API đăng nhập:", response.data); // Ghi lại toàn bộ phản hồi từ API để kiểm tra

      dispatch(login(response.data)); // Gửi action `login` vào Redux store

      // Lưu JWT token vào localStorage
      if (response.data && response.data.token) {
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        
        // CẬP NHẬT QUAN TRỌNG:
        // Cấu hình header Authorization mặc định cho instance axios ngay lập tức.
        // Điều này đảm bảo mọi yêu cầu tiếp theo sử dụng token mới.
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        console.log("Token đã được lưu vào localStorage và set cho axios defaults.");
      }

      toast.success("Đăng nhập thành công!", { autoClose: 2000 });
      navigate("/"); // Đã thay đổi: Điều hướng đến trang chủ (/)

    } catch (e) {
      console.error("Lỗi đăng nhập:", e.response ? e.response.data : e.message); // Ghi lại lỗi chi tiết

      const errorMessage = e.response?.data?.message || e.message || "Đăng nhập thất bại!";
      const statusCode = e.response?.status;
      toast.error(`Lỗi ${statusCode ? statusCode + ': ' : ''}${errorMessage}`);
    }
  };

  /**
   * Xử lý khi biểu mẫu gửi thất bại do lỗi validation của Ant Design.
   * @param {object} errorInfo - Thông tin chi tiết về các lỗi validation.
   */
  const onFinishFailed = (errorInfo) => {
    console.log('Xác thực biểu mẫu thất bại:', errorInfo);
    toast.error("Vui lòng kiểm tra lại thông tin nhập liệu!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Đăng nhập</h1>
        <Form
          name="loginForm"
          layout='vertical'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="space-y-4"
        >
          <Form.Item
            label={<span className="font-semibold text-gray-700">Tên đăng nhập</span>}
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
          >
            <Input
              className="py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tên người dùng của bạn"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Mật khẩu</span>}
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              className="py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu của bạn"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" className="mb-4">
            <Checkbox className="text-gray-700">Ghi nhớ tôi</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg h-10 transition duration-200 ease-in-out"
              style={{ boxShadow: 'none', border: 'none' }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
