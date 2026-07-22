import Navbar from '@/components/layout/dashboardLayout/Navbar'
import Sidebar from '@/components/layout/dashboardLayout/Sidebar'
import React from 'react'

const layout = ({ children }) => {

    return (
        <div className="dashboard">
            <header className='header'> <Navbar /></header>
            <aside className='sidebar'>
                <Sidebar />
            </aside>
            <main className='main bg-dashboard-background/98'>
                {children}
            </main>

        </div>
    )
}

export default layout
