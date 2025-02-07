import { createContext, useState } from "react";



export let ChatContext = createContext()

export default function ChatContextProvider(props) {

    const [selectedChat, setselectedChat] = useState(null)

    return <ChatContext.Provider value={{ selectedChat, setselectedChat }} >
        {props.children}
    </ChatContext.Provider>
}