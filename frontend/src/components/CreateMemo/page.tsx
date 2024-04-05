import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import MapForm from './components/LocationMapPicker/Map';
import SavedLocations from './components/Locations/SavedLocations';
import { MemoController } from '../../controllers/memo.controller';
import { MemoType } from '../../models/memo';
import { UserController } from '../../controllers/user.controller';

const CreateMemo = ({ }) => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState<any>(''); // FIXME - get user ID from session state (for itr2)
  const [name, setName] = useState<any>('');
  const [description, setMemo] = useState<any>('');
  const [locationName, setLocationName] = useState<any>('');
  //const [savedLocations, setSavedLocations] = useState<any>({});
  const [coordinates, setCoordinates] = useState<[number, number]>([49.27326489299744, -123.10365200042726]);
  const [reloadDropdown, setReloadDropdown] = useState<any>(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  //const [tags, setTags] = useState<any>([]);
  //const [selectedTags, setSelectedTags] = useState<any>([]);
  //const [newTag, setNewTag] = useState<any>('');
  const [userData, setUserData] = useState<any>({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    memos: [],
    saveLoc: [{}],
    tags: [],
  });  
  const [media, setMedia] = useState<string[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<Blob[]>([]);

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
      //const tags = data.tags;

      setUserData(data);
      //setTags(tags || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get('id') || '';
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
  }, [coordinates, userID]);

  /*const handleTagChange = (event: any) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option: any) => option.value);
    setSelectedTags(selectedOptions);
  };*/

  const handleMapClick = (clickedLocation: [number, number]) => {
    console.log(clickedLocation);
    setCoordinates(clickedLocation);
  };


  const handleDropdownReloaded = () => {
    // Reset reloadDropdown to false after the dropdown has been reloaded
    setReloadDropdown(false);
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
    const createMemoWithMedia = async (newMedia: Blob[]) => {
      try {
          const newMediaStrings: string[] = await Promise.all(newMedia.map(convertBlobToBase64));
          
          const memoToCreate: MemoType = {
              name,
              date: new Date().toString(),
              location: { name: locationName, coordinates: coordinates },
              description,
              media: newMediaStrings,
          };
          
          const idFromQuery = getUserIDFromQuery();
          const createdMemo = await MemoController.create_memo(idFromQuery, memoToCreate);
          
          const updatedUserData = { ...userData, memos: [...userData.memos, createdMemo._id] };
          setUserData(updatedUserData);
          
          await UserController.update_user(idFromQuery, updatedUserData);
          
          navigate(`/dashboard?id=${userID}`);
      } catch (error) {
          console.error('Error creating memo:', error);
      }
    };

    // Function to handle form submission
    const handleSubmit = async (event: any) => {
      event.preventDefault();
      // Retrieve the media input element
      const mediaInput = document.getElementById('media') as HTMLInputElement;
      
      // If the input has files, combine them with previously uploaded media
      if (mediaInput && mediaInput.files && mediaInput.files.length > 0) {
        //const newMedia: Blob[] = Array.from(mediaInput.files);
        const allMedia: Blob[] = [...uploadedMedia];
        await createMemoWithMedia(allMedia);
      } else {
        // If no new files were selected, create the memo with previously uploaded media only
        await createMemoWithMedia(uploadedMedia);
      }
    };

    // Function to handle removal of media
    const handleRemoveMedia = (indexToRemove: number) => {
      setMedia(prevMedia => prevMedia.filter((_, index) => index !== indexToRemove));
    };

    // Function to retrieve user ID from query parameters
    const getUserIDFromQuery = () => {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('id') || '';
    };


  const handleReset = () => {
    setLocationName('');
    setMemo(''); 
  };

  /*const handleNewTag = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag]);
      setSelectedTags([...selectedTags, newTag]); // Add the new category to selected categories too
      setNewTag('');
    }
  };*/

  return (
    <main className='create-memo w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800'>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <span>
          <button onClick={() => navigate('/dashboard?id=' + userID + '')} className='bg-blue-100 text-blue-800 border-2 border-blue-800 w-1/5'>Back</button>
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">New Memo</h2>
        </span>
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
          {media.map((fileURL, index) => (
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




        {/* Create Tags */}
        {/* <div className="input-container">
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
            <button type="button" onClick={handleNewTag} className='border-2 border-blue-800 w-full text-blue-800 h-14 mb-8 hover:bg-blue-50'>Add</button>
          </div>
        </div> */}

        {/* Title for Memo */}
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

        {/* Description for the Memo */}
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
