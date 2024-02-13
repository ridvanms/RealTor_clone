// Importing necessary modules: React, useState, and Link from 'react-router-dom'
// Also importing OAuth component
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { toast } from "react-toastify"
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
// ForgotPassword component
export default function ForgotPossword() {
  const navigate = useNavigate();
  // Declaring a state variable 'email' and its setter function 'setEmail'
  const [email, setEmail] = useState("")

  // onChange function to update the email state with the input value
  function onChange(e) {
    setEmail(e.target.value)
  }
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success("Email was sent successfully")
      navigate("/sign-in")
    } catch (error) {
      toast.error("Could not send reset password!")
    }
  }
  // JSX code for the ForgotPassword component
  return (
    <section>
      {/* Heading */}
      <h1 className="text-3xl text-center mt-6 font-bold">Forgot Password</h1>
      {/* Container for the form and image */}
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        {/* Image container */}
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1561065749-2a263ce7b379?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="SignIn"
            className="w-full rounded-2xl"
          />
        </div>
        {/* Form container */}
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          {/* Form */}
          <form onSubmit={onSubmit}>
            {/* Email input field */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />
            {/* Links for registration and sign-in */}
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">Don't have an account ? 
                {/* Link to the registration page */}
                <Link
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1" to="/sign-up">Register</Link></p>
              <p >
                {/* Link to the sign-in page */}
                <Link to="/sign-in"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1">Sign in</Link>
              </p>
            </div>
            {/* Button for sending reset password email */}
            <button className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium 
            uppercase rounded shadow-md hover:bg-blue-700
            transition duration-150 ease-in-out hover:shadow-lg
            active:bg-blue-800" type="submit">Send reset password</button>
            {/* OR separator and OAuth component */}
            <div className="flex items-center my-4 before:border-t 
            before:flex-1 before:border-gray-300 after:border-t 
            after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            {/* OAuth component for third-party login options */}
            <OAuth/>
          </form>
        </div>
      </div>
    </section>
  )
}