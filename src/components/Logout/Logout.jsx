import axios from 'axios'
import { LogOutIcon } from 'lucide-react'
import React, { useContext } from 'react'
import { UserData } from '../../context/UserContext'

export default function Logout() {
    const { setToken } = useContext(UserData)
    let headers = {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }

    async function logout() {
        try {
            let { data } = await axios.post('https://brainmate-production.up.railway.app/api/logout', {}, {
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

    }

    return <>
        <button onClick={() => logout()} className='flex justify-center' ><LogOutIcon color='red' ></LogOutIcon></button>
    </>
}
