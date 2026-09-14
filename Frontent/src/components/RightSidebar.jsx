import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  return (
    <div className='hidden lg:flex flex-col w-[320px] shrink-0 pt-10 pr-4'>
      {/* Current User */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${user?._id}`}>
            <div className='p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'>
              <div className='p-[2px] bg-white rounded-full'>
                <Avatar className='w-10 h-10'>
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className='text-sm'>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </Link>
          <div className='flex flex-col'>
            <Link to={`/profile/${user?._id}`} className='text-sm font-semibold hover:text-gray-600'>
              {user?.username}
            </Link>
            <span className='text-xs text-gray-400 truncate max-w-[140px]'>{user?.bio || 'No bio yet'}</span>
          </div>
        </div>
        <Link to="/account/edit" className='text-xs font-semibold text-[#0095f6] hover:text-[#1877f2]'>
          Switch
        </Link>
      </div>

      <SuggestedUsers />

      {/* Footer links */}
      <div className='mt-6'>
        <div className='flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-gray-400'>
          {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language'].map(item => (
            <a key={item} href='#' className='hover:underline'>{item}</a>
          ))}
        </div>
        <p className='text-[11px] text-gray-400 mt-2'>© 2025 Instagram from Meta</p>
      </div>
    </div>
  )
}

export default RightSidebar
