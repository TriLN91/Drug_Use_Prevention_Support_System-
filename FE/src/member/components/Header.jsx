import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login } from '../../redux/features/userSlice'; 
import api from '../../config/axios'; 
import { toast } from 'react-toastify'; 

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector(state => state.user); 
  
  // Sử dụng user.fullName cho hiển thị tên người dùng
  const display_name = user ? user.fullName : null; 

  // useEffect để kiểm tra và khôi phục trạng thái người dùng khi component mount hoặc Redux state thay đổi
  useEffect(() => {
    console.log("Header useEffect: Component mounted or user/dispatch changed.");
    console.log("Header useEffect: Current Redux user state:", user);

    // Điều kiện: Nếu không có thông tin người dùng trong Redux state (hoặc fullName bị thiếu)
    // VÀ có token trong localStorage
    if (!user || !user.fullName) {
      const token = localStorage.getItem('token');
      console.log("Header useEffect: Token from localStorage:", token ? "Found" : "Not Found");

      if (token) {
        const fetchUserProfile = async () => {
          try {
            console.log("Header useEffect: Attempting to fetch user profile from API...");
            // QUAN TRỌNG: Đã sửa URL từ '/api/profile' thành 'profile'
            // vì baseURL của axios đã bao gồm '/api/'
            const response = await api.get('profile'); 
            console.log("Header useEffect: User profile fetched successfully:", response.data);
            dispatch(login(response.data)); 
            // toast.success("Thông tin người dùng đã được khôi phục!", { autoClose: 1500 }); // Có thể bỏ nếu không muốn toast mỗi lần tải trang
          } catch (error) {
            console.error("Header useEffect: Lỗi khi lấy thông tin hồ sơ người dùng:", error);
            // Log chi tiết phản hồi lỗi từ API để gỡ lỗi
            if (error.response) {
              console.error("API error response data:", error.response.data);
              console.error("API error status:", error.response.status);
              console.error("API error headers:", error.response.headers);
            } else if (error.request) {
              console.error("API request error:", error.request);
            } else {
              console.error("Lỗi chung:", error.message);
            }

            // Nếu token bị thiếu hoặc không hợp lệ (401, 403), xóa token và đăng xuất
            if (error.response?.status === 401 || error.response?.status === 403) {
                 toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            } else {
                 toast.error("Không thể khôi phục phiên. Vui lòng đăng nhập lại.");
            }
            localStorage.removeItem('token'); 
            dispatch(logout()); 
          }
        };
        fetchUserProfile();
      }
    } else {
      console.log("Header useEffect: User (fullName) đã có trong Redux state. Không cần fetch profile.");
    }
  }, [user, dispatch]); // Dependencies: user và dispatch. 
  // 'user' để React biết chạy lại useEffect khi Redux state của user thay đổi (do login/logout)
  // 'dispatch' để React biết hàm fetchUserProfile không thay đổi giữa các renders

  // Xử lý sự kiện đăng xuất
  const handleLogout = () => {
    dispatch(logout()); // Gửi action logout đến Redux store
    localStorage.removeItem('token'); // Xóa token khỏi localStorage
    navigate('/'); // Điều hướng về trang chủ
    window.location.reload(); // Tải lại trang để đảm bảo trạng thái ứng dụng được làm mới hoàn toàn
  };

  // Các mục menu điều hướng
  const menuItems = [
    { label: 'About Us', path: '#' },
    { label: 'Courses', path: '/courseList' },
    { label: 'Survey', path: '#' },
    { label: 'Online Consultant', path: '/consultantList' },
    { label: 'News', path: '#' },
    { label: 'Blogs', path: '#' },
    { label: 'Contact', path: '#' },
  ];

  return (
    <header className="flex items-center justify-between px-12 py-4 shadow-sm bg-white">
      <div className="flex items-center gap-2">
        <a href='/'>
          <img
            src="https://res.cloudinary.com/dwjtg28ti/image/upload/v1748824738/z6621531660497_00c45b7532add5b3a49055fb93d63a53_ewd8xj.jpg"
            alt="Logo"
            className="w-20"
          />
        </a>
      </div>
      <nav className="flex gap-8 text-gray-700 font-medium">
        {menuItems.map(item => (
          <a
            key={item.label}
            href={display_name ? item.path : "/login"}
            onClick={e => {
              if (!display_name) {
                e.preventDefault();
                navigate("/login");
              }
              if (item.path === '#') {
                e.preventDefault();
              }
            }}
            className="hover:text-blue-500"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex gap-2 items-center">
        {display_name ? (
          <>
            <a href='/userProfile'>
              <span className="font-semibold text-gray-700">Hello, {display_name}</span>
            </a>
            <button
              onClick={handleLogout}
              className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 transition"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <a href="/register">
              <button className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 transition">Sign up</button>
            </a>
            <a href="/login">
              <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">Sign in</button>
            </a>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
