
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, Navigation, ArrowRight, ArrowLeft, MapPin, Search, Check, MessageCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import AcceptedRescues from '../components/AcceptedRescues';

// Fix for leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const rescuerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const highPriorityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const lowPriorityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom icon for accepted locations
const acceptedHighPriorityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const acceptedLowPriorityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Person {
  id: string;
  name: string;
  phone: string;
  location: [number, number];
  status: 'Waiting' | 'In Progress' | 'Rescued' | 'Accepted';
  priority: 'high' | 'low';
  image?: string;
  message?: string;
  address?: string;
}

// Mock data for people needing rescue
const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Nguyen Van A',
    phone: '0901234567',
    location: [10.7769, 106.7009], // Ho Chi Minh City
    status: 'Waiting',
    priority: 'high',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    message: 'Nhà tôi đang bị ngập nước, cần hỗ trợ khẩn cấp',
    address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM'
  },
  {
    id: '2',
    name: 'Tran Thi B',
    phone: '0901234568',
    location: [10.7859, 106.6960], // Near Ho Chi Minh City
    status: 'Waiting',
    priority: 'high',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    message: 'Cần giúp di chuyển người già và trẻ em',
    address: '45 Lê Lợi, Quận 1, TP.HCM'
  },
  {
    id: '3',
    name: 'Le Van C',
    phone: '0901234569',
    location: [10.7740, 106.7050], // Near Ho Chi Minh City
    status: 'Waiting',
    priority: 'low',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    message: 'Cần hỗ trợ lương thực và nước uống',
    address: '78 Võ Văn Tần, Quận 3, TP.HCM'
  },
  {
    id: '4',
    name: 'Pham Thi D',
    phone: '0901234570',
    location: [10.7800, 106.6950], // Near Ho Chi Minh City
    status: 'In Progress',
    priority: 'low',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    message: 'Cần hỗ trợ y tế, có người bị thương',
    address: '120 Hai Bà Trưng, Quận 1, TP.HCM'
  },
  {
    id: '5',
    name: 'Hoang Van E',
    phone: '0901234571',
    location: [10.7730, 106.7100], // Near Ho Chi Minh City
    status: 'Waiting',
    priority: 'high',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
    message: 'Nhà có trẻ nhỏ, nước đang dâng cao',
    address: '55 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM'
  }
];

// Recenter map component
const RecenterAutomatically = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

