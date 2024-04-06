import React, { useState } from 'react'
import useUserListings from '../hooks/useUserListings'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import ListingItem from '../components/ListingItem';


export default function Home() {
  const db = getDatabase();
  const auth = getAuth();
  const {listings,loading} = useUserListings(db,auth,null,10)
  
  return (
    <>
      <section className='relative w-full h-96 mb-10 '>
        <img src={require("../Assets/headerImage.jpg")} alt="headerImg"
        className='absolute w-full h-96  object-cover brightness-75' loading='lazy'/>
        
        <div className=' w-full h-full  flex flex-col items-center justify-evenly'>
          <div className='z-10 pt-10 font-mono '>
            <h1 className='  z-10 text-black  font-extrabold text-2xl sm:text-4xl  md:text-6xl
              dark:text-stone-200 '>The site for real estate </h1>
            <h1 className='ml-10 z-10  text-black font-extrabold text-2xl sm:text-4xl md:text-6xl
              dark:text-stone-200 '>professionals trust*</h1>

          </div>
          
          <form className="flex items-center  w-full sm:w-1/2">   
              <div className="relative w-full h">
                  
              <input type="text" id="simple-search" className="text-lg border border-gray-200 hover:border-gray-600 rounded-2xl text-stone-900 
                  focus:ring-gray-500 focus:ring-2  focus:border-gray-500 block w-full pl-5 p-2.5" placeholder="Addres, City" required />
                  <button type="submit" className="absolute inset-y-0 end-0 m-1 p-3  text-sm font-medium text-white bg-gray-600 rounded-3xl border border-gray-500 hover:bg-gray-300 focus:ring-2 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                      <span className="sr-only">Search</span>
                  </button>
              </div>
          </form>
        </div>
      </section>
      <section className=' flex flex-col  w-100 h-96
      overflow-x-auto overflow-y-hidden'>
        <h1 className='font-semibold uppercase font-sans text-shadow-lg ml-5
        sticky left-5 text-lg '>New listings</h1>
        <div className='flex flex-nowrap w-max'>
        
          {!loading && listings.length > 0 && (
            <>
              {listings.map((listing) =>
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing}

                />)}
            </>
          )}
        </div>
      </section> 
      
    </>
      
  )
}
{/* <form className=" flex items-center  w-full sm:w-1/2">   
    <div className="relative w-full h">
        
    <input type="text" id="simple-search" className="text-lg border border-gray-200 hover:border-gray-600 rounded-2xl text-stone-900 
        focus:ring-gray-500 focus:ring-2  focus:border-gray-500 block w-full pl-5 p-2.5" placeholder="Addres, City" required />
        <button type="submit" className="absolute inset-y-0 end-0 m-1 p-3  text-sm font-medium text-white bg-gray-600 rounded-3xl border border-gray-500 hover:bg-gray-300 focus:ring-2 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span className="sr-only">Search</span>
        </button>
    </div>
  </form> */}      
                