import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FolderMinus, Square } from 'lucide-react'
import React from 'react'

export default function Materials() {
    return <>
        <div className="p-5">
            <h2 className='capitalize font-semibold text-3xl'>welcome back!</h2>
            <div className='capitalize text-lg text-gray-600 mt-3 mb-4 flex items-center gap-2 w-fit'><FolderMinus size={20} /> folders</div>

            {/* folders */}
            <div className="flex flex-wrap gap-3">
                <div className="relative bg-base rounded-lg shadow-lg p-6 w-[calc(25%-10px)] rounded-tl-none mt-5 cursor-pointer ">
                    <div className="absolute w-1/2 -top-6 left-0 bg-base h-6 text-white text-sm font-semibold px-4 py-1 rounded-tl-lg rounded-tr-3xl "></div>
                    <div className="">
                        <div className="flex items-center gap-2">
                            <div className="aspect-square p-1.5 rounded-lg bg-highlight"><Square fill='#eee' color='#eee' size={8} /></div>
                            <h2 className="text-lg font-bold text-gray-800">team1</h2>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <p className="text-sm text-gray-500 mt-2">Apr 2, 2023</p>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
