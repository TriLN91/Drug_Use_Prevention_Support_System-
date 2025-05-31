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
    { label: 'Online Consultant', path: '#' },
    { label: 'News', path: '#' },
    { label: 'Blogs', path: '#' },
    { label: 'Contact', path: '#' },
  ];

  return (
    <header className="flex items-center justify-between px-12 py-4 shadow-sm">
      <div className="flex items-center gap-2">
       <a href='/'> <img
          src="https://cdn.discordapp.com/attachments/1203731339766141021/1376560938315940014/image.png?ex=68366e86&is=68351d06&hm=f892db442c80597c8eb2da733f202a874e2152b73bb2e7f57326bb7ba3579200&"
          alt="WeHope Logo"
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
