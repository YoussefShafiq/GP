import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/DarkmodeToggle/Login/Login'
import Layout from './components/Layout/Layout'
import Signup from './components/DarkmodeToggle/Signup/Signup'
import Notfound from './components/DarkmodeToggle/Notfound/Notfound'

let routers = createBrowserRouter([
  {path:'', element: <Layout/> , children:[
    {index:true , element:<Login/>},
    {path:'login' , element:<Login/>},
    {path:'signup' , element:<Signup/>},
    {path:'*' , element:<Notfound/>},
  ]}
])

function App() {


  return <>
    <RouterProvider router={routers}/>
  </>
}

export default App
