import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import { API_BASE_URL } from '@/lib/api';

const Login = () => {
    const [input, setInput] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE_URL}/api/v1/user/login`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({ email: "", password: "" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const isFormValid = input.email.trim() && input.password.trim();

    return (
        <div className='min-h-screen bg-[#fafafa] flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center w-full max-w-[350px]'>

                {/* Login Card */}
                <div className='bg-white border border-gray-300 w-full px-10 py-8 flex flex-col items-center'>

                    {/* Instagram Logo */}
                    <div className='mb-6 mt-2'>
                        <h1 style={{ fontFamily: "'Grand Hotel', cursive" }} className='text-5xl text-black select-none'>
                            Instagram
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={loginHandler} className='w-full flex flex-col gap-[6px]'>
                        {/* Email Input */}
                        <div className='relative'>
                            <input
                                type="text"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                className='w-full bg-[#fafafa] border border-gray-300 rounded-[3px] px-2 pt-[14px] pb-[2px] text-xs focus:outline-none focus:border-gray-400 peer'
                                placeholder=' '
                                autoComplete='username'
                            />
                            <label className='absolute left-2 top-[9px] text-[11px] text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-[9px] peer-placeholder-shown:text-[12px] peer-focus:top-[2px] peer-focus:text-[10px]'>
                                Phone number, username, or email
                            </label>
                        </div>

                        {/* Password Input */}
                        <div className='relative'>
                            <input
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={changeEventHandler}
                                className='w-full bg-[#fafafa] border border-gray-300 rounded-[3px] px-2 pt-[14px] pb-[2px] text-xs focus:outline-none focus:border-gray-400 peer'
                                placeholder=' '
                                autoComplete='current-password'
                            />
                            <label className='absolute left-2 top-[9px] text-[11px] text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-[9px] peer-placeholder-shown:text-[12px] peer-focus:top-[2px] peer-focus:text-[10px]'>
                                Password
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type='submit'
                            disabled={!isFormValid || loading}
                            className='mt-2 w-full bg-[#0095f6] text-white text-sm font-semibold rounded-lg py-[7px] hover:bg-[#1877f2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center'
                        >
                            {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Log in'}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className='flex items-center w-full my-4'>
                        <div className='flex-1 h-px bg-gray-300' />
                        <span className='mx-4 text-xs font-semibold text-gray-500'>OR</span>
                        <div className='flex-1 h-px bg-gray-300' />
                    </div>

                    {/* Facebook Login */}
                    <button className='flex items-center gap-2 text-sm font-semibold text-[#385185] hover:text-[#1a3a6b]'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-4 h-4' fill="#385185">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Log in with Facebook
                    </button>

                    {/* Forgot Password */}
                    <Link to="#" className='mt-4 text-xs text-[#00376b] hover:text-black'>
                        Forgot password?
                    </Link>
                </div>

                {/* Sign Up Box */}
                <div className='bg-white border border-gray-300 w-full py-4 text-center mt-3'>
                    <p className='text-sm'>
                        Don't have an account?{' '}
                        <Link to="/signup" className='text-[#0095f6] font-semibold hover:text-[#1877f2]'>
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Get the App */}
                <div className='mt-5 flex flex-col items-center'>
                    <p className='text-sm mb-4'>Get the app.</p>
                    <div className='flex gap-2'>
                        <a href='https://apps.apple.com' target='_blank' rel='noreferrer'>
                            <img
                                src='https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png'
                                alt='App Store'
                                className='h-10'
                            />
                        </a>
                        <a href='https://play.google.com' target='_blank' rel='noreferrer'>
                            <img
                                src='https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png'
                                alt='Google Play'
                                className='h-10'
                            />
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className='mt-12 mb-5 text-center'>
                <div className='flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500 max-w-[350px]'>
                    {['Meta','About','Blog','Jobs','Help','API','Privacy','Terms','Locations','Instagram Lite','Threads','Contact Uploading & Non-Users','Meta Verified'].map(item => (
                        <a key={item} href='#' className='hover:underline'>{item}</a>
                    ))}
                </div>
                <p className='text-xs text-gray-500 mt-4'>© 2025 Instagram from Meta</p>
            </footer>
        </div>
    )
}

export default Login