// Custom marker with badge component
const MarkerWithBadge = ({ person, onClick }: { person: Person, onClick: () => void }) => {
  const icon = person.priority === 'high' 
    ? (person.status === 'Accepted' ? acceptedHighPriorityIcon : highPriorityIcon)
    : (person.status === 'Accepted' ? acceptedLowPriorityIcon : lowPriorityIcon);
  
  return (
    <Marker 
      position={person.location} 
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    >
      {person.status === 'Accepted' && (
        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg">
          <CheckCircle2 size={16} className="text-white" />
        </div>
      )}
    </Marker>
  );
};

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([10.7769, 106.7009]); // Default to Ho Chi Minh City
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptedRescues, setAcceptedRescues] = useState<Person[]>([]);
  const [showAcceptedRescues, setShowAcceptedRescues] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your current location. Using default location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser. Using default location.");
    }
  }, []);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    if (mapRef.current) {
      mapRef.current.setView(person.location, 15);
    }
  };

  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    // This is a simple implementation of the Haversine formula
    const R = 6371; // Radius of the Earth in km
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(2));
  };

  const getDirections = (to: [number, number]) => {
    // In a real application, you would use a routing API like OSRM or Mapbox
    // For demonstration, we'll draw a straight line between points
    setRoutePoints([currentLocation, to]);
    toast.success("Directions calculated. Follow the blue line on the map.");
  };

  // Handler for accepting a rescue request
  const handleAcceptRescue = (personId: string) => {
    setPeople(prevPeople => {
      const updatedPeople = prevPeople.map(person => 
        person.id === personId 
          ? { ...person, status: 'Accepted' as const } 
          : person
      );
      
      // Find the accepted person and add to acceptedRescues
      const acceptedPerson = updatedPeople.find(p => p.id === personId);
      if (acceptedPerson) {
        setAcceptedRescues(prev => [...prev, acceptedPerson]);
      }
      
      return updatedPeople;
    });
    
    toast.success("Bạn đã nhận yêu cầu cứu hộ này!");
  };

  // Handler for completing a rescue
  const handleCompleteRescue = (personId: string) => {
    // Remove from main people list
    setPeople(prevPeople => 
      prevPeople.filter(person => person.id !== personId)
    );
    
    // Also remove from accepted rescues list
    setAcceptedRescues(prev => 
      prev.filter(person => person.id !== personId)
    );
    
    toast.success("Cứu hộ đã hoàn thành thành công!");
    
    // Close popup if needed
    if (mapRef.current) {
      mapRef.current.closePopup();
    }
  };

  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.phone.includes(searchQuery)
  );

  const callPerson = (phone: string) => {
    // In a real application, this would initiate a call
    toast.info(`Calling ${phone}...`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16 flex flex-col">
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Map Container */}
          <div className="flex-1 relative">
            <MapContainer 
              center={currentLocation} 
              zoom={13} 
              className="h-[calc(100vh-4rem)]"
              whenReady={(map) => { mapRef.current = map.target; }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <RecenterAutomatically position={currentLocation} />
              
              {/* Current rescuer location */}
              <Marker position={currentLocation} icon={rescuerIcon}>
                <Popup>
                  <div className="p-1">
                    <strong>Your Location</strong>
                    <p className="text-xs text-gray-500">{currentLocation[0]}, {currentLocation[1]}</p>
                  </div>
                </Popup>
              </Marker>
              
              {/* People markers */}
              {people.map((person) => (
                <div key={person.id}>
                  <Marker 
                    position={person.location} 
                    icon={person.priority === 'high' ? highPriorityIcon : lowPriorityIcon}
                    eventHandlers={{
                      click: () => {
                        setSelectedPerson(person);
                      }
                    }}
                  >
                    {/* Accepted badge overlay */}
                    {person.status === 'Accepted' && (
                      <div className="relative">
                        <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-50 shadow-lg">
                          <Check size={14} />
                        </div>
                      </div>
                    )}
                    <Popup>
                      <div className="p-2 min-w-[250px]">
                        {person.image && (
                          <div className="mb-2 overflow-hidden rounded-md">
                            <img 
                              src={person.image} 
                              alt={person.name} 
                              className="w-full h-28 object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        )}
                        
                        <h3 className="text-lg font-semibold mb-1">{person.name}</h3>
                        
                        <div className="flex items-center text-sm mb-1">
                          <span className="text-gray-500 mr-1">Phone:</span>
                          <span>{person.phone}</span>
                          <button 
                            className="ml-auto p-1.5 bg-rescue-tertiary/10 text-rescue-tertiary rounded-full hover:bg-rescue-tertiary/20 transition-colors"
                            onClick={() => callPerson(person.phone)}
                          >
                            <Phone size={14} />
                          </button>
                        </div>
                        
                        {person.address && (
                          <div className="flex items-start text-sm mb-1">
                            <span className="text-gray-500 mr-1">Địa chỉ:</span>
                            <span className="flex-1">{person.address}</span>
                          </div>
                        )}
                        
                        {person.message && (
                          <div className="flex items-start text-sm mb-1">
                            <span className="text-gray-500 mr-1 flex items-center">
                              <MessageCircle size={12} className="mr-1" />
                            </span>
                            <span className="flex-1 italic bg-gray-50 p-1 rounded text-gray-600">
                              "{person.message}"
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm mb-1">
                          <span className="text-gray-500 mr-1">Status:</span>
                          <span className={`py-0.5 px-2 rounded-full text-xs ${
                            person.status === 'Waiting' 
                              ? 'bg-rescue-warning/10 text-rescue-warning' 
                              : person.status === 'In Progress' || person.status === 'Accepted'
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-green-100 text-green-600'
                          }`}>
                            {person.status}
                            {person.status === 'Accepted' && (
                              <Check size={12} className="inline ml-1" />
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm mb-1">
                          <span className="text-gray-500 mr-1">Priority:</span>
                          <span className={`py-0.5 px-2 rounded-full text-xs ${
                            person.priority === 'high' 
                              ? 'bg-rescue-primary/10 text-rescue-primary' 
                              : 'bg-rescue-tertiary/10 text-rescue-tertiary'
                          }`}>
                            {person.priority === 'high' ? 'High' : 'Low'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm mb-2">
                          <span className="text-gray-500 mr-1">Distance:</span>
                          <span>{calculateDistance(currentLocation, person.location)} km</span>
                        </div>
                        
                        {person.status === 'Waiting' ? (
                          <button 
                            className="w-full py-2 px-3 bg-green-500 text-white rounded-md flex items-center justify-center space-x-1 text-sm hover:bg-green-600 transition-colors"
                            onClick={() => handleAcceptRescue(person.id)}
                          >
                            <Navigation size={14} className="mr-1" />
                            <span>Nhận</span>
                          </button>
                        ) : person.status === 'Accepted' ? (
                          <button 
                            className="w-full py-2 px-3 bg-blue-500 text-white rounded-md flex items-center justify-center space-x-1 text-sm hover:bg-blue-600 transition-colors"
                            onClick={() => handleCompleteRescue(person.id)}
                          >
                            <Check size={14} className="mr-1" />
                            <span>Hoàn thành</span>
                          </button>
                        ) : (
                          <button 
                            className="w-full py-2 px-3 bg-rescue-secondary text-white rounded-md flex items-center justify-center space-x-1 text-sm hover:bg-opacity-90 transition-colors"
                            onClick={() => getDirections(person.location)}
                          >
                            <Navigation size={14} className="mr-1" />
                            <span>Get Directions</span>
                          </button>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                  
                  {/* Accepted mark overlay */}
                  {person.status === 'Accepted' && (
                    <div className="relative" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transform: `translate(${person.location[1]}px, ${person.location[0]}px)`
                    }}>
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 z-[1000]">
                        <Check size={16} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Route line */}
              {routePoints.length === 2 && (
                <Polyline 
                  positions={routePoints} 
                  color="#1976D2" 
                  weight={4} 
                  opacity={0.7} 
                  dashArray="10, 10" 
                />
              )}
            </MapContainer>
            
            {/* Sidebar toggle button */}
            <button 
              className="absolute bottom-24 right-4 z-[999] p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            </button>

            {/* Accepted rescues toggle button */}
            <button 
              className="absolute bottom-6 right-4 z-[999] p-3 rounded-full bg-green-500 text-white shadow-md hover:shadow-lg transition-all"
              onClick={() => setShowAcceptedRescues(!showAcceptedRescues)}
            >
              <Check size={20} />
            </button>
          </div>
          
          {/* Sidebar for people list */}
          <div 
            className={`bg-white border-l overflow-hidden transition-all duration-300 ${
              showSidebar ? 'w-full md:w-96 opacity-100' : 'w-0 opacity-0'
            }`}
          >
            {showSidebar && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold mb-4">People Needing Help</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or phone..."
                      className="w-full px-3 py-2 pr-10 border rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto fade-mask">
                  {filteredPeople.length > 0 ? (
                    <div className="space-y-2 p-2">
                      {filteredPeople.map((person) => (
                        <div 
                          key={person.id}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedPerson?.id === person.id 
                              ? 'bg-gray-100 border-gray-300 shadow-sm' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handlePersonSelect(person)}
                        >
                          <div className="flex items-center">
                            <div className={`w-2 h-8 rounded-full mr-3 ${
                              person.priority === 'high' ? 'bg-rescue-primary' : 'bg-rescue-tertiary'
                            }`}></div>
                            
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <h3 className="font-medium">{person.name}</h3>
                                <span className={`ml-auto text-xs py-0.5 px-2 rounded-full flex items-center ${
                                  person.status === 'Waiting' 
                                    ? 'bg-rescue-warning/10 text-rescue-warning' 
                                    : person.status === 'In Progress' || person.status === 'Accepted'
                                      ? 'bg-blue-100 text-blue-600' 
                                      : 'bg-green-100 text-green-600'
                                }`}>
                                  {person.status}
                                  {person.status === 'Accepted' && (
                                    <CheckCircle2 size={12} className="ml-1" />
                                  )}
                                </span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-2">{person.phone}</span>
                                <span className="ml-auto">{calculateDistance(currentLocation, person.location)} km</span>
                              </div>
                              
                              {person.address && (
                                <div className="text-xs text-gray-500 truncate mt-1">
                                  {person.address}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                      <MapPin size={24} className="mb-2" />
                      <p>No people found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal for accepted rescues */}
        {showAcceptedRescues && (
          <AcceptedRescues 
            acceptedRescues={acceptedRescues} 
            onClose={() => setShowAcceptedRescues(false)}
            onComplete={handleCompleteRescue}
            onSelect={handlePersonSelect}
            calculateDistance={(location) => calculateDistance(currentLocation, location)}
          />
        )}
      </main>
    </div>
  );
};

export default Map;
