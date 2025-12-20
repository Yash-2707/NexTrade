import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api/axios';
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Image as ImageIcon, 
  Smile, 
  ChevronLeft 
} from "lucide-react";

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef();

  // State
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);

  // 1. Initialize User
  useEffect(() => {
    const getUser = () => {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        // Normalize ID
        return { ...parsed, _id: parsed._id || parsed.id };
      } catch (e) {
        return null;
      }
    };
    setUser(getUser());
  }, []);

  // 2. Fetch Conversations
  useEffect(() => {
    const getConversations = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/chat/conversation/${user._id}`);
        setConversations(res.data);
      } catch (err) {
        console.error("Fetch Conversations Error:", err);
      }
    };
    getConversations();
  }, [user]);

  // 3. Handle Chat Selection (via URL or Click)
  useEffect(() => {
    if (chatId && conversations.length > 0) {
      const targetChat = conversations.find(c => c._id === chatId);
      if (targetChat) setCurrentChat(targetChat);
    }
  }, [chatId, conversations]);

  // 4. Fetch Messages
  useEffect(() => {
    if (!currentChat) return;
    const getMessages = async () => {
      try {
        const res = await api.get(`/chat/message/${currentChat._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch Messages Error:", err);
      }
    };
    getMessages();
  }, [currentChat]);

  // 5. Auto-Scroll to Bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 6. Send Message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !currentChat) return;

    const messagePayload = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const res = await api.post("/chat/message", messagePayload);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  // Helper: Format Time
  const formatTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper: Get Friend Info
  const getFriend = (conversation) => {
    return conversation.members.find((m) => m._id !== user?._id) || {};
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-8 px-4 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex h-[85vh]">
        
        {/* ====================
            SIDEBAR (Chat List)
           ==================== */}
        <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${currentChat ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No conversations yet.
              </div>
            ) : (
              conversations.map((c) => {
                const friend = getFriend(c);
                const isActive = currentChat?._id === c._id;

                return (
                  <div
                    key={c._id}
                    onClick={() => { setCurrentChat(c); navigate(`/chat/${c._id}`); }}
                    className={`flex items-center gap-4 p-4 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                      isActive ? "bg-blue-50/60" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={friend?.profilePic || friend?.image || "https://ui-avatars.com/api/?background=random"}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      {/* Online Indicator Mockup */}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={`font-semibold truncate ${isActive ? "text-blue-700" : "text-slate-800"}`}>
                          {friend?.name || "Unknown User"}
                        </h4>
                        <span className="text-[10px] text-slate-400">12:30 PM</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        Click to view conversation
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ====================
            CHAT AREA
           ==================== */}
        <div className={`flex-1 flex flex-col bg-slate-50 ${!currentChat ? 'hidden md:flex' : 'flex'}`}>
          
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setCurrentChat(null)} className="md:hidden text-slate-500 hover:text-slate-700">
                    <ChevronLeft size={24} />
                  </button>
                  
                  <img
                    src={getFriend(currentChat)?.profilePic || "https://ui-avatars.com/api/?background=random"}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-slate-800">{getFriend(currentChat)?.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-slate-500">Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-400">
                  <button className="hover:text-blue-600 transition-colors"><Phone size={20} /></button>
                  <button className="hover:text-blue-600 transition-colors"><Video size={20} /></button>
                  <button className="hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
                </div>
              </div>

              {/* Messages Area */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              >
                {messages.map((m, index) => {
                  const isMe = m.sender === user?._id;
                  return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm relative group ${
                        isMe 
                          ? "bg-blue-600 text-white rounded-br-none" 
                          : "bg-white text-slate-800 rounded-bl-none border border-gray-100"
                      }`}>
                        <p>{m.text}</p>
                        <span className={`text-[10px] block text-right mt-1 opacity-70 ${isMe ? "text-blue-100" : "text-slate-400"}`}>
                          {formatTime(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef}></div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Smile size={24} />
                  </button>
                  <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <ImageIcon size={24} />
                  </button>
                  
                  <input
                    className="flex-1 bg-gray-100 text-slate-800 placeholder-slate-500 border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-full py-3 px-4 outline-none transition-all"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-full shadow-md transition-all transform ${
                      newMessage.trim() 
                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105" 
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Send size={20} className={newMessage.trim() ? "ml-0.5" : ""} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Send size={40} className="text-slate-300 ml-2" />
              </div>
              <h3 className="text-lg font-bold text-slate-600">Your Messages</h3>
              <p className="text-slate-400 text-sm">Select a chat to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatPage;