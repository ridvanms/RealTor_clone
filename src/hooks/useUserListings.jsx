import { useState, useEffect } from 'react';
import { ref, onValue,getDatabase, serverTimestamp,orderByChild } from 'firebase/database';
import { FieldValue, Timestamp } from "firebase/firestore"
const useUserListings = (db, auth, filter, limit) => {
 
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      const adsRef = ref(db, 'ads/');
      onValue(adsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          let userListings = Object.values(data).filter((value) => {
            if (filter) {
              if (filter === "ownerID") {
                return value.ownerID === auth.currentUser.uid
              }
            }
            else {
              return true;
            }
            
          })
          .slice(0, limit || Infinity)
            .sort((a, b) => {
            return b.timestamp.seconds - a.timestamp.seconds
          })
          setListings(userListings);
          setLoading(false);
        } else {
          setListings([]);
          setLoading(false);
        }
      });
  }, [db, auth, filter, limit]);

  return { listings, loading };
}

export default useUserListings;