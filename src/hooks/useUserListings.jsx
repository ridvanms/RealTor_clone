import { useState, useEffect } from 'react';
import { database, ref, onValue } from 'firebase/database';

const useUserListings = (db, auth, isAuth, filter, limit) => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuth) {
      const adsRef = ref(db, 'ads/');
      onValue(adsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          let userListings = Object.values(data).filter((value) => {
            if (value.hasOwnProperty('ownerID')) {
              return value.ownerID === auth.currentUser.uid;
            } else {
              return true;
            }
          });
          if (limit) {
            userListings = userListings.slice(0, limit);
          }
          userListings.sort((a, b) => a.timestamp - b.timestamp);
          setListings(userListings);
          setLoading(false);
        } else {
          setListings([]);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, [db, auth, isAuth, filter, limit]);

  return { listings, loading };
}

export default useUserListings;