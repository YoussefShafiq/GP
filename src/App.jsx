import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login/Login'
import Layout from './components/Layout/Layout'
import Signup from './pages/Signup/Signup'
import Notfound from './components/Notfound/Notfound'
import SidebarContextProvider from './context/SidebarContext'
import Home from './pages/Home/Home'
import UserDataContextProvider from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import ForgetPass from './pages/ForgetPass/ForgetPass'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import GoHome from './components/GoHome/GoHome'
import { Toaster } from 'react-hot-toast'
import TeamSpaces from './pages/TeamSpaces/TeamSpaces'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let routers = createBrowserRouter([

  { path: 'login/:token?', element: <GoHome><Login /></GoHome> },
  { path: 'signup', element: <GoHome><Signup /> </GoHome> },
  { path: 'forgetpassword', element: <GoHome><ForgetPass /></GoHome> },
  { path: 'resetpassword', element: <ResetPassword /> },
  {
    path: '', element: <Layout />, children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: 'teamspaces', element: <ProtectedRoute><TeamSpaces /></ProtectedRoute> },
      { path: '*', element: <ProtectedRoute><Notfound /></ProtectedRoute> },
    ]
  }
])

let query = new QueryClient()

function App() {


  return <>
    <QueryClientProvider client={query}>
      <UserDataContextProvider>
        <SidebarContextProvider>
          <RouterProvider router={routers} />
          <Toaster />
        </SidebarContextProvider>
      </UserDataContextProvider>
    </QueryClientProvider>
  </>
}

export default App
