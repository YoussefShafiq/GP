import { createContext, useEffect, useState } from "react";


export let UserData = createContext('');

export default function UserDataContextProvider(props) {
    const [token, setToken] = useState('')
    const [username, setUsername] = useState('')


    useEffect(() => {
        if (localStorage.getItem('userToken')) {
            setToken(localStorage.getItem('userToken'))
        }
        if (localStorage.getItem('username')) {
            setUsername(localStorage.getItem('username'))
        }
    }, [])




    return <UserData.Provider value={{ token, setToken, username, setUsername }} >
        {props.children}
    </UserData.Provider>
}