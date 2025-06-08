import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store, persistor } from './redux/store';

import HomePage from './page/HomePage';
import LoginPage from './login/LoginPage';
import RegisterPage from './login/RegisterPage';
import CouresListPage from './page/CouresListPage';
import UserProfilePage from './page/UserProfilePage';
import Servey from './page/Servey';
import CourseVideo from './page/CourseVideo';
import CourseQuiz from './page/CourseQuiz';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/page/Dashboard';
import UserManage from './admin/page/UserManage';
import CourseManage from './admin/page/CourseManage';

function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user || user.role_id !== 1) return <LoginPage />;
  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/courseList",
    element: <CouresListPage />,
  },
  {
    path: "/userProfile",
    element: <UserProfilePage />,
  },
  {
    path: "/course",
    element: <CourseVideo />,
  },
  {
    path: "/servey",
    element: <Servey />,
  },
  {
    path: "/quiz",
    element: <CourseQuiz />,
  },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <UserManage /> },
      { path: "courses", element: <CourseManage /> },
      { path: "profile", element: <UserProfilePage /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
