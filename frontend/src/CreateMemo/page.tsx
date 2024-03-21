import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MapForm from './components/LocationMapPicker/Map';
import SavedLocations from './components/Locations/SavedLocations';
import { MemoController } from '../controllers/memo.controller';
import { MemoType } from '../models/memo';
import { UserController } from '../controllers/user.controller';

const CreateMemo = ({ }) => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState(''); // FIXME - get user ID from session state (for itr2)
  const [name, setName] = useState('');
  const [description, setMemo] = useState('');
  const [locationName, setLocationName] = useState('');
  const [savedLocations, setSavedLocations] = useState({});
  const [coordinates, setCoordinates] = useState<[number, number]>([49.27326489299744, -123.10365200042726]);
  const [reloadDropdown, setReloadDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState({});

  const handleLocationSelected = (location: any) => {
    console.log(location)
    // Set the selected location in state
    setSelectedLocation(location);
  };

  const fetchCategories = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setUserID(idFromQuery);
      console.log(userID);

      // Fetch memo data from the server
      const data = await UserController.get_user_profile(idFromQuery)

      console.log('Fetched Account:', data);
      // tags will be undefined because backend design does not support yet
      const tags = data.tags;

      setUserData(data);
      setTags(tags || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get('is') || '';
    setUserID(idFromQuery);
    const fetchLocationName = async () => {
      const [lat, lon] = coordinates;

      try {
        // NOTE
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
  }, [coordinates, savedLocations, userID]);

  const handleTagChange = (event: any) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedTags(selectedOptions);
  };

  const handleMapClick = (clickedLocation: [number, number]) => {
    console.log(clickedLocation);
    setCoordinates(clickedLocation);
  };

  const createSaveLoc = async () => {
    const newLocation = { name: locationName, coordinates: coordinates };
    
    try {
      const updatedSaveLoc = [...userData.saveLoc, newLocation];

      const updateUserResponse = await fetch(`http://localhost:3000/api/users/${userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ saveLoc: updatedSaveLoc }),
      });
      const data = await updateUserResponse.json();
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // TODO: better naming convention for the memo object fields of location
    const memoToCreate: MemoType = {
      name: name,
      date: new Date().toString(),
      location: {
        name: locationName,
        lat: coordinates[0],
        lon: coordinates[1],
      },
      description: description,
      tags: selectedTags,
    };
    
    try {
      const res = await MemoController.create_memo(userID, memoToCreate);
      const newMemoId = res.memo.id; // TODO

      // Update the memos array in userData with the new memo ID
      setUserData((prevUserData: any) => ({
        ...prevUserData,
        memos: [...userData.memos, newMemoId]
      }));

      const user = await UserController.update_user(userID, userData)
      console.log('Updated user: ', user)

      setSubmitted(true);
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

  // NOTE
  if (submitted) {
    navigate(`/dashboard?id=${userID}`);
  }

  return (
    <main className='create-memo'>


      <form onSubmit={handleSubmit} onReset={handleReset}>
        <h2>New Memo</h2>

        {/* Map */}
        <div className="map-container">
          <label htmlFor='location'> Location</label>
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
          <MapForm selectedLocation={selectedLocation} onMapClick={handleMapClick} />
        </div>

        {/* Map-Location Name Label */}
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
        
        {/* Displays Saved Locations */}
        <SavedLocations reloadDropdown={reloadDropdown} id={userID} onDropdownReloaded={handleDropdownReloaded} onLocationSelected={handleLocationSelected} />
        
        {/* Create Tags */}
        <div className="input-container">
          <label htmlFor='tags'>Tags</label>

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
                      return prevTags.filter((prevTag) => prevTag !== tag);
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
            <button type="button" onClick={handleNewTag}>Add</button>
          </div>
        </div>

        {/* Title for Memo */}
        <div className="input-container">
          <label htmlFor='name'>Title</label>
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

        {/* Description for the Memo */}
        <div className="input-container">
          <label htmlFor='memo'> Memo</label>
          <textarea
            id="memo"
            name="memo"
            className='memo'
            required
            value={description}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        
        <div className="button-container">
          <input type="reset" value="Reset" />
          <input type="submit" value="Submit" />
        </div>

      </form>
        
      <div className='button-link'><Link to={'/profile?id=' + userID + ''}>Profile</Link></div>
      <div className='button-link'><Link to={'/dashboard?id=' + userID + ''}>Dashboard</Link></div>
      <div className='button-link'><Link to={'/lens?id=' + userID + ''} className='buttonLink'>Lens</Link></div>

    </main>
  );
};

export default CreateMemo;
