"use client"
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

const User = () => {
    const navigate = useNavigate();
    const [route, setRoute] = useState('');
    const [existingUserData, setExistingUserData] = useState({});
    const [loggedIn, setLoggedIn] = useState(false); // New state for login status

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/users/getAccounts');
          const data = await response.json();
          console.log('Fetched Accounts:', data);
          setExistingUserData(data || {}); // Set the data in state
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      };

      fetchData();
    }, []);

    const handleSubmit = (event: { preventDefault: () => void; target: any; }) => {
      event.preventDefault();

      const target = event.target;

      // Your form processing logic goes here
      const enteredUsername = target.elements.username.value;
      const enteredPassword = target.elements.password.value;
      const enteredEmail = target.elements.email.value;

      if(existingUserData[enteredUsername]){
        const userData = existingUserData[enteredUsername];
        if (enteredPassword === userData.password && enteredEmail === userData.email) {
          // Navigate to another page if the credentials match
          setLoggedIn(true);
          
        } else {
          // Handle incorrect credentials (show an error message, for example)
          console.log('Incorrect username or password');
        }
      }
      else{
        console.log('Incorrect username or password');
      }

      
    };
    // Redirect logic
    if (loggedIn) {
      // Redirect to profile page or any other page
      navigate(`/profile?username=${username}`);
    }
    return (
      <main className='Create-Profile'>
        <form onSubmit={handleSubmit}>
          <h2>Log in</h2>
          <label htmlFor='username'> User Name</label>
          <input
            type="text"
            id="username"
            name="username"
            className='username'
            required
            onChange={(event) => {
              setRoute(event.target.value);
            }}
          />
          <label htmlFor='email'> Email</label>
          <input
            type="text"
            id="email"
            name="email"
            className='email'
            required
            onChange={(event) => {
              setRoute(event.target.value);
            }}
          />
          <label htmlFor='password'>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className='password'
            required
            onChange={(event) => {
              setRoute(event.target.value);
            }}
          />

          <div>
            <input type="reset" value="Reset" />
            <input type="submit" value="Submit" />
          </div>
        </form>
      </main>
    )
}

export default User