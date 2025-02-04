import { createContext, useState } from "react";



export let TaskContext = createContext()

export default function TaskContextProvider(props) {

    const [selectedTask, setselectedTask] = useState(null)

    return <TaskContext.Provider value={{ selectedTask, setselectedTask }} >
        {props.children}
    </TaskContext.Provider>
}