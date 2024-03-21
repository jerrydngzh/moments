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
  const [description, setMemo] = useState('');
  const [name, setName] = useState('');
  const [savedLocations, setSavedLocations] = useState({});
  const [id, setID] = useState('');
  const [reloadDropdown, setReloadDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState({});
  
  const handleLocationSelected = (location) => {
    console.log(location)
    // Set the selected location in state
    setSelectedLocation(location);
  };

  const fetchCategories = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setID(idFromQuery);
      console.log(id);
      // Fetch memo data from the server
      const response = await fetch(`http://localhost:3000/api/users/${idFromQuery}`);
      const data = await response.json();
      console.log('Fetched Account:', data);
      const tags = data.tags;
      setUserData(data);
      setTags(tags);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get('is') || '';
    setID(idFromQuery);
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
  }, [location, savedLocations, id]);

  const handleTagChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedTags(selectedOptions);
  };

  const handleMapClick = (clickedLocation: [number, number]) => {
    console.log(clickedLocation);
    setLocation(clickedLocation);
  };

  const createSaveLoc = async () => {
    const newLocation = { name: locationName, coordinates: location };
      try {
      const updatedSaveLoc = [...userData.saveLoc, newLocation];
      const updateUserResponse  = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({saveLoc: updatedSaveLoc}),
      });
      const data = await updateUserResponse .json();
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
    const date = new Date();
    const newLocation = { name: locationName, coordinates: location };
    try {
      // Make a POST request to the createMemo API route
      const response = await fetch(`http://localhost:3000/api/memos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, date, location:newLocation, description, user_id:id, selectedTags }),
      });
      const data = await response.json();
      const newMemoId = data.memo._id;

      // Update the memos array in userData with the new memo ID
      const updatedMemos = [...userData.memos, newMemoId];
      const response2 = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({tags: tags, memos: updatedMemos}),
      });
      const data2 = await response2.json();
      if (data.success && data2.success) {
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

  const handleNewTag = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag]);
      setSelectedTags([...selectedTags, newTag]); // Add the new category to selected categories too
      setNewTag('');
    }
  };

  if (submitted) {
    navigate(`/dashboard?id=${id}`);    
  }

  return (
    <main className='create-memo w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800'>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <span>
          <button onClick={() => navigate('/dashboard?id='+id+'')} className='bg-blue-100 text-blue-800 border-2 border-blue-800 w-1/5'>Back</button>
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">New Memo</h2>
        </span>
        <div className="map-container">
          <label htmlFor='location' className="text-xl text-blue-800"> Location</label>
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
          <MapForm selectedLocation={selectedLocation} onMapClick={handleMapClick} />
        </div>
        <div className="input-container">
          <label htmlFor='locationName' className="text-xl text-blue-800">Location Name</label>
          <input
            type="text"
            id="locationName"
            name="locationName"
            className='location'
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
          <button type="button" onClick={createSaveLoc} className='border-2 border-blue-800 w-full text-blue-800 h-14 mb-8 hover:bg-blue-50'>Save Location</button>
        </div>
        <GetSavedLocations reloadDropdown={reloadDropdown} id={id} onDropdownReloaded={handleDropdownReloaded} onLocationSelected={handleLocationSelected}/>
        <div className="input-container">
          <label htmlFor='tags' className="text-xl text-blue-800">Tags</label>
          {tags && tags.map((tag) => (
            <div key={tag} className="checkbox-container">
              <input
                type="checkbox"
                id={tag}
                name={tag}
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedTags((prevTags) => {
                    if (isChecked) {
                      return [...prevTags, tag];
                    } else {
                      return prevTags.filter((prevTag) => prevTag!== tag);
                    }
                  });
                }}
              />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
          <div>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter a new tag"
            />
            <button type="button" onClick={handleNewTag} className='border-2 border-blue-800 w-full text-blue-800 h-14 mb-8 hover:bg-blue-50'>Add</button>
          </div>
        </div>
        <div className="input-container">
          <label htmlFor='name' className="text-xl text-blue-800">Title</label>
          <input
            type="text"
            id="name"
            name="name"
            className='name'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor='memo' className="text-xl text-blue-800"> Memo</label>
          <textarea
            id="memo"
            name="memo"
            className='memo'
            required
            value={description}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <div className="button-container ">
          <input className='border-2 border-blue-800 w-full text-xl text-blue-800 h-14 mb-2 mt-8 bg-blue-100 hover:bg-white rounded-xl' type="reset" value="Reset" />
          <input className='border-2 border-blue-800 w-full text-xl text-blue-800 h-14 mb-8 bg-blue-100 hover:bg-white rounded-xl' type="submit" value="Submit" />
        </div>
      </form>

      {/* <div className="flex flex-row justify-around border-2 border-blue-800 rounded-xl pt-2 pb-2"> */}
        {/* <div className='button-link'><Link className="text-blue-800" to={'/profile?id='+id+''}>Profile</Link></div>
        <div className='button-link'><Link className="text-blue-800" to={'/dashboard?id='+id+''}>Dashboard</Link></div>
        <div className='button-link'><Link className="text-blue-800" to={'/lens?id='+id+''}>Lens</Link></div> */}
       
      {/* </div> */}

    </main>
  );
};

export default CreateMemo;
