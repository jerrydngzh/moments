'use client'
import {Link} from 'react-router-dom';
import { useEffect, useState } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState([]);
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
        const response = await fetch(`http://localhost:3000/api/users/${idFromQuery}`);
        const data = await response.json();
        console.log('Fetched Accounts:', data);
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
          <p>Name: {userData.firstname} {userData.lastname}</p>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
    
      <Link to={'/createMemo?id='+id+''} className='buttonLink'>Create Memo</Link>
      <Link to={'/dashboard?id='+id+''} className='buttonLink'>Dashboard</Link>
      <Link to={'/lens?id='+id+''} className='buttonLink'>Lens</Link>

    </main>
  );
};

export default Profile;
