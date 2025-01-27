import { createContext, useState } from "react";



export let TeamsContext = createContext()

export default function TeamsContextProvider(props) {

    const [selectedTeam, setselectedTeam] = useState(null)

    return <TeamsContext.Provider value={{ selectedTeam, setselectedTeam }} >
        {props.children}
    </TeamsContext.Provider>
}