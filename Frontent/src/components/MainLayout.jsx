import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className='flex'>
      <LeftSidebar />
      <div className='flex-1 ml-[240px]'>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
