import { useState } from 'react';
import './App.css';
import './fonts.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Layout from './components/Layout/Layout';
import Signup from './pages/Signup/Signup';
import Notfound from './components/Notfound/Notfound';
import SidebarContextProvider from './context/SidebarContext';
import Home from './pages/Home/Home';
import UserDataContextProvider from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ForgetPass from './pages/ForgetPass/ForgetPass';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import GoHome from './components/GoHome/GoHome';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard/Dashboard';
import Notes from './pages/Notes/Notes';
import NotesContextProvider from './context/NotesContext';
import Mytasks from './pages/Mytasks/Mytasks';
import Workspaces from './pages/Workspaces/Workspaces';
import Profile from './pages/Profile/Profile';
import UpdateProfile from './pages/UpdateProfile/UpdateProfile';
import ProjectContextProvider from './context/ProjectsContext';
import ProjectTeams from './pages/ProjectTeams/ProjectTeams';
import TeamsContextProvider from './context/TeamsContext';
import Team from './pages/Team/Team';
import ManageTeamMembers from './pages/ManageTeamMembers/ManageTeamMembers';
import TaskContextProvider from './context/TaskContext';
import TaskDetails from './pages/TaskDetails/TaskDetails';
import TeamInvitationConfirm from './pages/TeamInvitationConfirm/TeamInvitationConfirm';
import MyTeams from './pages/MyTeams/MyTeams';
import Chat from './pages/Chat/Chat';
import ChatContextProvider from './context/ChatContext';
import Materials from './pages/Materials/Materials';
import MaterialsContextProvider from './context/MaterialsContext';
import MaterialTeams from './components/MaterialTeams/MaterialTeams';
import MaterialsItems from './components/MaterialsItems/MaterialsItems';
import ErrorPage from './components/ErrorPage/ErrorPage'; // Import your error component
import Backlog from './pages/Backlog/Backlog';

let routers = createBrowserRouter([
  { path: 'login/:token?', element: <GoHome><Login /></GoHome>, errorElement: <ErrorPage /> },
  { path: 'signup/:invitation_token?', element: <GoHome><Signup /></GoHome>, errorElement: <ErrorPage /> },
  { path: 'forgetpassword', element: <GoHome><ForgetPass /></GoHome>, errorElement: <ErrorPage /> },
  { path: 'resetpassword', element: <ResetPassword />, errorElement: <ErrorPage /> },
  {
    path: '', element: <Layout />, children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: 'team-invitation-confirm', element: <ProtectedRoute><TeamInvitationConfirm /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'mytasks', element: <ProtectedRoute><Mytasks /></ProtectedRoute> },
      { path: 'myteams', element: <ProtectedRoute><MyTeams /></ProtectedRoute> },
      { path: 'materials', element: <ProtectedRoute><Materials /></ProtectedRoute> },
      { path: 'materials/project', element: <ProtectedRoute><MaterialTeams /></ProtectedRoute> },
      { path: 'materials/project/team', element: <ProtectedRoute><MaterialsItems /></ProtectedRoute> },
      { path: 'chat', element: <ProtectedRoute><Chat /></ProtectedRoute> },
      { path: 'workspaces', element: <ProtectedRoute><Workspaces /></ProtectedRoute> },
      { path: 'notes', element: <ProtectedRoute><Notes /></ProtectedRoute> },
      { path: 'profile/updateprofile', element: <ProtectedRoute><UpdateProfile /></ProtectedRoute> },
      { path: 'project', element: <ProtectedRoute><ProjectTeams /></ProtectedRoute> },
      { path: 'project/team', element: <ProtectedRoute><Team /></ProtectedRoute> },
      { path: 'project/team/manage-members', element: <ProtectedRoute><ManageTeamMembers /></ProtectedRoute> },
      { path: 'project/team/backlog/:id?', element: <ProtectedRoute><Backlog /></ProtectedRoute> },
      { path: 'task-details/:id?', element: <ProtectedRoute><TaskDetails /></ProtectedRoute> },
      { path: '*', element: <ProtectedRoute><Notfound /></ProtectedRoute> },
    ]
  }
]);

let query = new QueryClient();

function App() {
  return (
    <MaterialsContextProvider>
      <ChatContextProvider>
        <TaskContextProvider>
          <TeamsContextProvider>
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
          </TeamsContextProvider>
        </TaskContextProvider>
      </ChatContextProvider>
    </MaterialsContextProvider>
  );
}

export default App;