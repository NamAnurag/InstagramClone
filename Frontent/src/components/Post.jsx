import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, BookmarkCheck, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { API_BASE_URL } from '@/lib/api'
import { Link } from 'react-router-dom'

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();

    useEffect(() => {
        const reduxPost = posts.find(p => p._id === post._id);
        if (reduxPost) setComment(reduxPost.comments);
    }, [posts]);

    const changeEventHandler = (e) => setText(e.target.value);

    const likeOrDislikeHandler = async () => {
        const prevLiked = liked;
        const prevLikeCount = postLike;
        const action = liked ? 'dislike' : 'like';
        setLiked(!liked);
        setPostLike(liked ? postLike - 1 : postLike + 1);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: prevLiked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
            } else {
                setLiked(prevLiked);
                setPostLike(prevLikeCount);
            }
        } catch (error) {
            setLiked(prevLiked);
            setPostLike(prevLikeCount);
        }
    }

    const commentHandler = async () => {
        if (!text.trim()) return;
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/post/${post._id}/comment`, { text }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                dispatch(setPosts(posts.map(p => p._id === post._id ? { ...p, comments: updatedCommentData } : p)));
                setText("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add comment");
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${API_BASE_URL}/api/v1/post/delete/${post?._id}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setPosts(posts.filter(p => p?._id !== post?._id)));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
            if (res.data.success) {
                setBookmarked(res.data.type === 'saved');
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to bookmark post");
        }
    }

    // Format time ago
    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d`;
        return `${Math.floor(days / 7)}w`;
    };

    return (
        <div className='w-full max-w-[470px] mb-6 border-b border-gray-200 pb-4'>
            {/* Header */}
            <div className='flex items-center justify-between px-1 py-2'>
                <div className='flex items-center gap-3'>
                    {/* Story-ring avatar */}
                    <Link to={`/profile/${post.author?._id}`}>
                        <div className='p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'>
                            <div className='p-[2px] bg-white rounded-full'>
                                <Avatar className='w-8 h-8'>
                                    <AvatarImage src={post.author?.profilePicture} />
                                    <AvatarFallback className='text-xs'>{post.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </Link>
                    <div className='flex flex-col'>
                        <Link to={`/profile/${post.author?._id}`} className='text-sm font-semibold hover:text-gray-600'>
                            {post.author?.username}
                        </Link>
                        {post.createdAt && (
                            <span className='text-xs text-gray-400'>{timeAgo(post.createdAt)}</span>
                        )}
                    </div>
                    {user?._id === post.author?._id && (
                        <span className='text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full'>Author</span>
                    )}
                </div>

                {/* More options */}
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer text-gray-700 hover:text-black' size={20} />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center p-0 overflow-hidden max-w-xs rounded-2xl">
                        {post?.author?._id !== user?._id && (
                            <button className="w-full py-3 text-[#ED4956] font-bold border-b border-gray-100 hover:bg-gray-50">Unfollow</button>
                        )}
                        <button className="w-full py-3 border-b border-gray-100 hover:bg-gray-50">Add to favorites</button>
                        {user?._id === post?.author?._id && (
                            <button onClick={deletePostHandler} className="w-full py-3 text-[#ED4956] border-b border-gray-100 hover:bg-gray-50">Delete</button>
                        )}
                        <button className="w-full py-3 hover:bg-gray-50">Cancel</button>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Image */}
            <img
                className='w-full aspect-square object-cover rounded-sm'
                src={post.image}
                alt="post_img"
            />

            {/* Action Buttons */}
            <div className='flex items-center justify-between px-1 pt-3 pb-1'>
                <div className='flex items-center gap-4'>
                    <button onClick={likeOrDislikeHandler} className='transition-transform active:scale-125'>
                        {liked
                            ? <FaHeart size={24} className='text-red-500' />
                            : <FaRegHeart size={24} className='hover:text-gray-400' />
                        }
                    </button>
                    <button onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }}>
                        <MessageCircle size={24} className='hover:text-gray-400' />
                    </button>
                    <button>
                        <Send size={24} className='hover:text-gray-400' />
                    </button>
                </div>
                <button onClick={bookmarkHandler} className='transition-transform active:scale-110'>
                    {bookmarked
                        ? <BookmarkCheck size={24} className='fill-black' />
                        : <Bookmark size={24} className='hover:text-gray-400' />
                    }
                </button>
            </div>

            {/* Likes */}
            <div className='px-1'>
                <p className='text-sm font-semibold'>{postLike.toLocaleString()} {postLike === 1 ? 'like' : 'likes'}</p>
            </div>

            {/* Caption */}
            {post.caption && (
                <div className='px-1 mt-1'>
                    <p className='text-sm'>
                        <Link to={`/profile/${post.author?._id}`} className='font-semibold mr-1'>{post.author?.username}</Link>
                        {post.caption}
                    </p>
                </div>
            )}

            {/* View comments */}
            {comment.length > 0 && (
                <button
                    onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }}
                    className='px-1 mt-1 text-sm text-gray-400 hover:text-gray-600'
                >
                    View all {comment.length} comments
                </button>
            )}

            {/* Add comment */}
            <div className='flex items-center px-1 mt-2 border-t border-gray-100 pt-2'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    onKeyDown={(e) => { if (e.key === 'Enter') commentHandler(); }}
                    className='flex-1 outline-none text-sm bg-transparent placeholder-gray-400'
                />
                {text.trim() && (
                    <button onClick={commentHandler} className='text-[#0095f6] text-sm font-semibold ml-2 hover:text-[#1877f2]'>
                        Post
                    </button>
                )}
            </div>

            <CommentDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Post
