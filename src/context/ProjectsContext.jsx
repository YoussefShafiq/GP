import { createContext, useState } from "react";



export let projectContext = createContext()

export default function ProjectContextProvider(props) {

    const [selectedProject, setselectedProject] = useState(null)

    return <projectContext.Provider value={{ selectedProject, setselectedProject }} >
        {props.children}
    </projectContext.Provider>
}