import { User, User2Icon } from "lucide-react"
import { useState } from "react"
import Logout from "../Logout/Logout"



export default function NavbarList() {
    const [dropped, setDropped] = useState(false)
    return <>

        <div>
            <button onClick={() => { setDropped(!dropped) }} className="text-white dark:text-darkblue hover:bg-blueblack font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:bg-white  transition-colors " type="button"> <User2Icon /> <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
            </svg>
            </button>
            {/* Dropdown menu */}
            <div id="navmenuDropdown" onMouseLeave={() => { setDropped(false) }} className={`z-10 ${dropped ? "absolute top-full" : "hidden"} bg-white divide-y divide-gray-100 rounded-full shadow p-3 dark:bg-white`}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 space-y-3" aria-labelledby="navmenuDropdownButton">
                    <li>
                        <User color="#0b2534" />
                    </li>
                    <li>
                        <Logout />
                    </li>

                </ul>
            </div>
        </div>


    </>
}
