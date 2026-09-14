import { addMessage } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            dispatch(addMessage(newMessage));
        })

        return () => {
            socket?.off('newMessage');
        }
    }, [socket, dispatch]);
};
export default useGetRTM;
