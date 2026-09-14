import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { API_BASE_URL } from '@/lib/api'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const { messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    // Count unread messages (all messages not sent by me)
    const unreadMessages = messages?.filter(m => m.senderId !== user?._id).length || 0;

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/v1/user/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') logoutHandler();
        else if (textType === 'Create') setOpen(true);
        else if (textType === 'Profile') navigate(`/profile/${user?._id}`);
        else if (textType === 'Home') navigate('/');
        else if (textType === 'Messages') navigate('/chat');
    }

    const sidebarItems = [
        { icon: <Home size={24} />, text: 'Home', path: '/' },
        { icon: <Search size={24} />, text: 'Search' },
        { icon: <TrendingUp size={24} />, text: 'Explore' },
        { icon: <MessageCircle size={24} />, text: 'Messages', path: '/chat', badge: unreadMessages },
        { icon: <Heart size={24} />, text: 'Notifications', badge: likeNotification.length },
        { icon: <PlusSquare size={24} />, text: 'Create' },
        {
            icon: (
                <Avatar className='w-6 h-6 ring-2 ring-transparent group-hover:ring-black transition-all'>
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback className='text-xs'>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
            ),
            text: 'Profile',
            path: `/profile/${user?._id}`
        },
        { icon: <LogOut size={24} />, text: 'Logout' },
    ];

    return (
        <div className='fixed top-0 left-0 z-20 h-screen w-[240px] bg-white border-r border-gray-200 flex flex-col px-3 py-4'>

            {/* Logo */}
            <div className='px-3 mb-6 mt-2'>
                <h1 style={{ fontFamily: "'Grand Hotel', cursive" }} className='text-3xl text-black select-none'>
                    Instagram
                </h1>
            </div>

            {/* Nav Items */}
            <div className='flex flex-col gap-1 flex-1'>
                {sidebarItems.map((item, index) => {
                    const isActive = item.path && location.pathname === item.path;

                    if (item.text === 'Notifications') {
                        return (
                            <Popover key={index}>
                                <PopoverTrigger asChild>
                                    <div className={`group flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all hover:bg-gray-100 ${isActive ? 'font-bold' : ''}`}>
                                        <div className='relative'>
                                            {item.icon}
                                            {likeNotification.length > 0 && (
                                                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                                                    {likeNotification.length > 9 ? '9+' : likeNotification.length}
                                                </span>
                                            )}
                                        </div>
                                        <span className='text-sm font-medium'>{item.text}</span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent side='right' className='w-80 p-0 rounded-2xl shadow-xl border border-gray-200'>
                                    <div className='p-4 border-b border-gray-100'>
                                        <h3 className='font-semibold text-sm'>Notifications</h3>
                                    </div>
                                    <div className='max-h-80 overflow-y-auto'>
                                        {likeNotification.length === 0 ? (
                                            <p className='text-sm text-gray-500 text-center py-8'>No new notifications</p>
                                        ) : (
                                            likeNotification.map((notification) => (
                                                <div key={notification.userId} className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50'>
                                                    <Avatar className='w-10 h-10'>
                                                        <AvatarImage src={notification.userDetails?.profilePicture} />
                                                        <AvatarFallback>{notification.userDetails?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <p className='text-sm flex-1'>
                                                        <span className='font-semibold'>{notification.userDetails?.username}</span>
                                                        <span className='text-gray-600'> liked your post</span>
                                                    </p>
                                                    <Heart size={16} className='text-red-500 fill-red-500' />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        );
                    }

                    return (
                        <div
                            key={index}
                            onClick={() => sidebarHandler(item.text)}
                            className={`group flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all hover:bg-gray-100 ${isActive ? 'font-bold' : ''}`}
                        >
                            <div className='relative'>
                                {item.icon}
                                {item.badge > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.text}</span>
                        </div>
                    );
                })}
            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
}

export default LeftSidebar
