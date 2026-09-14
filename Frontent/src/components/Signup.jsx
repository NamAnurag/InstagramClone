import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '@/lib/api';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE_URL}/api/v1/user/register`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({ username: "", email: "", password: "" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const isFormValid = input.username.trim() && input.email.trim() && input.password.trim();

    return (
        <div className='min-h-screen bg-[#fafafa] flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center w-full max-w-[350px]'>

                {/* Signup Card */}
                <div className='bg-white border border-gray-300 w-full px-10 py-8 flex flex-col items-center'>

                    {/* Instagram Logo */}
                    <div className='mb-4 mt-2'>
                        <h1 style={{ fontFamily: "'Grand Hotel', cursive" }} className='text-5xl text-black select-none'>
                            Instagram
                        </h1>
                    </div>

                    {/* Tagline */}
                    <p className='text-center text-base font-semibold text-gray-500 mb-4 leading-5'>
                        Sign up to see photos and videos from your friends.
                    </p>

                    {/* Facebook Signup */}
                    <button className='w-full bg-[#0095f6] text-white text-sm font-semibold rounded-lg py-[7px] flex items-center justify-center gap-2 hover:bg-[#1877f2] transition-colors mb-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-4 h-4' fill="white">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Log in with Facebook
                    </button>

                    {/* OR Divider */}
                    <div className='flex items-center w-full mb-4'>
                        <div className='flex-1 h-px bg-gray-300' />
                        <span className='mx-4 text-xs font-semibold text-gray-500'>OR</span>
                        <div className='flex-1 h-px bg-gray-300' />
                    </div>

                    {/* Form */}
                    <form onSubmit={signupHandler} className='w-full flex flex-col gap-[6px]'>

                        {/* Email Input */}
                        <div className='relative'>
                            <input
                                type="text"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                className='w-full bg-[#fafafa] border border-gray-300 rounded-[3px] px-2 pt-[14px] pb-[2px] text-xs focus:outline-none focus:border-gray-400 peer'
                                placeholder=' '
                                autoComplete='email'
                            />
                            <label className='absolute left-2 top-[9px] text-[11px] text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-[9px] peer-placeholder-shown:text-[12px] peer-focus:top-[2px] peer-focus:text-[10px]'>
                                Mobile Number or Email
                            </label>
                        </div>

                        {/* Username Input */}
                        <div className='relative'>
                            <input
                                type="text"
                                name="username"
                                value={input.username}
                                onChange={changeEventHandler}
                                className='w-full bg-[#fafafa] border border-gray-300 rounded-[3px] px-2 pt-[14px] pb-[2px] text-xs focus:outline-none focus:border-gray-400 peer'
                                placeholder=' '
                                autoComplete='username'
                            />
                            <label className='absolute left-2 top-[9px] text-[11px] text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-[9px] peer-placeholder-shown:text-[12px] peer-focus:top-[2px] peer-focus:text-[10px]'>
                                Username
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
                                autoComplete='new-password'
                            />
                            <label className='absolute left-2 top-[9px] text-[11px] text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-[9px] peer-placeholder-shown:text-[12px] peer-focus:top-[2px] peer-focus:text-[10px]'>
                                Password
                            </label>
                        </div>

                        {/* Terms */}
                        <p className='text-xs text-gray-500 text-center mt-2 leading-4'>
                            People who use our service may have uploaded your contact information to Instagram.{' '}
                            <a href='#' className='text-[#00376b]'>Learn More</a>
                        </p>
                        <p className='text-xs text-gray-500 text-center mt-2 leading-4'>
                            By signing up, you agree to our{' '}
                            <a href='#' className='text-[#00376b]'>Terms</a>,{' '}
                            <a href='#' className='text-[#00376b]'>Privacy Policy</a> and{' '}
                            <a href='#' className='text-[#00376b]'>Cookies Policy</a>.
                        </p>

                        {/* Sign Up Button */}
                        <button
                            type='submit'
                            disabled={!isFormValid || loading}
                            className='mt-3 w-full bg-[#0095f6] text-white text-sm font-semibold rounded-lg py-[7px] hover:bg-[#1877f2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center'
                        >
                            {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Sign up'}
                        </button>
                    </form>
                </div>

                {/* Log In Box */}
                <div className='bg-white border border-gray-300 w-full py-4 text-center mt-3'>
                    <p className='text-sm'>
                        Have an account?{' '}
                        <Link to="/login" className='text-[#0095f6] font-semibold hover:text-[#1877f2]'>
                            Log in
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

export default Signup
