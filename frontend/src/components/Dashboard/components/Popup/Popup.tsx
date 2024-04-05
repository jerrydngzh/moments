// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react';
import { MemoController } from '../../../../controllers/memo.controller';
import { MemoType } from '../../../../models/memo';
import MapForm from '../../../CreateMemo/components/LocationMapPicker/Map';
import SavedLocations from '../../../CreateMemo/components/Locations/SavedLocations';
import "./Popup.css";
const Popup = ({userID, selectedMemo, selectedLocationPop, tags, handleUpdateTags, handleClose, handlePopupSubmit,reloadDashboard, Key }) => {
  //const [newTag, setNewTag] = useState('');
  const [reloadKey, setReloadKey] = useState(Key);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedMemo.name);
  const [editedMemo, setEditedMemo] = useState(selectedMemo.description);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([49.27326489299744, -123.10365200042726]);
  const [locationName, setLocationName] = useState<any>(selectedMemo.location.name);
  const [media, setMedia] = useState<string[]>(selectedMemo.media);
  const [uploadedMedia, setUploadedMedia] = useState<Blob[]>([]);
  const [reloadDropdown, setReloadDropdown] = useState<any>(false);

  useEffect(() => {
    if (reloadKey) {
      //setNewTag('');
      setReloadKey(false);
      handlePopupSubmit();
    }
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
    console.log(selectedMemo);
  }, [coordinates, reloadKey, selectedMemo]);

  const handleEditClick = () => {
    setEditing(true);
  };
  const handleDropdownReloaded = () => {
    // Reset reloadDropdown to false after the dropdown has been reloaded
    setReloadDropdown(false);
  };

  const handleSaveClick = () => {
    // Call a function to submit the edited title and memo
    handleEditSubmit(editedTitle, editedMemo);
    setEditing(false);
  };
  const handleLocationSelected = (location: any) => {
    console.log(location)
    // Set the selected location in state
    setSelectedLocation(location);
  };
  const handleMapClick = (clickedLocation: [number, number]) => {
    console.log(clickedLocation);
    setCoordinates(clickedLocation);
  };

  // Function to handle the upload of media files
  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files) {
      const newMedia: Blob[] = Array.from(files);
      setUploadedMedia(prevMedia => [...prevMedia, ...newMedia]);
        for (const file of Array.from(files)) {
            await processMediaFile(file);
        }
    }
  };

  // Process each media file asynchronously
  const processMediaFile = async (file: File) => {
    try {
        const base64String = await convertBlobToBase64(file);
        setMedia(prevMedia => [...prevMedia, base64String]);
    } catch (error) {
        console.error('Error processing media file:', error);
    }
  };

  // Convert Blob object to Base64-encoded string
  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            const base64String = reader.result as string;
            resolve(base64String);
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  };

  // Function to create a memo with media
  const updateMemoWithMedia = async (newMedia: Blob[],newTitle: any, newMemo:any) => {
    try {
        const newMediaStrings: string[] = await Promise.all(newMedia.map(convertBlobToBase64));
        // Here, you can define the submission logic
        // For now, let's just log the new title and memo
        selectedMemo.name = newTitle;
        selectedMemo.description = newMemo;
        selectedMemo.date = new Date().toString();
        selectedMemo.location = { name: locationName, coordinates: coordinates };
        selectedMemo.media = newMediaStrings;
        const updatedMemo = {
          id: selectedMemo._id,
          description: selectedMemo.description,
          date: selectedMemo.date,
          name: selectedMemo.name,
          location: selectedMemo.location,
          media: selectedMemo.media
        };

          
          const idFromQuery = getUserIDFromQuery();
          await MemoController.update_memo(idFromQuery, updatedMemo);
          
      }catch (error) {
          console.error('Error updating memo:', error);
        }
        reloadDashboard(true);
  };

  // Function to handle removal of media
  const handleRemoveMedia = (indexToRemove: number) => {
    setMedia(prevMedia => prevMedia.filter((_, index) => index !== indexToRemove));
  };

  // Function to retrieve user ID from query parameters
  const getUserIDFromQuery = () => {
    event.preventDefault();
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('id') || '';
  };

  const handleEditSubmit = async(newTitle, newMemo) => {
    const mediaInput = document.getElementById('media') as HTMLInputElement;
  
    // If the input has files, combine them with previously uploaded media
    if (mediaInput && mediaInput.files && mediaInput.files.length > 0) {
      //const newMedia: Blob[] = Array.from(mediaInput.files);
      const allMedia: Blob[] = [...uploadedMedia];
      await updateMemoWithMedia(allMedia,newTitle, newMemo);
    } else {
      // If no new files were selected, create the memo with previously uploaded media only
      await updateMemoWithMedia(uploadedMedia,newTitle, newMemo);
    }
    
  };

  /*const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = async () => {
    if (newTag.trim() !== '') {
      handleUpdateTags([...selectedMemo.tags, newTag], selectedMemo._id);

      try {
        // FIXME
        await fetch(`http://localhost:3000/api/memos/${selectedMemo._id}`);
        setReloadKey(Date.now()); // Reload by updating reloadKey
      } catch (error) {
        console.error('Error fetching memo data:', error);
      }
      setNewTag('');
      setReloadKey(true);
      
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = selectedMemo.tags.filter(tag => tag !== tagToRemove);
    handleUpdateTags(updatedTags, selectedMemo._id);
    try {
      // FIXME
      await fetch(`http://localhost:3000/api/memos/${selectedMemo._id}`);
      setReloadKey(Date.now()); // Reload by updating reloadKey
    } catch (error) {
      console.error('Error fetching memo data:', error);
    }
    handleClose();
    setReloadKey(true);
  };*/

  return (
    <div className="popup">
      <h2>Memo Details</h2>
      {editing ? (
        <>
        <div className="scrollable-container">
          <div className="map-container">
            <label htmlFor='location' className="text-xl text-blue-800"> Location</label>
            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
            <MapForm selectedLocation={selectedLocation} onMapClick={handleMapClick} />
          </div>

          {/* Map-Location Name Label */}
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
            {/* <button type="button" onClick={createSaveLoc} className='border-2 border-blue-800 w-full text-blue-800 h-14 mb-8 hover:bg-blue-50'>Save Location</button> */}
          </div>

          {/* Displays Saved Locations */}
          <SavedLocations reloadDropdown={reloadDropdown} id={userID} onDropdownReloaded={handleDropdownReloaded} onLocationSelected={handleLocationSelected} /> 
          {/* Media upload field */}
          <div className="input-container">
            <label htmlFor='media' className="text-xl text-blue-800">Upload Media</label>
            <input
              type="file"
              id="media"
              name="media"
              multiple
              accept="image/*, video/*, audio/*"
              onChange={handleMediaUpload}
            />
          </div>

        {/* Display uploaded media */}
          <div className="media-container">
            {media.length > 0 && media.map((fileURL, index) => (
              <div key={index} className="media-item">
                {/* Determine the type of media based on the file URL */}
                {fileURL.startsWith('data:image') ? (
                  // If it's an image file
                  <img src={fileURL} alt={`Media ${index}`} />
                ) : fileURL.startsWith('data:video') ? (
                  // If it's a video file
                  <video controls>
                    <source src={fileURL} />
                    Your browser does not support the video tag.
                  </video>
                ) : fileURL.startsWith('data:audio') ? (
                  // If it's an audio file
                  <audio controls>
                    <source src={fileURL} />
                    Your browser does not support the audio tag.
                  </audio>
                ) : (
                  // If it's another type of file (unsupported), you can display a message
                  <div>This file type is not supported.</div>
                )}
                <div className="media-actions">
                  <button onClick={() => handleRemoveMedia(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              type="text"
              value={editedMemo}
              onChange={(e) => setEditedMemo(e.target.value)}
            />
            <button onClick={handleSaveClick}>Save</button>
            </div>
        </>
      ) : (
      <>
        <p><strong>Title:</strong> {selectedMemo.name}</p>
        <p><strong>Memo:</strong> {selectedMemo.description}</p>
        <p><strong>Location:</strong> {selectedMemo.location.name}</p>
        <p><strong>Coordinates:</strong> {selectedMemo.location.coordinates}</p>
        {/* Display media */}
        {selectedMemo.media.length > 0 && (
          <div className="media-container relative">
            {/* Display current media item */}
            <div className="media-item">
              {/* Determine the type of media based on the file URL */}
              {selectedMemo.media[currentMediaIndex] && selectedMemo.media[currentMediaIndex].startsWith('data:image') ? (
                // If it's an image file
                <img src={selectedMemo.media[currentMediaIndex]} alt={`Media ${currentMediaIndex}`} className="w-full h-auto" />
              ) : selectedMemo.media[currentMediaIndex] && selectedMemo.media[currentMediaIndex].startsWith('data:video') ? (
                // If it's a video file
                <video controls className="w-full h-auto">
                  <source src={selectedMemo.media[currentMediaIndex]} />
                  Your browser does not support the video tag.
                </video>
              ) : selectedMemo.media[currentMediaIndex] && selectedMemo.media[currentMediaIndex].startsWith('data:audio') ? (
                // If it's an audio file
                <audio controls className="w-full">
                  <source src={selectedMemo.media[currentMediaIndex]} />
                  Your browser does not support the audio tag.
                </audio>
              ) : (
                // If it's another type of file (unsupported), you can display a message
                <div>This file type is not supported.</div>
              )}
            </div>
          </div>
        )}
        {/* Navigation buttons */}
        {selectedMemo.media && selectedMemo.media.length > 0 && (
          <>
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentMediaIndex((prevIndex) => (prevIndex === 0 ? selectedMemo.media.length - 1 : prevIndex - 1));
              }}
            >
              Prev
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentMediaIndex((prevIndex) => (prevIndex === selectedMemo.media.length - 1 ? 0 : prevIndex + 1));
              }}
            >
              Next
            </button>
          </>
        )}
        
        <button onClick={handleEditClick}>Edit</button>
      {/*<p><strong>Tags:</strong>
        {selectedMemo.tags.map((tag, index) => (
          <span key={index}>
            {tag}
            <button onClick={() => handleRemoveTag(tag)}>Remove</button>
          </span>
        ))}
      </p>
      <div>
        <input
          type="text"
          value={newTag}
          onChange={handleNewTagChange}
          placeholder="Enter new tag"
        />
        <button onClick={handleAddTag}>Add</button>
        </div>*/}
        </>
      )}
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default Popup;
