
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { Send, MapPin, MessageSquare, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

// Mock initial team messages
const generateInitialTeamMessages = (currentUsername: string): Message[] => {
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

// Mock initial AI messages
const generateInitialAIMessages = (currentUsername: string): Message[] => {
  return [
    {
      id: '1',
      sender: 'AI Assistant',
      content: 'Xin chào! Tôi là trợ lý AI của Rescue Map Hub. Tôi có thể giúp gì cho bạn?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isCurrentUser: false
    },
    {
      id: '2',
      sender: currentUsername,
      content: 'Làm thế nào để tôi có thể nhận một nhiệm vụ cứu hộ mới?',
      timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
      isCurrentUser: true
    },
    {
      id: '3',
      sender: 'AI Assistant',
      content: 'Để nhận nhiệm vụ cứu hộ mới, bạn có thể vào trang "Map", tìm các điểm cứu hộ màu đỏ (ưu tiên cao) hoặc xanh dương (ưu tiên thấp), và nhấn vào nút "Nhận" trong popup. Sau khi hoàn thành nhiệm vụ, bạn có thể nhấn "Hoàn thành" để xác nhận.',
      timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
      isCurrentUser: false
    }
  ];
};

const Chat = () => {
  const { user } = useAuth();
  const [teamMessages, setTeamMessages] = useState<Message[]>([]);
  const [aiMessages, setAIMessages] = useState<Message[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [teamNewMessage, setTeamNewMessage] = useState('');
  const [aiNewMessage, setAINewMessage] = useState('');
  const [activeChatType, setActiveChatType] = useState<'team' | 'ai'>('team');
  const teamMessagesEndRef = useRef<HTMLDivElement>(null);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize messages based on current user
  useEffect(() => {
    setTeamMessages(generateInitialTeamMessages(user.username));
    setAIMessages(generateInitialAIMessages(user.username));
  }, [user.username]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (activeChatType === 'team') {
      teamMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [teamMessages, aiMessages, activeChatType]);

  const handleSendTeamMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (teamNewMessage.trim() === '') return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: user.username,
      content: teamNewMessage,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setTeamMessages([...teamMessages, message]);
    setTeamNewMessage('');
  };

  const handleSendAIMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (aiNewMessage.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: user.username,
      content: aiNewMessage,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setAIMessages([...aiMessages, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'AI Assistant',
        content: generateAIResponse(aiNewMessage),
        timestamp: new Date(),
        isCurrentUser: false
      };
      
      setAIMessages(prevMessages => [...prevMessages, aiResponseMessage]);
    }, 1000);
    
    setAINewMessage('');
  };

  const generateAIResponse = (query: string): string => {
    // Simple mock AI responses
    const responses = [
      "Tôi hiểu câu hỏi của bạn. Đội cứu hộ nên ưu tiên an toàn của chính mình trước khi giúp đỡ người khác.",
      "Trong tình huống khẩn cấp, việc giữ bình tĩnh và đánh giá tình hình là rất quan trọng trước khi hành động.",
      "Các thao tác sơ cứu cơ bản bao gồm kiểm tra ý thức, đường thở và tuần hoàn của nạn nhân.",
      "Khi di chuyển nạn nhân, cần đảm bảo cố định cột sống và tránh làm trầm trọng thêm chấn thương.",
      "Việc liên lạc rõ ràng với các thành viên khác trong đội là yếu tố then chốt để cứu hộ thành công.",
      "Đừng quên mang theo đầy đủ thiết bị cứu hộ cần thiết khi tham gia nhiệm vụ."
    ];
    
    // Check for specific keywords
    if (query.toLowerCase().includes("cấp cứu") || query.toLowerCase().includes("sơ cứu")) {
      return "Khi thực hiện sơ cấp cứu, hãy nhớ quy tắc ABC: Airway (đường thở), Breathing (hô hấp), Circulation (tuần hoàn). Đảm bảo đường thở thông thoáng, kiểm tra nhịp thở, và kiểm tra mạch.";
    } else if (query.toLowerCase().includes("chấn thương") || query.toLowerCase().includes("gãy xương")) {
      return "Với các trường hợp chấn thương, cần cố định vùng bị thương và tránh di chuyển nạn nhân nếu không cần thiết. Sử dụng nẹp tạm thời để cố định xương gãy và gọi hỗ trợ y tế ngay lập tức.";
    } else if (query.toLowerCase().includes("bản đồ") || query.toLowerCase().includes("vị trí")) {
      return "Bạn có thể xem và cập nhật vị trí cứu hộ trên trang Map của hệ thống. Vị trí của bạn sẽ được cập nhật tự động nếu bạn cho phép truy cập vị trí trên trình duyệt.";
    }
    
    // Random response for other queries
    return responses[Math.floor(Math.random() * responses.length)];
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
          
          if (activeChatType === 'team') {
            setTeamMessages([...teamMessages, message]);
          } else {
            setAIMessages([...aiMessages, message]);
          }
          
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

      <main className="flex-1 pt-16 flex flex-col">
        {/* Chat Type Selector */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 flex justify-center items-center space-x-2 ${
              activeChatType === 'team' ? 'bg-gray-100 border-b-2 border-rescue-tertiary' : ''
            }`}
            onClick={() => setActiveChatType('team')}
          >
            <MessageSquare size={20} />
            <span>Team Chat</span>
          </button>
          <button
            className={`flex-1 py-3 px-4 flex justify-center items-center space-x-2 ${
              activeChatType === 'ai' ? 'bg-gray-100 border-b-2 border-rescue-tertiary' : ''
            }`}
            onClick={() => setActiveChatType('ai')}
          >
            <Bot size={20} />
            <span>AI Consultation</span>
          </button>
        </div>
        
        {/* Team Chat */}
        <div className={`flex-1 flex ${activeChatType === 'team' ? 'flex' : 'hidden'}`}>
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
                        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
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
          <div className="flex-1 flex flex-col h-[calc(100vh-4rem-3.5rem)]">
            {/* Mobile team members */}
            <div className="md:hidden p-3 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Team Chat</h2>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">
                    Show Members
                  </button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Team Members</SheetTitle>
                    <SheetDescription>
                      Your rescue team members
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    {teamMembers.map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {member.isOnline && (
                            <div className="absolute bottom-0 right-0">
                              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
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
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {teamMessages.map((message) => (
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
                    
                    <div className={`px-4 py-2 rounded-lg ${message.isCurrentUser ? 'bg-rescue-tertiary text-white' : 'bg-white border'}`}>
                      <p>{message.content}</p>
                    </div>
                    
                    <span className={`text-xs text-gray-500 mt-1 ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={teamMessagesEndRef} />
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSendTeamMessage} className="flex items-center space-x-2">
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
                  value={teamNewMessage}
                  onChange={(e) => setTeamNewMessage(e.target.value)}
                />
                
                <button 
                  type="submit"
                  className="p-2 text-white bg-rescue-tertiary rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={teamNewMessage.trim() === ''}
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* AI Chat */}
        <div className={`flex-1 flex flex-col h-[calc(100vh-4rem-3.5rem)] ${activeChatType === 'ai' ? 'flex' : 'hidden'}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {aiMessages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isCurrentUser && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rescue-tertiary text-white flex items-center justify-center mr-2 mt-1">
                    <Bot size={16} />
                  </div>
                )}
                
                <div className="max-w-[80%] flex flex-col">
                  {!message.isCurrentUser && (
                    <span className="text-xs text-gray-500 mb-1 ml-1">{message.sender}</span>
                  )}
                  
                  <div className={`px-4 py-2 rounded-lg ${message.isCurrentUser ? 'bg-rescue-tertiary text-white' : 'bg-white border'}`}>
                    <p>{message.content}</p>
                  </div>
                  
                  <span className={`text-xs text-gray-500 mt-1 ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={aiMessagesEndRef} />
          </div>
          
          {/* Message input */}
          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSendAIMessage} className="flex items-center space-x-2">
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
                placeholder="Ask AI for assistance..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-rescue-tertiary/50"
                value={aiNewMessage}
                onChange={(e) => setAINewMessage(e.target.value)}
              />
              
              <button 
                type="submit"
                className="p-2 text-white bg-rescue-tertiary rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={aiNewMessage.trim() === ''}
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
