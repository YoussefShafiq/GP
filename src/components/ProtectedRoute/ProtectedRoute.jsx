import React, { useContext } from 'react'
import { UserData } from './../../context/UserContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const { token } = useContext(UserData)

    // if (localStorage.getItem('userToken'))
        return children
    // else {
    //     return <Navigate to={'login'} />
    // }
}
