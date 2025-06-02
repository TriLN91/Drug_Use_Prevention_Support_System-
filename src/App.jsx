import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './page/HomePage'
import LoginPage from './login/LoginPage'
import RegisterPage from './login/RegisterPage'
import CouresListPage from './page/CouresListPage'
import UserProfilePage from './page/UserProfilePage'
import Servey from './page/Servey'
import CourseVideo from './page/CourseVideo'
import CourseQuiz from './page/CourseQuiz'
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/page/Dashboard';
import UserManage from './admin/page/UserManage';
import CourseManage from './admin/page/CourseManage';


function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user || user.role_id !== 1) return <Navigate to="/login" />;
  return children;
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courseList" element={<CouresListPage />} />
        <Route path="/userProfile" element={<UserProfilePage />} />
        <Route path="/course" element={<CourseVideo />} />
        <Route path="/servey" element={<Servey />} />
        <Route path="/quiz" element={<CourseQuiz />} />

        <Route path="/admin" element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManage />} />
          <Route path="courses" element={<CourseManage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
