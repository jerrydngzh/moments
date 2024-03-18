'use client'
import React, { useState, useEffect } from 'react';
import MapForm from '../createMemo/map';
import { Link } from 'react-router-dom';

interface Location {
  coordinates: [number, number];
  memo: string;
}

const Lens: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const username = searchParams.get('username') || '';
        setUsername(username);

        const response = await fetch(`https://localhost:8080/api/getMemos`);
        const data = await response.json();
        const { locations } = data[username] || {};
        const userLocations: Location[] = Object.entries(locations || {}).map(([address, location]: [string, any]) => ({
          coordinates: location.coordinates,
          memo: location.memo,
        }));
        setLocations(userLocations);
      } catch (error) {
        console.error('Error fetching memo data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="lens">
      <h1>Lens</h1>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <MapForm locations={locations} />
      <Link to={'/createMemo?username='+username+''} className='buttonLink'>Create Memo</Link>
      <Link to={'/profile?username='+username+''} className='buttonLink'>Profile</Link>
      <Link to={'/lens?username='+username+''} className='buttonLink'>Lens</Link>
    </div>
  );
};

export default Lens;