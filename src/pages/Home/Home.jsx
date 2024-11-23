import React from 'react'
import TasksTable from '../../components/TasksTable/TasksTable'

export default function Home() {
    return <>
        <div className="p-0 md:p-5 dark:bg-dark min-h-[calc(100vh-40px)]">
            <TasksTable />
        </div>
    </>
}
