'use client'
import {Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserController } from '../controllers/user.controller';

const Profile = () => {
  const [userData, setUserData] = useState<any>({});
  const [id, setID] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get('id') || '';

    // Update the state with the username
    setID(idFromQuery);
    console.log(idFromQuery);
    // Fetch user data from the JSON file
    const fetchData = async () => {
      try {
        const data = await UserController.get_user_profile(idFromQuery)
        console.log('Fetched Account:', data);
        setUserData(data || {});
        
         // Set the data in state
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className='Profile'>
      <h2>User Profile</h2>
          <p>Name: {userData.first_name} {userData.last_name}</p>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
    
      <Link to={'/createMemo?id='+id+''} className='buttonLink'>Create Memo</Link>
      <Link to={'/dashboard?id='+id+''} className='buttonLink'>Dashboard</Link>
      <Link to={'/lens?id='+id+''} className='buttonLink'>Lens</Link>
      <Link to={'/user'} className='buttonLink'>Log out</Link>

    </main>
  );
};

export default Profile;
