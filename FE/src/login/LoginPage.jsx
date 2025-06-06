import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/Users' + (username ? `?username=${username}` : ''));
            const data = await res.json();
            const users = data.User || data;
            const found = users.find(
                (u) => u.username === username && u.password === password
            );
            if (found) {
                localStorage.setItem('user', JSON.stringify(found));
                localStorage.setItem('full_name', found.full_name);
                localStorage.setItem('id', found.id);
                toast.success('Login successful!');
                setTimeout(() => {
                    if (found.role_id === 1 || found.role === 'Admin') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                }, 500);
            } else {
                toast.error('Invalid username or password');
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            toast.error('An error occurred while logging in');
        }
    };

    return (
        <div className="flex min-h-screen bg-white items-center justify-center">
            <ToastContainer autoClose={500} />
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
                            <img src="https://res.cloudinary.com/dwjtg28ti/image/upload/v1748867725/R_votn69.png" alt="Google" className="w-6 mr-2" />
                            Sign up with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;