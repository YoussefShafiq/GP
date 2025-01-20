import { createContext, useState } from "react";



export let NotesContext = createContext()

export default function NotesContextProvider(props) {

    const [selectedFolder, setSelectedFolder] = useState()
    const [selectedFolderName, setSelectedFolderName] = useState()
    const [selectedNote, setSelectedNote] = useState()

    return <NotesContext.Provider value={{ selectedFolder, setSelectedFolder, selectedNote, setSelectedNote, selectedFolderName, setSelectedFolderName }} >
        {props.children}
    </NotesContext.Provider>
}