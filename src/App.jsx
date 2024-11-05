import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login/Login'
import Layout from './components/Layout/Layout'
import Signup from './components/Signup/Signup'
import Notfound from './components/Notfound/Notfound'
import SidebarContextProvider from './context/SidebarContext'
import Home from './components/Home/Home'
import UserDataContextProvider from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import ForgetPass from './components/ForgetPass/ForgetPass'
import ResetPassword from './components/ResetPassword/ResetPassword'

let routers = createBrowserRouter([

  { path: 'login', element: <Login /> },
  { path: 'signup', element: <Signup /> },
  { path: 'forgetpassword', element: <ForgetPass /> },
  { path: 'resetpassword', element: <ResetPassword /> },
  {
    path: '', element: <Layout />, children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: '*', element: <ProtectedRoute><Notfound /></ProtectedRoute> },
    ]
  }
])

function App() {


  return <>
    <UserDataContextProvider>
      <SidebarContextProvider>
        <RouterProvider router={routers} />
      </SidebarContextProvider>
    </UserDataContextProvider>
  </>
}

export default App
