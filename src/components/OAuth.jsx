import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';
import { getDatabase, ref, set } from 'firebase/database';
import { serverTimestamp } from 'firebase/firestore';

export default function OAuth() {
  const db = getDatabase();

  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      //check for the user
      set(ref(db, 'users/' + user.uid), {
        username: user.displayName,
        email: user.email,
        timestamp: serverTimestamp(),
      });
      
    } catch (error) {
      console.log('Error :', error.message);
      toast.error("Could not authorize with Google")
    }
  }
  return (
      <button type='button' onClick={onGoogleClick} className="flex items-center justify-center w-full
      bg-red-700 text-white px-7 py-3 uppercase  text-sm font-medium
      hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg
      active:shadow-lg transition duration-150 ease-in-out rounded">
          <FcGoogle className='text-2xl bg-white rounded-full
          mr-2'/>
          Continue wiht Google 
    </button>
  )
}
