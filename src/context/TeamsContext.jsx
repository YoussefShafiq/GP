import { createContext, useState } from "react";



export let TeamsContext = createContext()

export default function TeamsContextProvider(props) {

    const [selectedTeam, setselectedTeam] = useState(null)
    const [selectedDashboardTeam, setselectedDashboardTeam] = useState(null)

    return <TeamsContext.Provider value={{ selectedTeam, setselectedTeam, selectedDashboardTeam, setselectedDashboardTeam }} >
        {props.children}
    </TeamsContext.Provider>
}