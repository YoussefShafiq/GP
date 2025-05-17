import axios from 'axios'
import { LogOutIcon } from 'lucide-react'
import React, { useContext } from 'react'
import { UserData } from '../../context/UserContext'
import toast from 'react-hot-toast'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Logout() {
    const navigate = useNavigate();
    const { setToken } = useContext(UserData)
    let headers = {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }

    async function logout() {
        localStorage.setItem('userToken', '')
        navigate('/login');
        try {
            let { data } = await axios.post('https://brainmate-new.fly.dev/api/v1/user/logout', {}, {
                headers
            })
            setToken('')
            console.log(data);
        } catch (error) {
            console.log(error);
            setToken('')
            localStorage.setItem('userToken', '')
            navigate('/login');
        }
        toast.error('logged out',
            {
                position: 'bottom-right',
                duration: 2000,
                icon: <LogOutIcon color='red' ></LogOutIcon>
            }
        )

    }

    return <>
        <button onClick={() => logout()} className='flex justify-center' ><LogOutIcon color='red' ></LogOutIcon></button>
    </>
}
