import React from 'react'
import { useNavigate } from 'react-router-dom';

function Header() {
  const full_name = localStorage.getItem('full_name');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('full_name');
    navigate('/');
    window.location.reload();
  };

  const menuItems = [
    { label: 'About Us', path: '#' },
    { label: 'Courses', path: '/courseList' },
    { label: 'Survey', path: '#' },
    { label: 'Online Consultant', path: '/consultantList' },
    { label: 'News', path: '#' },
    { label: 'Blogs', path: '#' },
    { label: 'Contact', path: '#' },
  ];

  return (
    <header className="flex items-center justify-between px-12 py-4 shadow-sm">
      <div className="flex items-center gap-2">
       <a href='/'> <img
          src="https://res.cloudinary.com/dwjtg28ti/image/upload/v1748824738/z6621531660497_00c45b7532add5b3a49055fb93d63a53_ewd8xj.jpg"
          alt="Logo"
          className="w-20"
        /></a>
      </div>
      <nav className="flex gap-8 text-gray-700 font-medium">
        {menuItems.map(item => (
          <a
            key={item.label}
            href={full_name ? item.path : "/login"}
            onClick={e => {
              if (!full_name) {
                e.preventDefault();
                window.location.href = "/login";
              }
            }}
            className="hover:text-blue-500"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex gap-2 items-center">
        {full_name ? (
          <>
            <a href='/userProfile'><span className="font-semibold text-gray-700">Hello, {full_name}</span></a>
            <button
              onClick={handleLogout}
              className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 transition"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <a href="/register">
              <button className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 transition">Sign up</button>
            </a>
            <a href="/login">
              <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">Sign in</button>
            </a>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
