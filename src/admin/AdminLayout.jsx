import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  // Định nghĩa các menu của admin sidebar
  const menu = [
    { label: "Dashboard", path: "/admin" },
    { label: "Quản lý tài khoản", path: "/admin/users" },
    { label: "Quản lý khóa học", path: "/admin/courses" },

  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold mb-8 text-center tracking-widest">ADMIN PANEL</div>
        <ul className="flex-1 space-y-2">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded transition ${location.pathname === item.path
                  ? "bg-blue-700 font-semibold"
                  : "hover:bg-blue-800"
                  }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white shadow px-8 py-4">
          <span className="font-semibold text-lg text-gray-700">
            Hello, {localStorage.getItem('full_name')}!
          </span>
          <button
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded font-semibold transition"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Đăng xuất
          </button>
        </header>
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}