'use client'
import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MapForm from './map';
import GetSavedLocations from './getSavedLocation';

const CreateMemo = ({}) => {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState<[number, number]>([49.27326489299744, -123.10365200042726]);
  const [memo, setMemo] = useState('');
  const [savedLocations, setSavedLocations] = useState({});
  const [username, setUsername] = useState('');
  const [reloadDropdown, setReloadDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLocationSelected = (location) => {
    console.log(location)
    // Set the selected location in state
    setSelectedLocation(location);
  };

  const fetchCategories = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const username = searchParams.get('username') || '';
      setUsername(username);

      // Fetch memo data from the server
      const response = await fetch('http://localhost:3000/api/users/getAccounts');
      const data = await response.json();
      var u;
      data.forEach((user)=>{
        if(user.username === username){
          u = user
        }
      });
      console.log('Fetched Accounts:', u);
      const categories = u.tags;
      setCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const usernameFromQuery = searchParams.get('username') || '';

    // Update the state with the username
    setUsername(usernameFromQuery);

    const fetchLocationName = async () => {
      const [lat, lon] = location;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
        );

        if (!response.ok) {
          const data = await response.json();
          console.error('Error fetching location name:', data.error || 'Unknown error');
          return;
        }

        const data = await response.json();

        if (data.display_name) {
          setLocationName(data.display_name);
        } else {
          console.error('Error fetching location name: No display name in response');
        }
      } catch (error) {
        console.error('Error fetching location name:', error);
      }
    };
    setReloadDropdown(true);
    fetchLocationName();
    fetchCategories();
  }, [location, savedLocations, username]);

  const handleCategoryChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedCategories(selectedOptions);
  };

  const handleMapClick = (clickedLocation: [number, number]) => {
    console.log(clickedLocation);
    setLocation(clickedLocation);
  };

  const createSaveLoc = async () => {
    const newLocation = { locationName, location };
    try {
      // Make a POST request to the createMemo API route
      const response = await fetch("http://localhost:3000/api/memos/createSaveLoc", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username,locationName,location }),
      });
      const data = await response.json();
      if (data.success) {
        setReloadDropdown(true);
      } else {
        // Handle the error, log to console for now
        console.error('Error creating memo:', data.message);
      }
    } catch (error) {
      console.error('Error creating memo:', error);
    }
  };

  const handleDropdownReloaded = () => {
    // Reset reloadDropdown to false after the dropdown has been reloaded
    setReloadDropdown(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const target = event.target;

    const enteredlocation = target.elements.locationName.value;
    const enteredmemo = target.elements.memo.value;

    try {
      // Make a POST request to the createMemo API route
      const response = await fetch("http://localhost:3000/api/memos/createMemo", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username,location,locationName, memo, selectedCategories }),
      });
      const data = await response.json();
      if (data.success) {
        // Memo created successfully, redirect to the profile page
        setSubmitted(true);
      } else {
        // Handle the error, log to console for now
        console.error('Error creating memo:', data.message);
      }
    } catch (error) {
      console.error('Error creating memo:', error);
    }
  };

  const handleReset = () => {
    setLocationName('');
    setMemo('');
  };

  const handleNewCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory]);
      setSelectedCategories([...selectedCategories, newCategory]); // Add the new category to selected categories too
      setNewCategory('');
    }
  };

  if (submitted) {
    navigate(`/dashboard?username=${username}`);    
  }

  return (
    <main className='create-memo'>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <h2>New Memo</h2>
        <div className="map-container">
          <label htmlFor='location'> Location</label>
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
          <MapForm selectedLocation={selectedLocation} onMapClick={handleMapClick} />
        </div>
        <div className="input-container">
          <label htmlFor='locationName'>Location Name</label>
          <input
            type="text"
            id="locationName"
            name="locationName"
            className='location'
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
          <button type="button" onClick={createSaveLoc}>Save Location</button>
        </div>
        <GetSavedLocations reloadDropdown={reloadDropdown} username={username} onDropdownReloaded={handleDropdownReloaded} onLocationSelected={handleLocationSelected}/>
        <div className="input-container">
          <label htmlFor='categories'>Categories</label>
          {categories.map((category) => (
            <div key={category} className="checkbox-container">
              <input
                type="checkbox"
                id={category}
                name={category}
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedCategories((prevCategories) => {
                    if (isChecked) {
                      return [...prevCategories, category];
                    } else {
                      return prevCategories.filter((prevCategory) => prevCategory !== category);
                    }
                  });
                }}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
          <div>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter a new category"
            />
            <button type="button" onClick={handleNewCategory}>Add</button>
          </div>
        </div>
        <div className="input-container">
          <label htmlFor='memo'> Memo</label>
          <textarea
            id="memo"
            name="memo"
            className='memo'
            required
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <div className="button-container">
          <input type="reset" value="Reset" />
          <input type="submit" value="Submit" />
        </div>
      </form>
      <div className='button-link'><Link to={'/profile?username='+username+''}>Profile</Link></div>
      <div className='button-link'><Link to={'/dashboard?username='+username+''}>Dashboard</Link></div>
      <div className='button-link'><Link to={'/lens?username='+username+''} className='buttonLink'>Lens</Link></div>

    </main>
  );
};

export default CreateMemo;
