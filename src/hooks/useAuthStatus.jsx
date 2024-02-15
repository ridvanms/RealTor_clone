import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'


export  function useAuthStatus() {
    const [loggedIn, setLoggedIn] = useState(false)
    // Function to check if user is logged in or not.
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true)
            }
            setCheckingStatus(false)
        })
    },[])

    return { loggedIn, checkingStatus }
}
