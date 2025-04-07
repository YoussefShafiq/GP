import { createContext, useState } from "react";



export let projectContext = createContext()

export default function ProjectContextProvider(props) {

    const [selectedProject, setselectedProject] = useState(null)
    const [selectedDashboardProject, setselectedDashboardProject] = useState(null)

    return <projectContext.Provider value={{ selectedProject, setselectedProject, selectedDashboardProject, setselectedDashboardProject }} >
        {props.children}
    </projectContext.Provider>
}