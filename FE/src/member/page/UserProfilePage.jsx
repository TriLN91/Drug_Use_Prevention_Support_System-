import React, { useState, useEffect } from 'react';
// Đã loại bỏ import { useSelector } từ react-redux vì sẽ gọi API trực tiếp
import api from '../../config/axios'; // Import api instance của axios
import { toast } from 'react-toastify'; // Import toast cho thông báo

function UserProfilePage() {
    // Không còn lấy currentUser từ Redux store nữa
    // const userSliceState = useSelector(state => state.user);
    // const currentUser = userSliceState ? userSliceState.user : null;

    // Trạng thái cục bộ để lưu thông tin người dùng và chế độ chỉnh sửa
    const [user, setUser] = useState(null); // Khởi tạo là null để hiển thị trạng thái tải
    const [loading, setLoading] = useState(true); // Trạng thái tải
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [editMode, setEditMode] = useState(false);

    // useEffect để lấy thông tin người dùng từ API khi component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true); // Bắt đầu tải
            setError(null); // Xóa lỗi cũ
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
                }

                // Gửi yêu cầu GET đến /api/profile
                // axios instance 'api' đã được cấu hình để tự động thêm header Authorization với token
                const response = await api.get('profile'); 
                
                if (response.status === 200 && response.data) {
                    // Cập nhật state user với dữ liệu từ API
                    setUser({
                        fullName: response.data.fullName || '',
                        phoneNumber: response.data.phoneNumber || '',
                        address: response.data.address || '',
                        // Đảm bảo định dạng ngày sinh là YYYY-MM-DD cho input type="date"
                        dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toISOString().split('T')[0] : '',
                        gender: response.data.gender || ''
                    });
                } else {
                    throw new Error('Không thể lấy thông tin hồ sơ.');
                }
            } catch (err) {
                console.error('Lỗi khi lấy thông tin hồ sơ:', err);
                setError(err); // Lưu lỗi vào state
                if (err.response) {
                    toast.error(`Lỗi tải hồ sơ: ${err.response.data?.message || err.response.statusText}`);
                } else {
                    toast.error(`Lỗi mạng hoặc không xác định: ${err.message}`);
                }
            } finally {
                setLoading(false); // Kết thúc tải
            }
        };

        fetchUserProfile();
    }, []); // Chỉ chạy một lần khi component mount

    const handleChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token'); 
            if (!token) {
                toast.error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
                return;
            }

            // Gửi API cập nhật thông tin user bằng phương thức PATCH
            const response = await api.patch('profile', user); // Sử dụng PATCH
            
            if (response.status === 200) { 
                setEditMode(false);
                toast.success('Hồ sơ đã được cập nhật thành công!');
                // Bạn có thể cần cập nhật lại thông tin user trong state sau khi lưu thành công
                // Nếu backend trả về dữ liệu đã cập nhật, bạn có thể sử dụng response.data để cập nhật lại state
                // setUser(response.data); 
            } else {
                toast.error('Cập nhật hồ sơ thất bại!');
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật hồ sơ:', err);
            if (err.response) {
                toast.error(`Lỗi cập nhật: ${err.response.data?.message || err.response.statusText}`);
            } else {
                toast.error('Đã xảy ra lỗi mạng hoặc lỗi không xác định!');
            }
        }
    };

    // Hiển thị trạng thái tải hoặc lỗi
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Đang tải thông tin hồ sơ...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <p>Không thể tải hồ sơ: {error.message}. Vui lòng thử lại sau.</p>
            </div>
        );
    }

    // Nếu không có lỗi và user đã được tải
    return (
        <div className="max-w-xl mx-auto bg-white rounded shadow p-8 mt-10 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">User Profile</h2>
            <div className="flex flex-col gap-4">
                <label className="font-semibold">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="p-2 border rounded bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <label className="font-semibold">Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleChange}
                    disabled // Số điện thoại thường không cho phép chỉnh sửa
                    className="p-2 border rounded bg-gray-200 cursor-not-allowed" // Thêm kiểu dáng disabled
                />

                <label className="font-semibold">Address</label>
                <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="p-2 border rounded bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <label className="font-semibold">Date of Birth</label>
                <input
                    type="date" // Sử dụng type="date" cho input ngày sinh
                    name="dateOfBirth"
                    value={user.dateOfBirth}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="p-2 border rounded bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <label className="font-semibold">Gender</label>
                <select
                    name="gender"
                    value={user.gender}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="p-2 border rounded bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                </select>

                <div className="flex gap-4 mt-6 justify-center">
                    {editMode ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;
