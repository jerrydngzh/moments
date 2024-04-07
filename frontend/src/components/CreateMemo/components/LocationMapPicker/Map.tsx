 // @ts-nocheck
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '/images/marker-icon.png';
const MapForm = ({ selectedLocation, onMapClick }: any) => {
  const [initialPosition, setInitialPosition] = useState([49.27326489299744, -123.10365200042726]);
  const [position, setPosition] = useState(initialPosition);
  
  const customMarkerIcon = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [32, 32], // Adjust the size of your marker icon as needed
  });
  useEffect(() => {
    if (selectedLocation) {
      // Add a new position for the selected location
      setPosition(selectedLocation);
      setInitialPosition(selectedLocation);
      addMarkerAndNavigate(selectedLocation);

    }
  }, [selectedLocation]);

  const addMarkerAndNavigate = (location: any) => {
    setPosition(location); // Set the positions array with only the new location
    onMapClick(location); // Trigger the map click event
    setInitialPosition(location);
  };

  const Markers = () => {
    const map = useMapEvents({
      click(e) {
        const clickedLocation = [e.latlng.lat, e.latlng.lng];
        setPosition(clickedLocation); // Add new position to the array
        onMapClick(clickedLocation);
        setInitialPosition(clickedLocation);
      },
    });

    const deleteMarker = (index: any, e: any) => {
      e.stopPropagation(); // Stop event propagation to prevent the map click event
      setPosition(null);
      setInitialPosition(null);
      onMapClick(null);
    };

    return (
      <Marker position={position} icon={customMarkerIcon} draggable={true} eventHandlers={{
        dragend: (e) => {
          const newPosition = [e.target.getLatLng().lat, e.target.getLatLng().lng];
          setPosition(newPosition);
          setInitialPosition(newPosition);
          onMapClick(newPosition);
        }
      }}>
        <Popup>
          <button onClick={deleteMarker}>Delete</button> {/* Button to delete the marker */}
        </Popup>
      </Marker>
    );
  };

  return (
    <MapContainer
      key={position.toString()}
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <Markers />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default MapForm;
