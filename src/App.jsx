import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import RegisterPage from './page/registerPage'
import CouresListPage from './page/CouresListPage'
import UserProfilePage from './page/UserProfilePage'
import Servey from './page/Servey'
import CourseVideo from './page/CourseVideo'
import CourseQuiz from './page/CourseQuiz'

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
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;
