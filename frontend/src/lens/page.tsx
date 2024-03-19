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
  const [id, setID] = useState('');
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});
  
  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setID(idFromQuery);
      // Fetch memo data from the server
      const response = await fetch(`http://localhost:3000/api/users/${idFromQuery}`);
      const data = await response.json();
      console.log(data);
      setUserData(data);
      fetchMemos(data.memos);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchMemos = async (memoID: any) => {
    console.log(memoID);
    for (const id of memoID) {
      try {
        const response = await fetch(`http://localhost:3000/api/memos/${id}`);
        const data = await response.json(); 
        setMemos({...memos, [id]:data});
        console.log(memos);
        /*const userLocations: Location[] = Object.entries(locations || {}).map(([address, location]: [string, any]) => ({
          coordinates: location.coordinates,
          memo: location.memo,
        }));*/
        var fetchedLocations : Location[] = [];
        for(const memo in memos){
          const Loc: Location = { coordinates: memo.location.coordinates, memo: memo.description };
          fetchedLocations.push(Loc);
        }
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching memo data:', error);
      }
    }
  };
  

  useEffect(() => {


    fetchData();
  }, []);

  return (
    <div className="lens">
      <h1>Lens</h1>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <MapForm locations={locations} />
      <Link to={'/createMemo?id='+id+''} className='buttonLink'>Create Memo</Link>
      <Link to={'/profile?id='+id+''} className='buttonLink'>Profile</Link>
      <Link to={'/lens?id='+id+''} className='buttonLink'>Lens</Link>
    </div>
  );
};

export default Lens;