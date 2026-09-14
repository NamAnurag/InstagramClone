import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AtSign, Grid3X3, Bookmark, Film, Tag, Heart, MessageCircle, Settings } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api';
import { setAuthUser, setUserProfile } from '@/redux/authSlice';
import { setSelectedPost } from '@/redux/postSlice';
import CommentDialog from './CommentDialog';

const Profile = () => {
    const params = useParams();
    const userId = params.id;
    useGetUserProfile(userId);

    const [activeTab, setActiveTab] = useState('posts');
    const [selectedPostForModal, setSelectedPostForModal] = useState(null);
    const [commentOpen, setCommentOpen] = useState(false);

    const { userProfile, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedInUserProfile = user?._id === userProfile?._id;
    const isFollowing = user?.following?.some(id => id.toString() === userProfile?._id?.toString());

    const displayedPosts = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

    const followOrUnfollowHandler = async () => {
        if (!userProfile?._id) return;
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/v1/user/followorunfollow/${userProfile._id}`,
                {},
                { withCredentials: true }
            );
            if (res.data.success) {
                const profileId = userProfile._id.toString();
                const myId = user._id.toString();
                const updatedFollowing = isFollowing
                    ? user.following.filter(id => id.toString() !== profileId)
                    : [...(user.following || []), profileId];
                const updatedFollowers = isFollowing
                    ? userProfile.followers.filter(id => id.toString() !== myId)
                    : [...(userProfile.followers || []), myId];
                dispatch(setAuthUser({ ...user, following: updatedFollowing }));
                dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update follow status");
        }
    }

    const openPostModal = (post) => {
        setSelectedPostForModal(post);
        dispatch(setSelectedPost(post));
        setCommentOpen(true);
    }

    if (!userProfile) {
        return (
            <div className='flex flex-col max-w-4xl mx-auto px-4 pt-10 animate-pulse'>
                <div className='flex items-center gap-10 mb-10'>
                    <div className='w-36 h-36 rounded-full bg-gray-200' />
                    <div className='flex flex-col gap-4 flex-1'>
                        <div className='h-5 bg-gray-200 rounded w-40' />
                        <div className='flex gap-6'>
                            <div className='h-4 bg-gray-200 rounded w-20' />
                            <div className='h-4 bg-gray-200 rounded w-20' />
                            <div className='h-4 bg-gray-200 rounded w-20' />
                        </div>
                        <div className='h-4 bg-gray-200 rounded w-60' />
                    </div>
                </div>
                <div className='grid grid-cols-3 gap-1'>
                    {[...Array(9)].map((_, i) => <div key={i} className='aspect-square bg-gray-200 rounded' />)}
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col max-w-4xl mx-auto px-4 pt-8 pb-10'>

            {/* ── Top Section ── */}
            <div className='flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 mb-10'>

                {/* Avatar */}
                <div className='shrink-0'>
                    <div className='p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'>
                        <div className='p-[3px] bg-white rounded-full'>
                            <Avatar className='w-32 h-32 md:w-36 md:h-36'>
                                <AvatarImage src={userProfile?.profilePicture} alt="profile" />
                                <AvatarFallback className='text-4xl font-light'>
                                    {userProfile?.username?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className='flex flex-col gap-4 flex-1 w-full'>

                    {/* Username + Buttons row */}
                    <div className='flex flex-wrap items-center gap-3'>
                        <h2 className='text-xl font-light'>{userProfile?.username}</h2>

                        {isLoggedInUserProfile ? (
                            <>
                                <Link to="/account/edit">
                                    <button className='text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg transition-colors'>
                                        Edit profile
                                    </button>
                                </Link>
                                <button className='text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg transition-colors'>
                                    View archive
                                </button>
                                <button className='text-gray-700 hover:text-black'>
                                    <Settings size={22} />
                                </button>
                            </>
                        ) : (
                            <>
                                {isFollowing ? (
                                    <>
                                        <button
                                            onClick={followOrUnfollowHandler}
                                            className='text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg transition-colors'
                                        >
                                            Following ▾
                                        </button>
                                        <button
                                            onClick={() => navigate('/chat')}
                                            className='text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg transition-colors'
                                        >
                                            Message
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={followOrUnfollowHandler}
                                        className='text-sm font-semibold bg-[#0095f6] hover:bg-[#1877f2] text-white px-4 py-1.5 rounded-lg transition-colors'
                                    >
                                        Follow
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div className='flex gap-8'>
                        <div className='text-sm text-center md:text-left'>
                            <span className='font-semibold'>{userProfile?.posts?.length ?? 0}</span>
                            <span className='text-gray-600 ml-1'>posts</span>
                        </div>
                        <div className='text-sm text-center md:text-left cursor-pointer hover:opacity-70'>
                            <span className='font-semibold'>{userProfile?.followers?.length ?? 0}</span>
                            <span className='text-gray-600 ml-1'>followers</span>
                        </div>
                        <div className='text-sm text-center md:text-left cursor-pointer hover:opacity-70'>
                            <span className='font-semibold'>{userProfile?.following?.length ?? 0}</span>
                            <span className='text-gray-600 ml-1'>following</span>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-semibold'>{userProfile?.username}</p>
                        {userProfile?.bio && (
                            <p className='text-sm whitespace-pre-wrap'>{userProfile.bio}</p>
                        )}
                        <div className='flex items-center gap-1 text-sm text-[#00376b]'>
                            <AtSign size={13} />
                            <span>{userProfile?.username}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className='border-t border-gray-200'>
                <div className='flex justify-center gap-10'>
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-1.5 py-3 text-xs font-semibold tracking-widest border-t-2 transition-colors ${activeTab === 'posts' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        <Grid3X3 size={14} /> POSTS
                    </button>
                    {isLoggedInUserProfile && (
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex items-center gap-1.5 py-3 text-xs font-semibold tracking-widest border-t-2 transition-colors ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            <Bookmark size={14} /> SAVED
                        </button>
                    )}
                    <button className='flex items-center gap-1.5 py-3 text-xs font-semibold tracking-widest border-t-2 border-transparent text-gray-400 hover:text-gray-600'>
                        <Film size={14} /> REELS
                    </button>
                    <button className='flex items-center gap-1.5 py-3 text-xs font-semibold tracking-widest border-t-2 border-transparent text-gray-400 hover:text-gray-600'>
                        <Tag size={14} /> TAGGED
                    </button>
                </div>
            </div>

            {/* ── Posts Grid ── */}
            {displayedPosts?.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
                    {activeTab === 'posts' ? (
                        <>
                            <Grid3X3 size={48} className='mb-4 opacity-30' />
                            <p className='text-xl font-light mb-1'>No Posts Yet</p>
                            <p className='text-sm'>When you share photos, they will appear here.</p>
                        </>
                    ) : (
                        <>
                            <Bookmark size={48} className='mb-4 opacity-30' />
                            <p className='text-xl font-light mb-1'>No Saved Posts</p>
                            <p className='text-sm'>Save photos and videos that you want to see again.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className='grid grid-cols-3 gap-[3px] mt-1'>
                    {displayedPosts?.map((post) => (
                        <div
                            key={post?._id}
                            className='relative group cursor-pointer aspect-square'
                            onClick={() => openPostModal(post)}
                        >
                            <img
                                src={post?.image}
                                alt='post'
                                className='w-full h-full object-cover'
                            />
                            {/* Hover overlay */}
                            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6'>
                                <div className='flex items-center gap-1.5 text-white font-semibold'>
                                    <Heart size={20} className='fill-white' />
                                    <span>{post?.likes?.length ?? 0}</span>
                                </div>
                                <div className='flex items-center gap-1.5 text-white font-semibold'>
                                    <MessageCircle size={20} className='fill-white' />
                                    <span>{post?.comments?.length ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Post detail modal */}
            <CommentDialog open={commentOpen} setOpen={setCommentOpen} />
        </div>
    );
}

export default Profile
