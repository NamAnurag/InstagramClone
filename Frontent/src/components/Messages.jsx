import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1'>
            {/* Profile header in chat */}
            <div className='flex flex-col items-center gap-2 mb-6 mt-2'>
                <Avatar className='w-20 h-20'>
                    <AvatarImage src={selectedUser?.profilePicture} />
                    <AvatarFallback className='text-2xl'>{selectedUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className='font-semibold text-base'>{selectedUser?.username}</p>
                <Link to={`/profile/${selectedUser?._id}`}>
                    <button className='text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg transition-colors'>
                        View profile
                    </button>
                </Link>
            </div>

            {/* Messages */}
            {messages && messages.map((msg, idx) => {
                const isMine = msg.senderId === user?._id;
                const isLast = idx === messages.length - 1;
                const nextMsg = messages[idx + 1];
                const showAvatar = !isMine && (!nextMsg || nextMsg.senderId !== msg.senderId);

                return (
                    <div key={msg._id} className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                        {/* Avatar for received messages */}
                        {!isMine && (
                            <div className='w-6 shrink-0'>
                                {showAvatar && (
                                    <Avatar className='w-6 h-6'>
                                        <AvatarImage src={selectedUser?.profilePicture} />
                                        <AvatarFallback className='text-[10px]'>{selectedUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        )}
                        <div
                            className={`max-w-[60%] px-3 py-2 rounded-2xl text-sm break-words
                                ${isMine
                                    ? 'bg-[#0095f6] text-white rounded-br-sm'
                                    : 'bg-gray-100 text-black rounded-bl-sm'
                                }`}
                        >
                            {msg.message}
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    )
}

export default Messages
