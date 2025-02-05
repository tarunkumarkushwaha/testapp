"use client"
import React from 'react'

const Navbar = () => {
  
  return (
    <>
      <nav className="flex flex-row items-center p-7 justify-between bg-slate-100">
        <h2 className='font-bold text-violet-700'> &#9654; Task Manager</h2>
        <div className='flex justify-center items-center gap-4'>
          
          <p title='just enter task' className='font-semibold text-cyan-700 text-xs cursor-pointer'>help</p>
          <p>|</p>
          <img title='0' width="24" height="24" src="https://img.icons8.com/material-two-tone/24/bell--v1.png" alt="bell--v1" />
          <img title='user' width="24" height="24" src="https://img.icons8.com/office/40/person-male.png" alt="person-male"/>
        </div>
      </nav>
    </>
  )
}

export default Navbar