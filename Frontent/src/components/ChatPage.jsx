import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { MessageCircleCode, Phone, Video, Info, Send } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { addMessage } from '@/redux/chatSlice';
import { API_BASE_URL } from '@/lib/api';
import { Link } from 'react-router-dom';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        if (!textMessage.trim()) return;
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/message/send/${receiverId}`, { textMessage: textMessage.trim() }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(addMessage(res.data.newMessage));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => { dispatch(setSelectedUser(null)); }
    }, [dispatch]);

    return (
        <div className='flex h-screen bg-white'>
            {/* Left Panel — User List */}
            <div className='w-[350px] border-r border-gray-200 flex flex-col'>
                {/* Header */}
                <div className='px-6 py-4 border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-semibold text-base'>{user?.username}</h2>
                        <button className='text-gray-500 hover:text-black'>
                            <MessageCircleCode size={20} />
                        </button>
                    </div>
                    <p className='text-sm font-semibold mt-3 mb-1'>Messages</p>
                </div>

                {/* User List */}
                <div className='flex-1 overflow-y-auto'>
                    {suggestedUsers.length === 0 ? (
                        <p className='text-sm text-gray-400 text-center mt-10'>No users found</p>
                    ) : (
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            const isSelected = selectedUser?._id === suggestedUser._id;
                            return (
                                <div
                                    key={suggestedUser._id}
                                    onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-50' : ''}`}
                                >
                                    {/* Avatar with online dot */}
                                    <div className='relative shrink-0'>
                                        <Avatar className='w-12 h-12'>
                                            <AvatarImage src={suggestedUser?.profilePicture} />
                                            <AvatarFallback className='text-sm'>{suggestedUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        {isOnline && (
                                            <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full' />
                                        )}
                                    </div>
                                    <div className='flex flex-col min-w-0'>
                                        <span className='text-sm font-semibold truncate'>{suggestedUser?.username}</span>
                                        <span className={`text-xs truncate ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                                            {isOnline ? 'Active now' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Panel — Chat */}
            {selectedUser ? (
                <div className='flex-1 flex flex-col'>
                    {/* Chat Header */}
                    <div className='flex items-center justify-between px-6 py-3 border-b border-gray-200'>
                        <div className='flex items-center gap-3'>
                            <div className='relative'>
                                <Avatar className='w-10 h-10'>
                                    <AvatarImage src={selectedUser?.profilePicture} />
                                    <AvatarFallback>{selectedUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {onlineUsers.includes(selectedUser._id) && (
                                    <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full' />
                                )}
                            </div>
                            <div>
                                <Link to={`/profile/${selectedUser?._id}`} className='text-sm font-semibold hover:text-gray-600'>
                                    {selectedUser?.username}
                                </Link>
                                <p className='text-xs text-gray-400'>
                                    {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 text-gray-700'>
                            <button className='hover:text-black'><Phone size={22} /></button>
                            <button className='hover:text-black'><Video size={22} /></button>
                            <button className='hover:text-black'><Info size={22} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <Messages selectedUser={selectedUser} />

                    {/* Input */}
                    <div className='px-4 py-3 border-t border-gray-200'>
                        <div className='flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2'>
                            <input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') sendMessageHandler(selectedUser?._id); }}
                                type="text"
                                placeholder="Message..."
                                className='flex-1 bg-transparent outline-none text-sm placeholder-gray-400'
                            />
                            {textMessage.trim() ? (
                                <button
                                    onClick={() => sendMessageHandler(selectedUser?._id)}
                                    className='text-[#0095f6] font-semibold text-sm hover:text-[#1877f2]'
                                >
                                    Send
                                </button>
                            ) : (
                                <button className='text-gray-400 hover:text-gray-600'>
                                    <Send size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex-1 flex flex-col items-center justify-center gap-3'>
                    <div className='w-20 h-20 rounded-full border-2 border-black flex items-center justify-center'>
                        <MessageCircleCode size={36} />
                    </div>
                    <h2 className='text-xl font-light'>Your messages</h2>
                    <p className='text-sm text-gray-500'>Send a message to start a chat.</p>
                    <button
                        onClick={() => suggestedUsers[0] && dispatch(setSelectedUser(suggestedUsers[0]))}
                        className='mt-2 bg-[#0095f6] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1877f2]'
                    >
                        Send message
                    </button>
                </div>
            )}
        </div>
    )
}

export default ChatPage
