import React, { useState, useEffect } from 'react'

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
        // Get id from localStorage to identify current user
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
        // Call API to update user info (PUT)
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
                    alert('Profile updated successfully!');
                } else {
                    alert('Update failed!');
                }
            })
            .catch(() => alert('An error occurred!'));
    };

    const handleChangePassword = () => {
        if (!newPassword || !confirmPassword) {
            alert('Please enter new password and confirm it.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Password confirmation does not match!');
            return;
        }
        // Update new password
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
                    alert('Password changed successfully!');
                } else {
                    alert('Password change failed!');
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