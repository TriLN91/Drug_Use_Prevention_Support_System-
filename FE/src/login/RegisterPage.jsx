import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    phonenumber: '',
    address: '',
    date_of_birth: '',
    gender: 'M',
    password: '',
    confirmPassword: '',
    role_id: 2 // mặc định là User
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    // Kiểm tra các trường bắt buộc
    if (!form.username || !form.password || !form.email || !form.full_name) {
        setError('Please fill all required fields');
        return;
    }
    try {
        // Gửi dữ liệu đăng ký
        const userData = {
            userName: form.username,
            password: form.password,
            email: form.email,
            fullName: form.full_name,
            phoneNumber: form.phonenumber,
            address: form.address,
            dateOfBirth: form.date_of_birth, // Định dạng yyyy-MM-dd
            gender: form.gender === 'M' ? 'MALE' : form.gender === 'F' ? 'FEMALE' : 'OTHER'
        };
        const res = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (res.ok) {
            alert('Register successful! Please login.');
            navigate('/login');
        } else {
            const errData = await res.json();
            setError(errData.message || 'Register failed');
        }
    } catch (err) {
        console.error('Error during registration:', err);
        setError('An error occurred while registering. Please try again later.');
    }
  };

  return (
    <div className="flex min-h-screen bg-white items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <img
          src="https://cdn.discordapp.com/attachments/1203731339766141021/1376560938315940014/image.png?ex=68366e86&is=68351d06&hm=f892db442c80597c8eb2da733f202a874e2152b73bb2e7f57326bb7ba3579200&"
          alt="WeHope Logo"
          className="w-52 mb-2"
        />
        <div className="font-semibold text-lg mb-8 text-gray-700">
          Create Account
        </div>
        <form className="w-[400px] max-w-[90%]" onSubmit={handleSubmit}>
          <input
            name="full_name"
            type="text"
            placeholder="Full Name"
            className="block w-full p-2.5 border border-gray-300 rounded mb-3"
            value={form.full_name}
            onChange={handleChange}
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="block w-full p-2.5 border border-gray-300 rounded mb-3"
            value={form.username}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="block w-full p-2.5 border border-gray-300 rounded mb-3"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="phonenumber"
            type="text"
            placeholder="Phone Number"
            className="block w-full p-2.5 border border-gray-300 rounded mb-3"
            value={form.phonenumber}
            onChange={handleChange}
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            className="block w-full p-2.5 border border-gray-300 rounded mb-3"
            value={form.address}
            onChange={handleChange}
          />
          <input
            name="date_of_birth"
            type="date"
            placeholder="Date of Birth"
            className="block w-full p-2.5 border border-gray-300 rounded mb-3"
            value={form.date_of_birth}
            onChange={handleChange}
          />
          <select
            name="gender"
            className="block w-full p-2.5 border border-gray-300 rounded mb-3"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="block w-full p-2.5 border border-gray-300 rounded mb-3"
            value={form.password}
            onChange={handleChange}
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="block w-full p-2.5 border border-gray-300 rounded mb-3"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg py-3 font-semibold text-base mb-3 shadow-md hover:bg-blue-700 transition"
          >
            Create Account
          </button>
          <div className="text-center mb-4 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;