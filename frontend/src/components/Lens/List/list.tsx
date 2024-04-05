// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserController } from '../../../controllers/user.controller';
import { MemoController } from '../../../controllers/memo.controller'

interface Location {
  coordinates: [number, number];
  memo: { memo: string; selectedCategories: string[] }[];
}

const listLens: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userID, setUserID] = useState('');
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});
  
  const fetchData = async () => {
    try {
      // NOTE: search for userID in path as query variable
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setUserID(idFromQuery);
      
      const userData = await UserController.get_user_profile(idFromQuery)
      setUserData(userData);

      console.log("Memos: ", userData.memos);
      // memos is an array of memo IDs :: string
      fetchMemos(userData.memos);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

  };

  const fetchMemos = async (memoID: any) => {
    try { 
      const fetchedLocations: Location[] = [];
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setUserID(idFromQuery);
      console.log("user: ", idFromQuery); // right now userid shows up as empty, need to fix this

      for (const mid of memoID) {
        // FIXME
        // const response = await fetch(`http://localhost:3000/api/memos/${userID}/${mid}`);
        // const memoData = await response.json();
        const result = await MemoController.get_memo(idFromQuery, mid);

        const locationName = result.location.name;
        const coordinates = result.location.coordinates;
        const memo = { title: result.name, memo: result.description, date: result.date };
        
        // Check if location already exists in fetchedLocations array
        const existingLocationIndex = fetchedLocations.findIndex(loc => loc.coordinates[0] === coordinates[0] && loc.coordinates[1] === coordinates[1]);
        
        if (existingLocationIndex !== -1) {
          // Location already exists, add memo to its memo array
          fetchedLocations[existingLocationIndex].memo.push(memo);
        } else {
          // Location doesn't exist, create a new Location object
          fetchedLocations.push({ coordinates: coordinates, memo: [memo] });
        }
      }
      
      setLocations(fetchedLocations);

      console.log("locations: ", locations);
      console.log("memos: ", memos);
    } catch (error) {
      console.error('Error fetching memo data:', error);
    }
  };
  

  useEffect(() => {

    fetchData();
    console.log(locations);

  }, []);

  return (
    <>
      {locations.map((location, locIndex) => (
        <ul key={locIndex}>
          {location.memo.map((memo, memoIndex) => (
            <li key={memoIndex}>{memo.title}</li>
          ))}
        </ul>
      ))}
    </>
  );
};

export default listLens;