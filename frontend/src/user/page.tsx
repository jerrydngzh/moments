"use client"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserController } from '../controllers/user.controller';

const User = () => {
    const navigate = useNavigate();
    const [route, setRoute] = useState('');
    const [id, setId] = useState('');
    const [existingUserData, setExistingUserData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await UserController.get_all()
          console.log('Fetched Accounts:', data);
          setExistingUserData(data || []); // Set the data in state
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
      const enteredUsername = target.elements.user_name.value;
      const enteredPassword = target.elements.password.value;
      const enteredEmail = target.elements.email.value;

      // Ignore the fact that this isnt really safe or secure i pinky promise to fix it later
      existingUserData.forEach((user: any)=>{
          if(user.username === enteredUsername){
            if(user.password == enteredPassword && user.email === enteredEmail){
              setId(user._id);
              navigate(`/profile?id=${user._id}`);
            } else {
              // Handle incorrect credentials (show an error message, for example)
              console.log('Incorrect username or password');
            }
          }
      });
      
      
    };

    return (
      <main className='Create-Profile'>
        <form onSubmit={handleSubmit}>
          <h2>Log in</h2>
          <label htmlFor='user_name'> User Name</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            className='user_name'
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