import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../redux/features/userSlide';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function UserProfilePage() {
    const reduxUser = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUserState] = useState({
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
        let currentUser = reduxUser;
        if (!currentUser) {
            try {
                currentUser = JSON.parse(localStorage.getItem('user'));
            } catch {
                currentUser = null;
            }
        }
        if (currentUser && currentUser.id) {
            setUserState({ ...currentUser, email: currentUser.email || '' });
        } else {
            toast.error('User not found. Please login again.');
            setTimeout(() => {
                navigate('/login');
            }, 1200);
        }
    }, [reduxUser, navigate]);

    const handleChange = e => {
        setUserState({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:5000/Users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            if (res.ok) {
                dispatch(login(user));
                localStorage.setItem('user', JSON.stringify(user));
                setEditMode(false);
                toast.success('Profile updated successfully!');
            } else {
                toast.error('Update failed!');
            }
        } catch {
            toast.error('An error occurred!');
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error('Please enter new password and confirm it.');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Password confirmation does not match!');
            return;
        }
        try {
            const updatedUser = { ...user, password: newPassword };
            const res = await fetch(`http://localhost:5000/Users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });
            if (res.ok) {
                setUserState(updatedUser);
                dispatch(login(updatedUser));
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setNewPassword('');
                setConfirmPassword('');
                toast.success('Password changed successfully!');
            } else {
                toast.error('Password change failed!');
            }
        } catch {
            toast.error('An error occurred!');
        }
    };

    return (
        <div className="relative max-w-xl mx-auto bg-white rounded shadow p-8 mt-10 mb-10">
            <ToastContainer autoClose={1200} />
            {/* Nút mũi tên back ở góc trái trên */}
            <button
                onClick={() => {
                    // Nếu đang ở /admin/profile thì back về /admin, ngược lại về /
                    if (window.location.pathname.startsWith('/admin')) {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                }}
                className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition"
                type="button"
                title="Back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
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

                {/* Change password */}
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
                                type="button"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="border border-gray-400 px-6 py-2 rounded font-semibold hover:bg-gray-100"
                                type="button"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                            type="button"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage