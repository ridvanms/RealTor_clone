import { getAuth, updateProfile } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { getDatabase,ref,update,onValue } from 'firebase/database';
import { FcHome } from "react-icons/fc";
import ListingItem from '../components/ListingItem';


export default function Profile() {
  const auth = getAuth()
  const db = getDatabase();
  const navigate = useNavigate();
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [changeDetail, setChangeDetail] = useState(false)
  const [formData, setFormData] = useState({
    name: auth?.currentUser?.displayName,
    email: auth?.currentUser?.email,
  })
  const { name, email } = formData
  function onLogout() {
    auth.signOut().then(() => navigate("/sign-in"))
  }
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in firebase auth
        await updateProfile(auth.currentUser,{displayName: name})
      }
      //update name in the realtime database
      
      // const postData = {
      //   name: name,
      //   email:email
      // }
      // // const newPostKey = push(child(ref(db), 'users')).key;
      // const updates = {};
      // // updates['/users/' + newPostKey] = postData;
      // // updates['/users/' + auth.currentUser.uid + '/' + newPostKey] = postData;
      // updates['/users/' + auth.currentUser.uid] = postData;
      // return update(ref(db), updates);

      update(ref(db, 'users/' + auth.currentUser.uid), {
        username:name
      }).then(() => {
        toast.success("Profile details updated!")
      })
    } catch (error) {
      toast.error("Could not update the profile detail!")
    }
  }
  useEffect(() => {
    if (auth.currentUser) {
      const adsRef = ref(db, `ads/`);
      onValue(adsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userListings = Object.values(data).filter((value) => {
            
            return value.ownerID === auth.currentUser.uid
          }).sort((a, b) => {
            return a.timestamp - b.timestamp;
          })
          
          setListings(userListings);
          setLoading(false);
        } else {
          setListings([]);
          setLoading(false);
        }
      })
    }
  },[auth.currentUser,db])
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form >
            <input id="name" type="text" value={name}
              className={`w-full px-4 py-2 text-xl text-gray-700 bg-white 
              border border-gray-300 rounded transition ease-in-out mb-6
              ${changeDetail && "bg-red-200 focus:bg-red-200"}`} disabled={!changeDetail}
              onChange={onChange}
            />
            <input id="email" type="email" value={email}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white 
              border border-gray-300 rounded transition ease-in-out mb-6"
              disabled={true}
              
            />

            <div className='flex justify-between mb-6 whitespace-nowrap text-sm sm:text-lg '>
              <p className='flex items-center'>
                Do you want to change your name?
                <span
                  onClick={(e) => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState)=>!prevState)
                  }}
                  className='text-red-600 hover:text-red-700 
                transition ease-in-out duration-200 ml-1 cursor-pointer'>
                  {changeDetail ? "Apply change": "Edit"}
                </span>
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 cursor-pointer 
              transition ease-in-out duration-200'>
                Sign out
              </p>
            </div>

          </form>
          <button type="submit" className='w-full bg-blue-600 
          text-white uppercase  px-7 py-3 text-sm font-medium rounded
          shadow-md hover:bg-blue-700 transition duration-150 ease-in-out
          hover:shadow-lg active:shadow-lg active:bg-blue-800'>
            <Link to="/create-listing" className='flex justify-center items-center'>
              <FcHome className='mr-2 text-3xl bg-red-200 
              rounded-full p-1 border-2' /> Sell or rent your home 
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto ">
        {!loading && listings.length > 0 &&  (
          <>
            <h2 className='text-2xl text-center font-semibold'>My  Listings</h2>
            <ul>
              {listings.map((listing) =>
                <ListingItem
                      key={listing.id}
                      id={listing.id}
                      listing={listing}
                />
              )}
            </ul>
          </>
        )}
       </div>
    </>
  )
}
