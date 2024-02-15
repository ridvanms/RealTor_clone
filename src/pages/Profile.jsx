import { getAuth } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth?.currentUser?.displayName,
    email: auth?.currentUser?.email,
  })
  const { name, email } = formData
  function onLogout() {
    auth.signOut().then(() => navigate("/sign-in"))
  }
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form >
            <input id="name" type="text" value={name}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white 
              border border-gray-300 rounded transition ease-in-out mb-6" disabled={true} />
            <input id="email" type="email" value={email}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white 
              border border-gray-300 rounded transition ease-in-out mb-6" disabled={true} />

            <div className='flex justify-between mb-6 whitespace-nowrap text-sm sm:text-lg '>
              <p className='flex items-center'>
                Do you want to change your name?
                <span className='text-red-600 hover:text-red-700 
                transition ease-in-out duration-200 ml-1 cursor-pointer'>Edit</span>
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 cursor-pointer 
              transition ease-in-out duration-200'>
                Sign out
              </p>
            </div>

          </form>
        </div>
      </section>
    </>
  )
}
