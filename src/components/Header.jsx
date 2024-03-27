import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RiHome2Fill } from "react-icons/ri";


export default function Header() {
  const [pageState,setPageState] = useState("Sign In")
  const location = useLocation()
  const navigate = useNavigate()
  const auth = getAuth();
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile")
      } else {
        setPageState("Sign In")
      }
    })
  })
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true
    }
  }

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div onClick={() => navigate('/')} className='flex'>
          {/* <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="realTor" className="h-5 cursor-pointer"
          
            onClick={() => navigate('/')} /> */}
          <RiHome2Fill 
            className='h-6 text-xl cursor-pointer m-[2px] text-red-600' />
          <div className="flex cursor-pointer">
            <h2 className='text-lg font-semibold text-red-600 uppercase'>Realty</h2>  
            <h2 className='font-mono text-gray-600 lowercase'>Connect</h2> 
          </div> 
        </div>
        <div>
          <ul className="flex space-x-10">
            <li className={`cursor-pointer py-3 text-sm font-semibold
             text-gray-400 border-b-[3px] border-transparent
             ${pathMatchRoute("/") && "text-black border-b-red-500"}`}
            onClick={() => navigate('/')}>Home</li>
            <li className={`cursor-pointer py-3 text-sm font-semibold
             text-gray-400 border-b-[3px] border-transparent
             ${pathMatchRoute("/offers") && "text-black border-b-red-500"}`}
             onClick={()=>navigate('/offers')}>Offers</li>
            <li className={`cursor-pointer py-3 text-sm font-semibold
             text-gray-400 border-b-[3px] border-transparent
             ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "text-black border-b-red-500"}`}
              onClick={() => navigate('/profile')}>{pageState}</li>
          </ul>
        </div>
      </header>
    </div>
  )
}
