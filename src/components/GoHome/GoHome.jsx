import React, { useContext } from 'react'
import { UserData } from './../../context/UserContext';
import { Navigate } from 'react-router-dom';
import Login from '../Login/Login';

export default function GoHome({ children }) {

    if (localStorage.getItem('userToken'))
        return <Navigate to={'/'} />
    else
        return children
}
