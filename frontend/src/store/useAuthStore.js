import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import  { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001": "/"

export const useAuthStore = create((set, get) =>({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth:true,
    onlineUsers: [],
    socket: null,
    typingUsers: {}, // {fromId: toId}
    myContact: [],

    checkAuth: async() =>{
        try{
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket()

        } catch(error) {
            console.log("Error in CheckAuth: ", error)
            set({authUser:null})
        } finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async (data) => {
        console.log("INSIDE SIGNUP USEAUTHSTORE")
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account created successfully");
          get().connectSocket()
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isSigningUp: false });
        }
    },

    createOTP: async(data) =>{
      console.log("INSIDE USEAUTHSTORE CREATE OTP")
      try{
        await axiosInstance.post("/auth/createotp", data);
      } catch (error) {
        toast.error(error.response.data.message)
      }

    },

    verifyOTP: async (otpData) =>{

      console.log("INSIDE USEAUTHSTORE")
      console.log(otpData.email, "", otpData.otp)
      try{
        const res = await axiosInstance.post("/auth/verifyotp", otpData);
        toast.success("OPT Verified");
        return res.data
      } catch (error) {
        toast.error(error.response.data.message)
        toast.error("Invalid OTP")
        return null
      }

    },

    logout: async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
        get().disconnectSocket()

      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
        
        get().connectSocket()

      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

    updateProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } catch (error) {
        console.log("error in update profile:", error);
        toast.error(error.response.data.message);
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    // Inside useAuthStore.js
    // connectSocket: () => {
    //   const { authUser } = get();

    //   if (!authUser || get().socket?.connected) return;

    //   const socket = io(BASE_URL, {
    //     query: {
    //       userId: authUser._id,
    //     },
    //   });

    //   socket.connect();
    //   set({ socket: socket });

    //   // Handle receiving online users
    //   socket.on("getOnlineUsers", (userIds) => {
    //     set({ onlineUsers: userIds });
    //   });

    //   // Listen for typing events
    //   socket.on("userTyping", ({ fromId }) => {
    //     const typingUsers = { ...get().typingUsers, [fromId]: true };
    //     set({ typingUsers });

    //     // Automatically clear the typing state after a timeout (optional)
    //     setTimeout(() => {
    //       const updatedTypingUsers = { ...get().typingUsers };
    //       delete updatedTypingUsers[fromId];
    //       set({ typingUsers: updatedTypingUsers });
    //     }, 3000); // Clear typing after 3 seconds of inactivity
    //   });
    // },



    
    // typing: async (selectedUser) => {
    //   console.log("Before Typing Users: ", get().typingUsers);
    //   const currentUser = get().authUser; // Get the current authenticated user
    //   if (!selectedUser || !currentUser) return; // Ensure both selectedUser and currentUser exist
    
    //   const typingUsers = get().typingUsers;
    //   const currentUserId = currentUser._id;
    //   const selectedUserId = selectedUser._id;
    
    //   // Check if the current user is already typing to someone
    //   const existingTyping = typingUsers[currentUserId];
    
    //   // If the current user is typing to a different user, update the typing state
    //   if (!existingTyping || existingTyping !== selectedUserId) {
    //     // If the user starts typing to a different user or starts typing after previously not typing
    //     set({
    //       typingUsers: {
    //         ...typingUsers, // Preserve the existing typing users
    //         [currentUserId]: selectedUserId, // Update typing info to the selected user
    //       },
    //     });
    
    //     // Emit the "userTyping" event
    //     if (get().socket?.connected) {
    //       get().socket.emit("userTyping", { fromId: currentUserId, toId: selectedUserId });
    //     }
    //   }
    
    //   console.log("After Typing Users: ", get().typingUsers); // Debugging line to see the current state of typingUsers
    //   console.log("All From: ", Object.keys(get().typingUsers)); // Log all keys (fromIds)
    // },
    
    typing: (() => {
      let typingTimeout = null; // Declare a typing timeout variable
      
      return async (selectedUser) => {
        const currentUser = get().authUser;
        if (!selectedUser || !currentUser) return;
    
        const socket = get().socket;
        const currentUserId = currentUser._id;
        const selectedUserId = selectedUser._id;
    
        // Emit the "userTyping" event
        if (socket?.connected) {
          socket.emit("userTyping", { fromId: currentUserId, toId: selectedUserId });
        }
    
        // Clear the existing timeout
        if (typingTimeout) clearTimeout(typingTimeout);
    
        // Set a timeout to stop typing after 3 seconds of inactivity
        typingTimeout = setTimeout(() => {
          if (socket?.connected) {
            socket.emit("userTyping", { fromId: currentUserId, toId: null }); // Emit typing end
          }
        }, 3000);
      };
    })(),

    addNewNumber: async (newNumber)=>{
      const { authUser } = get();
      const userId = authUser._id
        const newNumberData = {
          newNumber,
          userId,
        }
      try{
      
        const res = await axiosInstance.post("/messages/addnewnumber", newNumberData);
        toast.success(res.data.message);
      } catch(error) {
        toast.error(error.response.data.message);
      }
    },

    getMyContacts: async() =>{
      const userId = get().authUser._id
      try{
        console.log("USER IN GET: ", userId)
        const res = await axiosInstance.post("/messages/getmycontacts", {userId});
        console.log("MY CONTACT LIST: ", res.data.contacts)
        set({ myContact: res.data.contacts })
      }catch(error){
        toast.error(error.response.data.message);
      }
    },

    connectSocket: () => {
      const { authUser } = get();
    
      if (!authUser || get().socket?.connected) return;
    
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
      });
    
      socket.connect();
      set({ socket: socket });
    
      // Handle receiving online users
      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    
      // Listen for typing events
      socket.on("userTyping", ({ fromId }) => {
        const typingUsers = { ...get().typingUsers, [fromId]: true };
        set({ typingUsers });
      });
    
      // Listen for stopped typing events
      socket.on("userStoppedTyping", ({ fromId }) => {
        const typingUsers = { ...get().typingUsers };
        delete typingUsers[fromId]; // Remove the user from the typing state
        set({ typingUsers });
      });
    },

    disconnectSocket: () =>{
      if(get().socket?.connected) get().socket.disconnect()
    },
    
    
}))