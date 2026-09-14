import { setMessages } from "@/redux/chatSlice";
import { API_BASE_URL } from "@/lib/api";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.auth);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                if (!selectedUser?._id) return;
                const res = await axios.get(`${API_BASE_URL}/api/v1/message/all/${selectedUser._id}`, { withCredentials: true });
                if (res.data.success) {  
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessage();
    }, [selectedUser, dispatch]);
};
export default useGetAllMessage;
