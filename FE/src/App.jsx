import React from 'react';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';
import HomePage from './member/page/HomePage';
import UserProfilePage from './member/page/UserProfilePage';

function App() {
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
      path: "/userProfile",
      element: <UserProfilePage />,
    },

  ]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
        </PersistGate>

    </Provider>
  );
}

export default App;
