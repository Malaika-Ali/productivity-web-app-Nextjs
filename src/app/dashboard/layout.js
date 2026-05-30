import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import React from 'react'

const layout = ({ children }) => {
    return (
        <div className="dashboard">
            <header className='header'> <Navbar /></header>
            <aside className='sidebar'>
                <Sidebar/>
            </aside>
                <main className='main bg-dashboard-background'>
                    {children}
                </main>
            
        </div>
    )
}

export default layout
