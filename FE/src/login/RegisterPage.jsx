import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    role_id: 2
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false }); // clear error khi nhập lại
  };

  const validate = () => {
    let newErrors = {};
    if (!form.full_name) newErrors.full_name = true;
    if (!form.username) newErrors.username = true;
    if (!form.email) newErrors.email = true;
    if (!form.password) newErrors.password = true;
    if (!form.confirmPassword) newErrors.confirmPassword = true;

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) newErrors.email = true;

    // Phone format (10-11 số)
    if (form.phonenumber && !/^\d{10,11}$/.test(form.phonenumber)) newErrors.phonenumber = true;

    // Password length
    if (form.password && form.password.length < 6) newErrors.password = true;

    // Password match
    if (form.password !== form.confirmPassword) {
      newErrors.password = true;
      newErrors.confirmPassword = true;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please check your information');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await fetch(`http://localhost:5000/Users?username=${form.username}`);
      const exist = await res.json();
      if (exist.length > 0) {
        toast.error('Username already exists');
        setErrors({ ...errors, username: true });
        return;
      }
      const userData = { ...form };
      delete userData.confirmPassword;
      const res2 = await fetch('http://localhost:5000/Users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res2.ok) {
        toast.success('Register successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 800);
      } else {
        toast.error('Register failed');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      toast.error('An error occurred while registering. Please try again later.');
    }
  };

  return (
    <div className="flex min-h-screen bg-white items-center justify-center">
      <ToastContainer autoClose={800} />
      <div className="flex-1 flex flex-col items-center justify-center">
        <img
          src="https://res.cloudinary.com/dwjtg28ti/image/upload/v1748824738/z6621531660497_00c45b7532add5b3a49055fb93d63a53_ewd8xj.jpg"
          alt="WeHope Logo"
          className="w-52 mb-2"
        />
        <div className="font-semibold text-lg mb-8 text-gray-700">
          Create Account
        </div>
        <form className="w-[400px] max-w-[90%]" onSubmit={handleSubmit}>
          <div className="flex gap-3 mb-4">
            <input
              name="full_name"
              type="text"
              placeholder="Full Name"
              className={`flex-1 p-2.5 border ${errors.full_name ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={form.full_name}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 mb-4">
            <input
              name="username"
              type="text"
              placeholder="Username"
              className={`flex-1 p-2.5 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 mb-4">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className={`flex-1 p-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 mb-4">
            <input
              name="phonenumber"
              type="text"
              placeholder="Phone Number"
              className={`flex-1 p-2.5 border ${errors.phonenumber ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={form.phonenumber}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 mb-4">
            <input
              name="address"
              type="text"
              placeholder="Address"
              className="flex-1 p-2.5 border border-gray-300 rounded"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 mb-4">
            <input
              name="date_of_birth"
              type="date"
              placeholder="Date of Birth"
              className="flex-1 p-2.5 border border-gray-300 rounded"
              value={form.date_of_birth}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 mb-4">
            <select
              name="gender"
              className="flex-1 p-2.5 border border-gray-300 rounded"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div className="flex gap-3 mb-4">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className={`flex-1 p-2.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 mb-4">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className={`flex-1 p-2.5 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
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