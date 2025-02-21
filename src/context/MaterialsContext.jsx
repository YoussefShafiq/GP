import { createContext, useState } from "react";



export let MaterialsContext = createContext()

export default function MaterialsContextProvider(props) {

    const [selectedProjectFolder, setselectedProjectFolder] = useState(null)
    const [selectedTeamFolder, setselectedTeamFolder] = useState(null)

    return <MaterialsContext.Provider value={{ selectedProjectFolder, setselectedProjectFolder, selectedTeamFolder, setselectedTeamFolder }} >
        {props.children}
    </MaterialsContext.Provider>
}