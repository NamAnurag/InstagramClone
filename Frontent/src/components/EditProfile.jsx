import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { API_BASE_URL } from '@/lib/api';
import axios from 'axios';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
    const [input, setInput] = useState({
        profilePhoto: null,
        bio: user?.bio || '',
        gender: user?.gender || '',
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setInput(prev => ({ ...prev, profilePhoto: file }));
        setPreviewUrl(URL.createObjectURL(file));
    }

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        if (input.gender) formData.append("gender", input.gender);
        if (input.profilePhoto) formData.append("profilePhoto", input.profilePhoto);

        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE_URL}/api/v1/user/profile/edit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser({
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender,
                }));
                toast.success(res.data.message);
                navigate(`/profile/${user?._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='max-w-2xl mx-auto px-4 py-8'>

            {/* Header */}
            <div className='flex items-center gap-4 mb-8'>
                <button onClick={() => navigate(-1)} className='text-gray-600 hover:text-black'>
                    <ChevronLeft size={24} />
                </button>
                <h1 className='text-xl font-semibold'>Edit profile</h1>
            </div>

            {/* Profile Photo Card */}
            <div className='flex items-center justify-between bg-gray-100 rounded-2xl p-4 mb-6'>
                <div className='flex items-center gap-4'>
                    <Avatar className='w-14 h-14'>
                        <AvatarImage src={previewUrl} />
                        <AvatarFallback className='text-xl'>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className='font-semibold text-sm'>{user?.username}</p>
                        <p className='text-sm text-gray-500'>{input.bio || 'No bio yet'}</p>
                    </div>
                </div>
                <input ref={imageRef} onChange={fileChangeHandler} type='file' accept='image/*' className='hidden' />
                <button
                    onClick={() => imageRef.current?.click()}
                    className='text-sm font-semibold text-white bg-[#0095f6] hover:bg-[#1877f2] px-4 py-2 rounded-lg transition-colors'
                >
                    Change photo
                </button>
            </div>

            {/* Form Fields */}
            <div className='flex flex-col gap-6'>

                {/* Website (placeholder, not functional) */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-sm font-semibold'>Username</label>
                    <input
                        type='text'
                        value={user?.username || ''}
                        disabled
                        className='w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed'
                    />
                    <p className='text-xs text-gray-400'>Username cannot be changed here.</p>
                </div>

                {/* Bio */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-sm font-semibold'>Bio</label>
                    <textarea
                        value={input.bio}
                        onChange={(e) => setInput(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        maxLength={150}
                        placeholder='Write something about yourself...'
                        className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-gray-400'
                    />
                    <p className='text-xs text-gray-400 text-right'>{input.bio.length} / 150</p>
                </div>

                {/* Gender */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-sm font-semibold'>Gender</label>
                    <select
                        value={input.gender}
                        onChange={(e) => setInput(prev => ({ ...prev, gender: e.target.value }))}
                        className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-white'
                    >
                        <option value=''>Prefer not to say</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                    </select>
                </div>

                {/* Submit */}
                <button
                    onClick={editProfileHandler}
                    disabled={loading}
                    className='w-full bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2'
                >
                    {loading ? (
                        <><Loader2 className='h-4 w-4 animate-spin' /> Saving...</>
                    ) : 'Save'}
                </button>

                <button
                    onClick={() => navigate(`/profile/${user?._id}`)}
                    className='w-full text-sm text-gray-500 hover:text-black py-2'
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default EditProfile
