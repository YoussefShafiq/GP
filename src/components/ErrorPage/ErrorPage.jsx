import React, { useContext } from 'react';
import Layout from '../Layout/Layout';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { SidebarContext } from '../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    let { sidebarOpen, setSidebarOpen } = useContext(SidebarContext)
    const navigate = useNavigate()
    // Function to handle refresh
    const handleRefresh = () => {
        window.location.reload(); // Reloads the current page
    };
    return <>
        <Navbar />
        <Sidebar />
        <div className={`${!sidebarOpen ? "md:ms-16" : "md:ms-48"} pt-12 transition-all relative font-inter dark:bg-dark min-h-screen flex flex-col justify-center items-center`}>
            <h1>Oops! Something went wrong.</h1>
            <p>We're sorry, but an unexpected error has occurred.</p>
            <div className="flex gap-2 my-4">
                <button onClick={handleRefresh} className='bg-darkblue text-white dark:bg-dark2 py-1 px-2 rounded-xl' >Refresh</button>
                <button onClick={() => navigate('/')} className='bg-darkblue text-white dark:bg-dark2 py-1 px-2 rounded-xl' >Go to home</button>
            </div>
        </div>
    </>


};

export default ErrorPage;