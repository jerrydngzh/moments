// CreateAccountPage.js
'use client'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react';
import { UserController } from '../controllers/user.controller';

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // NOTE: allowing duplicate username as each user will have unique id

    try {
      // Create new User
      const user = await UserController.create_user(userData)   
      console.log("Successfully created user: ", user)
      navigate('/user');
    } catch (error) {
      console.error('Error creating account:', error);
      // Provide user feedback (e.g., set an error state)
    }
  };

  return (
    <main className='Create-Account'>
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <label htmlFor='first_name'>First Name</label>
        <input
        type='text'
        id='first_name'
        name='first_name'
        value={userData.first_name}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, first_name: e.target.value }))}
        />
        <label htmlFor='last_name'>Last Name</label>
        <input
        type='text'
        id='last_name'
        name='last_name'
        value={userData.last_name}
        required
        onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, last_name: e.target.value }))}
        />
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
