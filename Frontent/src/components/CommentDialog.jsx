import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import { API_BASE_URL } from "@/lib/api";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const [innerOpen, setInnerOpen] = useState(false);

  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments || []);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const sendMessageHandler = async () => {
    if (!text.trim()) return;
    if (!selectedPost?._id) {
      toast.error("Post not found");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/post/${selectedPost._id}/comment`,
        { text: text.trim() },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error("Comment error:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          // Prevent closing outer dialog when inner dialog is open
          if (innerOpen) {
            e.preventDefault();
            return;
          }
          setOpen(false);
        }}
        className="max-w-5xl max-h-[90vh] p-0 flex flex-col bg-white text-black overflow-hidden"
      >
        <div className="flex flex-1 flex-col md:flex-row min-h-0">
          {/* Post Image */}
          <div className="w-full md:w-1/2 bg-black">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-80 md:h-full object-contain md:object-cover md:rounded-l-lg"
            />
          </div>

          {/* Comments Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-between min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link to={`/profile/${selectedPost?.author?._id}`}>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    to={`/profile/${selectedPost?.author?._id}`}
                    className="font-semibold text-xs"
                  >
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>

              {/* More Options — controlled so outer dialog doesn't close */}
              <Dialog open={innerOpen} onOpenChange={setInnerOpen}>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center bg-white text-black">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>

            <hr />

            {/* Comments */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.length > 0 ? (
                comment.map((commentItem) => (
                  <Comment key={commentItem._id} comment={commentItem} />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No comments yet.
                </p>
              )}
            </div>

            {/* Add Comment */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessageHandler();
                  }}
                  placeholder="Add a comment..."
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded text-black bg-white"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  className="bg-[#0095F6] text-white hover:bg-[#1877c9] disabled:bg-gray-200 disabled:text-gray-500"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
