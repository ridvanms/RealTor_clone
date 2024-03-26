import React, { useState } from 'react'
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage,ref, uploadBytesResumable,getDownloadURL  } from "firebase/storage";
import { getAuth } from "firebase/auth"
import { v4 as uuidv4 } from "uuid" 
import { serverTimestamp } from "firebase/firestore"
import { getDatabase, ref as databaseRef ,set  } from "firebase/database"
import { Navigate, useNavigate } from 'react-router';
export default function CreateListing() {
    const nav = useNavigate()
    const auth = getAuth();
    const api_key = process.env.REACT_APP_GEOCODE_API_KEY
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        Description: "",
        offer: true,
        regularPrice:0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {}
    })
    const { type, name, bedrooms, bathrooms, parking, furnished, address, Description,
        offer,regularPrice,discountedPrice,latitude,longitude,images } = formData;
     function onChange(e) {
        // Do something with the form values
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true
        }
        if (e.target.value === "false") {
            boolean = false
        }
        //Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }
        //Text/Boolean/Number
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }
    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true)
        if (+discountedPrice >= +regularPrice) {
            setLoading(false);
            toast.error('Discounted price needs to be less than regular price!')
        }
        if (images.length > 6) {
            setLoading(false)
            toast.error("Maximum 6 images are allowed!")
        }
        let geolocation = {} 
        let location;
        if (geoLocationEnabled) {
            const response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${api_key}`)
            const data = await response.json()
            // console.log(data)
            geolocation.lat = data[0]?.lat ?? 0;
            // console.log(geolocation.lat)
            geolocation.lng = data[0]?.lon ?? 0;

            location = data[0] === undefined ;
            // console.log(location)
            if (location) {
                setLoading(false)
                toast.error("Invalid address provided.")
                return;
            } 
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }
        async function storeImage(image) {
            return new Promise((res, rej) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4(10)}`
                const storageRef = ref(storage, fileName);

                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed', 
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                    case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            toast.error("User doesn't have permissions!")
                            break;
                    case 'storage/canceled':
                            // User canceled the upload
                            toast.error("User canceld the upload!")
                            break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        toast.error("Unknown error occurred!")
                            break;
                    }
                },  
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        res(downloadURL)
                        setLoading(false)
                    });
                }
                );
            })
        }
        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image)))
                .catch((error) => {
                    setLoading(false)
                    toast.error("Image not uploaded")
                    return ;
                })
        console.log(imgUrls)
        const adID = uuidv4(6);
        const formDataCopy = { 
            ...formData,
            imgUrls,
            geolocation,
            ownerID: auth.currentUser.uid,
            id: adID,
            timestamp: serverTimestamp()
        }
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.longitude
        delete formDataCopy.latitude
        // console.log(formDataCopy)
        
        const db = getDatabase()
        set(databaseRef(db, 'ads/' + adID), {
            ...formDataCopy
        });   
        setLoading(false)
        nav(`/category/${formDataCopy.type}/${adID}`)
        toast.success("Ad created!")
    }


    if (loading) {
        return <Spinner/>
    }
    return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'>Create a listing</h1>
          <form onSubmit={onSubmit}>
              <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
              <div className='flex'>
                  <button type="button" id="type" value="sale"
                        onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm
                  uppercase shadow-md rounded hover:shadow-lg focuse:shadow-lg
                  active:shadow-lg transition duration-150 ease-in-out w-full ${
                            type == "rent" ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}>Sell</button>
                  <button type="button" id="type" value="rent"
                        onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm
                  uppercase shadow-md rounded hover:shadow-lg focuse:shadow-lg
                  active:shadow-lg transition duration-150 ease-in-out w-full ${
                            type == "sale" ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}>Rent</button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Name</p>
                <input type="text" id="name" value={name} onChange={onChange}
                    placeholder='Name' minLength='10' maxLength="32" required
                    className='w-full px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded transition
                    duration-150 ease-in-out focus:text-gray-700
                    focus:bg-white focus:border-slate-600 mb-6'></input>
                <div className="flex space-x-6 mb-6">
                    <div >
                        <p className='text-lg font-semibold'>Beds</p>
                        <input type="number" id="bedrooms" value={bedrooms}
                            onChange={onChange} min="1" max="50" required
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focuse:border-slate-600 text-center'/>
                    </div>
                    <div >
                        <p className='text-lg font-semibold'>Baths</p>
                        <input type="number" id="bathrooms" value={bathrooms}
                            onChange={onChange} min="1" max="50" required
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focuse:border-slate-600 text-center'/>
                    </div>
                </div>
                <p className='text-lg mt-6 font-semibold'>Parking spot</p>
                <div className='flex'>
                  <button type="button" id="parking" value={true}
                        onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm
                  uppercase shadow-md rounded hover:shadow-lg focuse:shadow-lg
                  active:shadow-lg transition duration-150 ease-in-out w-full ${
                            !parking ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}>yes</button>
                  <button type="button" id="parking" value={false}
                        onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm
                  uppercase shadow-md rounded hover:shadow-lg focuse:shadow-lg
                  active:shadow-lg transition duration-150 ease-in-out w-full ${
                            parking ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}>no</button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Furnished</p>
                <div className='flex'>
                  <button type="button" id="furnished" value={true}
                        onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm
                  uppercase shadow-md rounded hover:shadow-lg focuse:shadow-lg
                  active:shadow-lg transition duration-150 ease-in-out w-full ${
                            !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}>yes</button>
                  <button type="button" id="furnished" value={false}
                        onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm
                  uppercase shadow-md rounded hover:shadow-lg focuse:shadow-lg
                  active:shadow-lg transition duration-150 ease-in-out w-full ${
                            furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}>no</button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Address</p>
                <textarea type="text" id="address" value={address} onChange={onChange}
                    placeholder='Address' required
                    className='w-full px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded transition
                    duration-150 ease-in-out focus:text-gray-700
                    focus:bg-white focus:border-slate-600 mb-6'/>
                {!geoLocationEnabled && (
                    <div className="flex space-x-6 justify-start mb-6">
                        <div className="">
                            <p className='text-lg font-semibold'>Latitude</p>
                            <input type="number" id="latitude" value={latitude}
                                onChange={onChange} required min="-90" max="90"
                                className='w-full px-4 py-2 text-xl text-gray-700 
                            bg-white border border-gray-300 rounded transition
                            duration-150 ease-in-out focus:bg-white focus:text-gray-700
                            focus:border-slate-600 text-center'/>
                        </div>
                        <div className="">
                            <p className='text-lg font-semibold'>Longitude</p>
                            <input type="number" id="longitude" value={longitude}
                                onChange={onChange} required min="-180" max="180"
                                className='w-full px-4 py-2 text-xl text-gray-700 
                            bg-white border border-gray-300 rounded transition
                            duration-150 ease-in-out focus:bg-white focus:text-gray-700
                            focus:border-slate-600 text-center'/>
                        </div>
                    </div>
                )}
                
                <p className='text-lg  font-semibold'>Description</p>
                <textarea type="text" id="Description" value={Description} onChange={onChange}
                    placeholder='Description' required
                    className='w-full px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded transition
                    duration-150 ease-in-out focus:text-gray-700
                    focus:bg-white focus:border-slate-600 mb-6'/>
                
                <p className='text-lg  font-semibold'>Offer</p>
                <div className='flex'>
                  <button type="button" id="offer" value={true}
                        onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm
                  uppercase shadow-md rounded hover:shadow-lg focuse:shadow-lg
                  active:shadow-lg transition duration-150 ease-in-out w-full ${
                            !offer ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}>yes</button>
                  <button type="button" id="offer" value={false}
                        onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm
                  uppercase shadow-md rounded hover:shadow-lg focuse:shadow-lg
                  active:shadow-lg transition duration-150 ease-in-out w-full ${
                            offer ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}>no</button>
                </div>
                <div className="flex items-center mb-6">
                    <div className="mt-6">
                        <p className='text-lg font-semibold'>Regular price</p>
                        <div className="flex w-full justify-center items-center space-x-6">
                            <input type="number" id="regularPrice" value={regularPrice}
                                onChange={onChange} min="50" required
                                className="w-full px-4 py-2 text-xl text-gray-700 
                                bg-white border border-gray-300 rounded transition
                                duration-150 ease-in-out focus:text-gray-700
                                focus:bg-white focus:border-slate-600 text-center
                                hover:shadow-lg" />
                        {type === "rent" && (
                            <div className="">
                                <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
                {offer && (
                     <div className="flex items-center mb-6">
                    <div className="mt-6">
                        <p className='text-lg font-semibold'>Discounted Price</p>
                        <div className="flex w-full justify-center items-center space-x-6">
                            <input type="number" id="discountedPrice" value={discountedPrice}
                                onChange={onChange}  required={offer}
                                className="w-full px-4 py-2 text-xl text-gray-700 
                                bg-white border border-gray-300 rounded transition
                                duration-150 ease-in-out focus:text-gray-700
                                focus:bg-white focus:border-slate-600 text-center
                                hover:shadow-lg" />
                        </div>
                    </div>
                </div>
                )}
                <div className="mb-6">
                    <p className="text-lg font-semibold">
                        Images
                    </p>
                    <p className="text-gray-600">
                        The first image will be the cover (max 6)
                    </p>
                    <input type="file" id="images" onChange={onChange}
                        accept='.jpg, .png, .jpeg' multiple required
                        className='w-full px-3 py-1.5 text-gray-700 bg-white 
                        border border-gray-200 rounded transition duration-150
                        ease-in-out hover:shadow-lg focus:bg-white
                        focus:border-slate-650' />
                </div>
                <button type="submit" className='mb-6  w-full px-7 py-3 
                bg-blue-600 text-white font-medium text-sm uppercase rounded
                shadow-md  hover:bg-blue-700 hover:shadow-lg focus:bg-blue-800
                focus:shadow-lg active:bg-blue-800 active:shadow-lg transition
                duration-150 ease-in-out'>
                    Create Listing
                </button>
        </form>
          
    </main>
  )
}
