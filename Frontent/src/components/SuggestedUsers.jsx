import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api';
import { setAuthUser } from '@/redux/authSlice';

const SuggestedUsers = () => {
    const { suggestedUsers, user: authUser } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const followUserHandler = async (userId) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/v1/user/followorunfollow/${userId}`,
                {},
                { withCredentials: true }
            );
            if (res.data.success) {
                const alreadyFollowing = authUser?.following?.some(id => id.toString() === userId.toString());
                const following = alreadyFollowing
                    ? authUser.following.filter(id => id.toString() !== userId.toString())
                    : [...(authUser?.following || []), userId];
                dispatch(setAuthUser({ ...authUser, following }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to follow user");
        }
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-3'>
                <span className='text-sm font-semibold text-gray-500'>Suggested for you</span>
                <Link to="#" className='text-xs font-semibold hover:text-gray-400'>See All</Link>
            </div>
            {suggestedUsers.slice(0, 5).map((user) => {
                const isFollowing = authUser?.following?.some(id => id.toString() === user._id.toString());
                return (
                    <div key={user._id} className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-2'>
                            <Link to={`/profile/${user?._id}`}>
                                <Avatar className='w-8 h-8'>
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback className='text-xs'>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className='flex flex-col'>
                                <Link to={`/profile/${user?._id}`} className='text-sm font-semibold hover:text-gray-600 leading-tight'>
                                    {user?.username}
                                </Link>
                                <span className='text-xs text-gray-400 truncate max-w-[130px]'>
                                    {user?.bio || 'Suggested for you'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => followUserHandler(user._id)}
                            className={`text-xs font-semibold cursor-pointer transition-colors ${isFollowing ? 'text-gray-500 hover:text-gray-700' : 'text-[#0095f6] hover:text-[#1877f2]'}`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>
                );
            })}
        </div>
    )
}

export default SuggestedUsers
