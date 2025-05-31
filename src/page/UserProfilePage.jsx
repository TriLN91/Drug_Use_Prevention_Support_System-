import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function UserProfilePage() {
    const [user, setUser] = useState({
        id: '',
        full_name: '',
        phonenumber: '',
        address: '',
        date_of_birth: '',
        gender: '',
        email: '',
        password: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');



    useEffect(() => {
        // Lấy id từ localStorage để xác định user hiện tại
        const id = localStorage.getItem('id');
        if (id) {
            fetch('http://localhost:5000/Users')
                .then(res => res.json())
                .then(data => {
                    const foundUser = data.find(u => String(u.id) === String(id));
                    if (foundUser) setUser({ ...foundUser, email: foundUser.email || '' });
                });
        }
    }, []);

    const handleChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Gọi API cập nhật thông tin user (PUT)
        fetch(`http://localhost:5000/Users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(res => {
                if (res.ok) {
                    Object.keys(user).forEach(key => {
                        localStorage.setItem(key, user[key]);
                    });
                    setEditMode(false);
                    alert('Cập nhật thông tin thành công!');
                } else {
                    alert('Cập nhật thất bại!');
                }
            })
            .catch(() => alert('Có lỗi xảy ra!'));
    };
    const handleChangePassword = () => {
        if (!newPassword || !confirmPassword) {
            alert('Vui lòng nhập đầy đủ mật khẩu mới và xác nhận.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        // Cập nhật mật khẩu mới
        const updatedUser = { ...user, password: newPassword };
        fetch(`http://localhost:5000/Users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        })
            .then(res => {
                if (res.ok) {
                    setUser(updatedUser);
                    localStorage.setItem('password', newPassword);
                    setNewPassword('');
                    setConfirmPassword('');
                    alert('Đổi mật khẩu thành công!');
                } else {
                    alert('Đổi mật khẩu thất bại!');
                }
            })
            .catch(() => alert('Có lỗi xảy ra!'));
    };

    return (
        <>
            <Header />
            <div className="max-w-xl mx-auto bg-white rounded shadow p-8 mt-10 mb-10">
                <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">User Profile</h2>
                <div className="flex flex-col gap-4">
                    <label className="font-semibold">Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={user.full_name}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="p-2 border rounded bg-gray-100"
                    />

                    <label className="font-semibold">Phone Number</label>
                    <input
                        type="text"
                        name="phonenumber"
                        value={user.phonenumber}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="p-2 border rounded bg-gray-100"
                    />

                    <label className="font-semibold">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="p-2 border rounded bg-gray-100"
                    />

                    <label className="font-semibold">Date of Birth</label>
                    <input
                        type="date"
                        name="date_of_birth"
                        value={user.date_of_birth}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="p-2 border rounded bg-gray-100"
                    />

                    <label className="font-semibold">Gender</label>
                    <select
                        name="gender"
                        value={user.gender}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="p-2 border rounded bg-gray-100"
                    >
                        <option value="">Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>

                    <label className="font-semibold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="p-2 border rounded bg-gray-100"
                    />
                             {/* Đổi mật khẩu trực tiếp */}
                    <label className="font-semibold mt-2">Change Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="p-2 border rounded bg-gray-100"
                    />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="p-2 border rounded bg-gray-100"
                    />
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={e => setShowPassword(e.target.checked)}
                        />
                        Show password
                    </label>
                    <button
                        onClick={handleChangePassword}
                        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 w-fit"
                        type="button"
                    >
                        Change Password
                    </button>

                    <div className="flex gap-4 mt-6 justify-center">
                        {editMode ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="border border-gray-400 px-6 py-2 rounded font-semibold hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default UserProfilePage
