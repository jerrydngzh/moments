// CreateAccountPage.js
'use client'
import {useNavigate} from 'react-router-dom'
import React, { useEffect, useState } from 'react';

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [existingUserData, setExistingUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:8080/api/getAccount');
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
      const response = await fetch('https://localhost:8080/api/createAccount', {
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
    <main className='Create-Account'>
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <label htmlFor='username'>Username</label>
        <input
        type='text'
        id='username'
        name='username'
        value={userData.username}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, username: e.target.value }))}
        />

        <label htmlFor='email'>Email</label>
        <input
        type='text'
        id='email'
        name='email'
        value={userData.email}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, email: e.target.value }))}
        />

        <label htmlFor='password'>Password</label>
        <input
        type='password'
        id='password'
        name='password'
        value={userData.password}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, password: e.target.value }))}
        />

        <div>
          <input type='reset' value='Reset' />
          <input type='submit' value='Create Account' />
        </div>
      </form>
    </main>
  );
};

export default CreateAccountPage;
