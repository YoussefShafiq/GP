import { createContext, useEffect, useState } from "react";


export let UserData = createContext('');

export default function UserDataContextProvider(props) {
    const [token, setToken] = useState('')


    useEffect(() => {
        if (localStorage.getItem('userToken')) {
            setToken(localStorage.getItem('userToken'))
        }
    }, [])




    return <UserData.Provider value={{ token, setToken }} >
        {props.children}
    </UserData.Provider>
}