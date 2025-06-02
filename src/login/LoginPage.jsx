import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:5000/Users' + (username ? `?username=${username}` : ''));
            const data = await res.json();
            const users = data.User || data;
            const found = users.find(
                (u) => u.username === username && u.password === password
            );
             if (found) {
                // Lưu user vào localStorage
                localStorage.setItem('user', JSON.stringify(found));
                // Kiểm tra role
                if (found.role_id === 1 || found.role === 'Admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('An error occurred while logging in');
        }
    };

    return (
        <div className="flex min-h-screen bg-white items-center justify-center">    
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Logo */}
                <img
                    src="https://res.cloudinary.com/dwjtg28ti/image/upload/v1748824738/z6621531660497_00c45b7532add5b3a49055fb93d63a53_ewd8xj.jpg"
                    alt="WeHope Logo"
                    className="w-52 mb-2"
                />
                <div className="font-semibold text-lg mb-8 text-gray-700">
                    Sign in
                </div>
                {/* Form */}
                <form className="w-[400px] max-w-[90%]" onSubmit={handleSubmit}>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            placeholder="UserName"
                            className="flex-1 p-2.5 border border-gray-300 rounded"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            className="flex-1 p-2.5 border border-gray-300 rounded"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
                    <button type="submit" className="w-full bg-blue-500 text-white rounded-lg py-3 font-semibold text-base mb-3 shadow-md hover:bg-blue-700 transition">
                        Sign in
                    </button>
                    <div className="text-center mb-4 text-sm">
                        You don't have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
                    </div>
                    <div className="flex items-center my-4">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="mx-3 text-gray-400">or</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button type="button" className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-2.5 bg-white cursor-pointer font-medium hover:bg-gray-50 transition">
                            <img src="https://cdn.discordapp.com/attachments/1203731339766141021/1376887132077166662/download.png?ex=6838efd1&is=68379e51&hm=bcc58d3b423ad0ae987938fa63c46017b58e543ffae422b842133826fc8b1aeb&" alt="Google" className="w-6 mr-2" />
                            Sign up with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;