import User from "../models/user.model.js"
import Messages from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"

export const getUsersForSidebar = async (req, res) =>{
    
    try{
        
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password")

        res.status(200).json(filteredUsers)

    } catch(error) {
        console.error("Error in getUsersForSidebar: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }

}

export const getMessages = async (req, res) =>{

    try {

        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await Messages.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        await Messages.updateMany(
            { senderId: userToChatId, receiverId: myId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json(messages)
    } catch(error) {
        console.log("Error in getMessages Controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }

}

export const sendMessage = async (req, res) => {
    try {
        
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
  
      let imageUrl;
      if (image) {

        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Messages({
        senderId,
        receiverId,
        text,
        image: imageUrl,
        read: false
      });
  
      await newMessage.save();
      const receiverSocketId = getReceiverSocketId(receiverId)
      if (getReceiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
      }

      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      console.log("Req Body: ", req.body , "User id: ", req.user._id, "Req Params: ", req.params  )
      res.status(500).json({ error: "Internal server error" });
    }
};


export const addNewNumber = async (req, res) => {
  try {
    const { userId, newNumber } = req.body; // Extract userId and newNumber from the request body
    console.log("USER: ", userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!Array.isArray(user.contacts)) {
      user.contacts = [];
    }

    if (user?.contacts?.includes(newNumber)) {
      return res.status(400).json({ message: "Number already exists in contacts." });
    }

    user?.contacts?.push(newNumber);

    await user.save();

    res.status(200).json({ message: "Number added successfully.", contacts: user.contacts });
  } catch (error) {
    console.error("Error in addNewNumber:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getMyContacts = async (req, res) => {
  const { userId } = req.body; // Extract the userId from the request body

  try {
    
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!Array.isArray(user.contacts) || user.contacts.length === 0) {
      return res.status(200).json({ message: "No contacts available.", contacts: [] });
    }

    const matchingUsers = await User.find({ phno: { $in: user.contacts } }, '_id phno');

    res.status(200).json({
      message: "Contacts fetched successfully.",
      contacts: matchingUsers,
    });
  } catch (error) {
    console.error("Error in getMyContacts:", error);
    res.status(500).json({ message: "Server error." });
  }
};
