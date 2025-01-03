import axios from 'axios'
import { LogOutIcon } from 'lucide-react'
import React, { useContext } from 'react'
import { UserData } from '../../context/UserContext'
import toast from 'react-hot-toast'

export default function Logout() {
    const { setToken } = useContext(UserData)
    let headers = {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }

    async function logout() {
        try {
            let { data } = await axios.post('http://brainmate.ct.ws/api/v1/auth/logout', {}, {
                headers
            })
            setToken('')
            localStorage.setItem('userToken', '')
            console.log(data);

        } catch (error) {
            console.log(error);
            setToken('')
            localStorage.setItem('userToken', '')
        }
        toast.error('logged out',
            {
                duration: 2000,
                position: 'bottom-right',
                icon: <LogOutIcon color='red' ></LogOutIcon>
            }
        )

    }

    return <>
        <button onClick={() => logout()} className='flex justify-center' ><LogOutIcon color='red' ></LogOutIcon></button>
    </>
}
