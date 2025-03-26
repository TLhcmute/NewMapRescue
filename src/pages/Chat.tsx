
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { Send, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

// Mock data for team members
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Nguyen Cuu Ho',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isOnline: true
  },
  {
    id: '2',
    name: 'Tran Y Te',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isOnline: true
  },
  {
    id: '3',
    name: 'Le Van An',
    avatar: 'https://randomuser.me/api/portraits/men/59.jpg',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: '4',
    name: 'Pham Thu Y',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    isOnline: true
  },
  {
    id: '5',
    name: 'Hoang Minh',
    avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  }
];

// Mock initial messages
const generateInitialMessages = (currentUsername: string): Message[] => {
  return [
    {
      id: '1',
      sender: 'Nguyen Cuu Ho',
      content: 'Team, I have a new rescue mission at District 1. Anyone available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isCurrentUser: 'Nguyen Cuu Ho' === currentUsername
    },
    {
      id: '2',
      sender: 'Tran Y Te',
      content: 'I can be there in 15 minutes. What\'s the priority level?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      isCurrentUser: 'Tran Y Te' === currentUsername
    },
    {
      id: '3',
      sender: 'Nguyen Cuu Ho',
      content: 'High priority. Elderly person with possible injuries.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      isCurrentUser: 'Nguyen Cuu Ho' === currentUsername
    },
    {
      id: '4',
      sender: 'Pham Thu Y',
      content: 'I\'ll bring medical supplies. Estimated arrival: 20 minutes.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isCurrentUser: 'Pham Thu Y' === currentUsername
    },
    {
      id: '5',
      sender: 'Nguyen Cuu Ho',
      content: 'Perfect. I\'m sending the exact coordinates to your map now.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      isCurrentUser: 'Nguyen Cuu Ho' === currentUsername
    }
  ];
};

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileMembers, setShowMobileMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize messages based on current user
  useEffect(() => {
    setMessages(generateInitialMessages(user.username));
  }, [user.username]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: user.username,
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationMessage = `My current location: ${position.coords.latitude}, ${position.coords.longitude}`;
          
          const message: Message = {
            id: Date.now().toString(),
            sender: user.username,
            content: locationMessage,
            timestamp: new Date(),
            isCurrentUser: true
          };
          
          setMessages([...messages, message]);
          toast.success('Location shared successfully');
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not share your location. Please check your permissions.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return 'Offline';
    
    const minutesAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    
    if (minutesAgo < 1) return 'Just now';
    if (minutesAgo === 1) return '1 minute ago';
    if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
    
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo === 1) return '1 hour ago';
    if (hoursAgo < 24) return `${hoursAgo} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16 flex">
        {/* Team members sidebar (desktop) */}
        <div className="hidden md:block w-80 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Team Members</h2>
          </div>
          
          <div className="space-y-1 p-2">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {member.isOnline && (
                    <div className="absolute bottom-0 right-0">
                      <div className="online-indicator"></div>
                    </div>
                  )}
                </div>
                
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-xs text-gray-500">
                    {member.isOnline ? 'Online' : formatLastSeen(member.lastSeen)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
          {/* Mobile team members toggle button */}
          <div className="md:hidden p-3 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Team Chat</h2>
            <button 
              className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium"
              onClick={() => setShowMobileMembers(!showMobileMembers)}
            >
              {showMobileMembers ? 'Hide Members' : 'Show Members'}
            </button>
          </div>
          
          {/* Mobile team members */}
          {showMobileMembers && (
            <div className="md:hidden p-2 border-b overflow-x-auto">
              <div className="flex space-x-3 px-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex flex-col items-center">
                    <div className="relative">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {member.isOnline && (
                        <div className="absolute bottom-0 right-0">
                          <div className="online-indicator"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs mt-1 max-w-[60px] truncate">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isCurrentUser && (
                  <img 
                    src={teamMembers.find(m => m.name === message.sender)?.avatar || 'https://via.placeholder.com/40'} 
                    alt={message.sender}
                    className="w-8 h-8 rounded-full object-cover mr-2 mt-1"
                  />
                )}
                
                <div className="max-w-[80%] flex flex-col">
                  {!message.isCurrentUser && (
                    <span className="text-xs text-gray-500 mb-1 ml-1">{message.sender}</span>
                  )}
                  
                  <div className={message.isCurrentUser ? 'message-self' : 'message-other'}>
                    <p>{message.content}</p>
                  </div>
                  
                  <span className={`text-xs text-gray-500 mt-1 ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input */}
          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <button 
                type="button"
                className="p-2 text-gray-500 hover:text-rescue-tertiary transition-colors"
                onClick={handleShareLocation}
                aria-label="Share location"
              >
                <MapPin size={20} />
              </button>
              
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-rescue-tertiary/50"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              
              <button 
                type="submit"
                className="p-2 text-white bg-rescue-tertiary rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={newMessage.trim() === ''}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
