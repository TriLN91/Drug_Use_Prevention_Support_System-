import React, { useState, useEffect } from 'react'

function UserProfilePage() {
    const [user, setUser] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        gender: ''
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        // Lấy số điện thoại từ localStorage để xác định user hiện tại
        const phoneNumber = localStorage.getItem('phonenumber');
        fetch('http://localhost:8080/api/profile')
            .then(res => res.json())
            .then(data => {
                // Tìm user theo phoneNumber
                const foundUser = data.find(u => u.phoneNumber === phoneNumber);
                if (foundUser) setUser(foundUser);
            });
    }, []);

    const handleChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Gửi API cập nhật thông tin user (nếu backend hỗ trợ)
        fetch('http://localhost:8080/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(res => {
                if (res.ok) {
                    setEditMode(false);
                    alert('Profile updated successfully!');
                } else {
                    alert('Update failed!');
                }
            })
            .catch(() => alert('An error occurred!'));
    };

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
                    className="p-2 border rounded bg-gray-100"
                />

                <label className="font-semibold">Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleChange}
                    disabled
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
                    name="dateOfBirth"
                    value={user.dateOfBirth}
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
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                </select>

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
    )
}

export default UserProfilePage