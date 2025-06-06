import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username, // ✅ đúng key backend yêu cầu
          password,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Login failed');
      }

      const data = await res.json();

      if (data.token) {
        // ✅ Lưu token và thông tin người dùng
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('full_name', data.fullName || '');
        localStorage.setItem('id', data.id || '');
        localStorage.setItem('phonenumber', data.phoneNumber || '');

        // ✅ Điều hướng theo role
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid response: Token not found');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred while logging in');
    }
  };

  return (
    <div className="flex min-h-screen bg-white items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <img
          src="https://res.cloudinary.com/dwjtg28ti/image/upload/v1748824738/z6621531660497_00c45b7532add5b3a49055fb93d63a53_ewd8xj.jpg"
          alt="WeHope Logo"
          className="w-52 mb-4"
        />
        <div className="font-semibold text-lg mb-6 text-gray-700">Sign in</div>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-2.5 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2.5 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-500 text-sm mb-3">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition"
          >
            Sign in
          </button>

          <div className="text-center mt-4 text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
