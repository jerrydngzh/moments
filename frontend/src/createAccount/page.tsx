// CreateAccountPage.js
'use client'
import {useNavigate} from 'react-router-dom'
import React, { useEffect, useState } from 'react';

const CreateAccountPage = () => {
  
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
  });
  const [existingUserData, setExistingUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/');
        const data = await response.json();
        console.log('Fetched Accounts:', data);
        setExistingUserData(data || {}); // Set the data in state
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchData();
  }, []); // Run the effect only once on component mount

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the username already exists
    if (existingUserData[userData.username]) {
      console.error('Username already exists');
      // Provide user feedback (e.g., set an error state)
      return;
    }

    try {
      // Make a POST request to the createAccount API route
      const response = await fetch('http://localhost:3000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        console.error('Error creating account:', data.message);
        // Provide user feedback (e.g., set an error state)
      }
    } catch (error) {
      console.error('Error creating account:', error);
      // Provide user feedback (e.g., set an error state)
    }
  };

  if (submitted) {
    // Redirect to profile page or any other page
    navigate('/user');
  }
  return (
    <main className='Create-Account w-1/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800'>
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Create Account</h2>
        <label htmlFor='firstname' className="text-lg text-blue-800">First Name</label>
        <input
        type='text'
        id='firstname'
        name='firstname'
        value={userData.firstname}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, firstname: e.target.value }))}
        />
        <label htmlFor='lastname' className="text-lg text-blue-800">Last Name</label>
        <input
        type='text'
        id='lastname'
        name='lastname'
        value={userData.lastname}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, lastname: e.target.value }))}
        />
        <label htmlFor='username' className="text-lg text-blue-800">Username</label>
        <input
        type='text'
        id='username'
        name='username'
        value={userData.username}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, username: e.target.value }))}
        />

        <label htmlFor='email' className="text-lg text-blue-800">Email</label>
        <input
        type='text'
        id='email'
        name='email'
        value={userData.email}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, email: e.target.value }))}
        />

        <label htmlFor='password' className="text-lg text-blue-800">Password</label>
        <input
        type='password'
        id='password'
        name='password'
        value={userData.password}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, password: e.target.value }))}
        />

        <div className="mt-8 text-blue-800">
          <input type='reset' value='Reset' className="mb-2 border-blue-800 h-10"/>
          <input type='submit' value='Create Account' className="border-blue-800 h-10"/>
        </div>
      </form>
    </main>
  );
};

export default CreateAccountPage;
