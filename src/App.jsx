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
import GoHome from './components/GoHome/GoHome'

let routers = createBrowserRouter([

  { path: 'login', element: <GoHome><Login /></GoHome> },
  { path: 'signup', element: <GoHome><Signup /> </GoHome> },
  { path: 'forgetpassword', element: <GoHome><ForgetPass /></GoHome> },
  { path: 'resetpassword', element: <GoHome><ResetPassword /></GoHome> },
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
