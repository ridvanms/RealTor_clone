import React from 'react'
import { Link } from "react-router-dom"
import  Moment  from "react-moment"
import { IoLocation } from "react-icons/io5";
import { Timestamp } from "firebase/firestore"
export default function ListingItem({ listing, id }) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timestampDifference = currentTimestamp - listing?.timestamp?.seconds;

  let timeAgo;
  if (timestampDifference < 60) {
    timeAgo = 'a few seconds ago';
  } else if (timestampDifference < 3600) {
    const minutes = Math.floor(timestampDifference / 60);
    timeAgo = `a few minutes ago`;
  } else if (timestampDifference < 86400) {
    const hours = Math.floor(timestampDifference / 3600);
    timeAgo = `a few hours ago`;
  } else if (timestampDifference < 2592000) {
    const days = Math.floor(timestampDifference / 86400);
    timeAgo = `a few days ago`;
  } else if (timestampDifference < 31536000) {
    const months = Math.floor(timestampDifference / 2592000);
    timeAgo = `a few months ago`;
  } else {
    const years = Math.floor(timestampDifference / 31536000);
    timeAgo = `a few years ago`;
  }
  return (
    <li className='relative bg-white flex flex-col justify-between items-center
    shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow
    duration-150 m-[10px]'>
      <Link className='contents' to={`/catagory/${listing?.type}/${id}`}>
        <img src={listing?.imgUrls[0]} alt="ListingImg"
          className='h-[170px] w-full object-cover hover:scale-105 transition-scale
          duration-200 ease-in' loading='lazy'/>
        <h2  className='absolute top-2 left-2 bg-[#3377cc]
        text-white uppercase text-xs font-semibold rounded-md px-2 py-1
        shadow-lg'>{timeAgo}</h2>
        <div className="w-full p-[10px] ">
          <div className="flex items-center space-x-1">
            <IoLocation className='h-4 w-4 text-green-600' />
            <p className="font-semibold text-sm mb-[2px] text-grey-600 truncate">{listing.address}</p>
          </div>
          <p className="font-semibold  text-xl truncate ">{listing.name}</p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            ${listing?.offer ? listing?.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
              : listing?.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing?.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` 
                : `1 Bed`}</p>  
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `1 Bath` } </p>
            </div>
          </div>    
        </div>
      </Link>
    </li>
     
  )
}
