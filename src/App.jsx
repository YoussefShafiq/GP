import { useState } from 'react'
import './App.css'
import './fonts.css'
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
import Dashboard from './pages/Dashboard/Dashboard'
import Notes from './pages/Notes/Notes'
import NotesContextProvider from './context/NotesContext'
import Mytasks from './pages/Mytasks/Mytasks'
import Workspaces from './pages/Workspaces/Workspaces'
import Profile from './pages/Profile/Profile'
import UpdateProfile from './pages/UpdateProfile/UpdateProfile'
import ProjectContextProvider from './context/ProjectsContext'
import ProjectTeams from './pages/ProjectTeams/ProjectTeams'

let routers = createBrowserRouter([

  { path: 'login/:token?', element: <GoHome><Login /></GoHome> },
  { path: 'signup', element: <GoHome><Signup /> </GoHome> },
  { path: 'forgetpassword', element: <GoHome><ForgetPass /></GoHome> },
  { path: 'resetpassword', element: <ResetPassword /> },
  {
    path: '', element: <Layout />, children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'mytasks', element: <ProtectedRoute><Mytasks /></ProtectedRoute> },
      { path: 'teamspaces', element: <ProtectedRoute><TeamSpaces /></ProtectedRoute> },
      { path: 'notes', element: <ProtectedRoute><Notes /></ProtectedRoute> },
      { path: 'workspaces', element: <ProtectedRoute><Workspaces /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'profile/updateprofile', element: <ProtectedRoute><UpdateProfile /></ProtectedRoute> },
      { path: 'projectTeams', element: <ProtectedRoute><ProjectTeams /></ProtectedRoute> },
      { path: '*', element: <ProtectedRoute><Notfound /></ProtectedRoute> },
    ]
  }
])

let query = new QueryClient()

function App() {


  return <>
    <ProjectContextProvider>
      <NotesContextProvider>
        <QueryClientProvider client={query}>
          <UserDataContextProvider>
            <SidebarContextProvider>
              <RouterProvider router={routers} />
              <Toaster />
            </SidebarContextProvider>
          </UserDataContextProvider>
        </QueryClientProvider>
      </NotesContextProvider>
    </ProjectContextProvider>
  </>
}

export default App
