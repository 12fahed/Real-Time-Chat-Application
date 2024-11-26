import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: [], // {fromId: toId}

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subcribeToMessages: () =>{
    const {selectedUser} = get()
    if(!selectedUser) return

    const socket = useAuthStore.getState().socket
    socket.on("newMessage", (newMessage) =>{

        if(newMessage.senderId !== selectedUser._id) return
        set({
          messages: [...get().messages, newMessage]
        })
    })
  },

  unsubscribeFromMessages: () =>{
    const socket = useAuthStore.getState().socket
    socket.off("newMessage  ")
  },

  // typing: async () => {
  //   const { selectedUser } = get();
  //   const currentUser = useAuthStore.getState().user;
  //   console.log("Current User: ", authUser._id)
  //   if (!selectedUser || !currentUser) return;
  
  //   try {
  //     const existingTyping = get().typingUsers.find(
  //       (user) => user.fromId === currentUser._id && user.toId === selectedUser._id
  //     );
  
  //     if (!existingTyping) {
  //       set({typingUsers: [...get().typingUsers, { fromId: currentUser._id, toId: selectedUser._id },],});
  //     }
      
      
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // },
  

  setSelectedUser: (selectedUser) => set({selectedUser})

}));