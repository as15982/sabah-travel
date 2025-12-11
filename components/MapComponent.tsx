

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DayPlan, ItineraryItem } from '../types';
import { LOCATIONS } from '../constants';

// Fix Leaflet icon issue in React
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom user location icon
const userIcon = L.divIcon({
  className: 'custom-user-location',
  html: `
    <div style="
      background-color: #0077BE; 
      width: 18px; 
      height: 18px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 0 15px rgba(0, 119, 190, 0.5);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #0077BE;
        color: white;
        font-size: 8px;
        padding: 2px 4px;
        border-radius: 4px;
        font-weight: bold;
        white-space: nowrap;
      ">你</div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Custom Home/Accommodation Icon
const houseIcon = L.divIcon({
  className: 'custom-house-icon',
  html: `
    <div style="
      background-color: #F26B3A; 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      border: 2px solid white; 
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34]
});

interface MapComponentProps {
  dayPlans: DayPlan[];
  selectedDate: string;
}

// Component to handle map centering logic
const MapController = ({ center, markers }: { center: [number, number], markers: any[] }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(i => [i.lat, i.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.flyTo(center, 13);
    }
  }, [center, markers, map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ dayPlans, selectedDate }) => {
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const activePlan = dayPlans.find(d => d.date === selectedDate);
  
  // Default center (Jesselton Quay)
  const defaultCenter: [number, number] = [LOCATIONS.JESSELTON_QUAY.lat, LOCATIONS.JESSELTON_QUAY.lng];

  // Flatten items and their options to get all markers for the day
  const dailyMarkers = activePlan ? activePlan.items.flatMap(item => {
    const markers = [];
    // Main item
    markers.push({
      id: item.id,
      lat: item.coords.lat,
      lng: item.coords.lng,
      name: item.coords.name, // Use the official name from LOCATIONS
      address: item.location,
      time: item.time,
      type: item.type,
      url: item.coords.url
    });
    
    // If item has options (Swipe to choose), add those locations too
    if (item.options) {
      item.options.forEach((opt, idx) => {
        markers.push({
          id: `${item.id}-opt-${idx}`,
          lat: opt.coords.lat,
          lng: opt.coords.lng,
          name: opt.coords.name, // Use the official name from LOCATIONS
          address: opt.location,
          time: item.time, // Same time as main item
          type: item.type,
          url: opt.coords.url
        });
      });
    }
    return markers;
  }) : [];

  // Always include Accommodation
  const accommodationMarker = {
    id: 'accommodation-permanent',
    lat: LOCATIONS.JESSELTON_QUAY.lat,
    lng: LOCATIONS.JESSELTON_QUAY.lng,
    name: "Jesselton Quay (JQ)",
    address: "Jesselton Quay, Jalan Tun Fuad Stephens",
    time: "Stay",
    type: 'stay',
    url: LOCATIONS.JESSELTON_QUAY.url
  };

  // Combine markers (ensure accommodation isn't duplicated if it's already in the day's plan, 
  // though rendering it twice on same spot isn't a huge issue, let's keep it simple)
  const allMarkersToFit = [...dailyMarkers, accommodationMarker];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Loc Error", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* User Location */}
        {userLoc && (
          <Marker position={userLoc} icon={userIcon}>
             <Popup>你現在的位置</Popup>
          </Marker>
        )}

        {/* Persistent Accommodation Marker */}
        <Marker 
          position={[LOCATIONS.JESSELTON_QUAY.lat, LOCATIONS.JESSELTON_QUAY.lng]} 
          icon={houseIcon}
          zIndexOffset={1000} // Keep it on top
        >
          <Tooltip permanent direction="top" offset={[0, -20]} className="font-sans text-xs font-bold bg-white border border-gray-200 shadow-sm px-2 py-1 rounded text-sabah-orange">
            住宿：Jesselton Quay (JQ)
          </Tooltip>
          <Popup>
             <div className="font-sans min-w-[150px]">
                <strong className="text-sabah-orange font-serif text-sm block mb-1">Jesselton Quay (JQ)</strong>
                <a 
                  href={LOCATIONS.JESSELTON_QUAY.url || `https://www.google.com/maps/search/?api=1&query=${LOCATIONS.JESSELTON_QUAY.lat},${LOCATIONS.JESSELTON_QUAY.lng}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-blue-500 hover:underline block leading-tight"
                >
                  Jesselton Quay, Jalan Tun Fuad Stephens
                </a>
             </div>
          </Popup>
        </Marker>

        {/* Daily Itinerary Markers */}
        {dailyMarkers.map((item, index) => {
          // Check if this is the Firefly tour (show details) or others (hide details)
          const isFireflyTour = item.name.includes('長鼻猴') || item.name.includes('螢火蟲');
          const isAccommodation = item.lat === LOCATIONS.JESSELTON_QUAY.lat && item.lng === LOCATIONS.JESSELTON_QUAY.lng;

          // Don't render generic marker on top of Accommodation marker if it's just the "Depart" item
          if (isAccommodation && !isFireflyTour) {
              return null;
          }

          return (
            <Marker 
                key={item.id} 
                position={[item.lat, item.lng]} 
                icon={customIcon}
            >
                <Tooltip permanent direction="bottom" offset={[0, 10]} className="font-sans text-xs font-bold bg-white border border-gray-200 shadow-sm px-2 py-1 rounded text-gray-700">
                {item.name}
                </Tooltip>
                <Popup>
                <div className="font-sans min-w-[150px]">
                    {isFireflyTour && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-sabah-blue text-white text-[10px] font-bold px-1.5 rounded">{item.time}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                {item.type === 'food' ? '餐飲' : 
                                item.type === 'transport' ? '交通' : 
                                item.type === 'activity' ? '行程' : '休息'}
                            </span>
                        </div>
                    )}
                    <strong className="text-sabah-dark font-serif text-sm block mb-1">{item.name}</strong>
                    <a 
                    href={item.url || `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-blue-500 hover:underline block leading-tight"
                    >
                    {item.address}
                    </a>
                </div>
                </Popup>
            </Marker>
          );
        })}

        <MapController center={defaultCenter} markers={allMarkersToFit} />
      </MapContainer>
      
      {/* Overlay Info */}
      <div className="absolute top-4 left-4 right-4 z-[400] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-[20px] shadow-soft border border-white/50 flex justify-between items-center">
             <div>
                <h3 className="font-bold text-sabah-dark text-sm font-serif">今日地圖</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  {dailyMarkers.length} 個地點 + 住宿
                </p>
             </div>
             <div className="bg-sabah-blue/10 p-2 rounded-full text-sabah-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
             </div>
          </div>
      </div>
    </div>
  );
};

export default MapComponent;