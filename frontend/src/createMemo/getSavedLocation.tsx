import React, { useState, useEffect } from 'react';

const GetSavedLocations = ({ username, reloadDropdown, onDropdownReloaded, onLocationSelected }) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const fetchSavedLocations = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/memos/getSaveLoc');
        const data = await response.json();
        setSavedLocations(data[username] || []);
        onDropdownReloaded(); // Call the onDropdownReloaded function after the dropdown has been reloaded
      } catch (error) {
        console.error('Error fetching saved locations:', error);
      }
    };

    if (reloadDropdown) {
      fetchSavedLocations();
    }
  }, [username, reloadDropdown, onDropdownReloaded]);

  
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedLocation = savedLocations.find(location => location.locationName === selectedValue);

    if (selectedLocation) {
      const coordinates = selectedLocation.location;
      setSelectedLocation(coordinates);
      // Pass the selected location coordinates to the parent component
      onLocationSelected(coordinates);
    }
  };

  return (
    <div>
      <label htmlFor="savedLocations">Saved Locations:</label>
      <select id="savedLocations" value={selectedLocation} onChange={handleSelectChange}>
        {savedLocations.map((location, index) => (
          <option key={index} value={location.locationName}>
            {location.locationName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GetSavedLocations;
