const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const createConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // 1. Validate Input
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Sender and Receiver IDs are required" });
    }

    // 2. Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // 3. Create New Conversation
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);

  } catch (error) {
    console.error("Create Chat Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const conversations = await Conversation.find({
      members: { $in: [userId] },
    })
      .populate("members", "name profilePic role email") // Added 'role' and 'email' for better UI context
      .sort({ updatedAt: -1 }); // ✅ FIX: Sort by newest interaction first

    res.status(200).json(conversations);

  } catch (error) {
    console.error("Get Chats Error:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

/**
 * @desc    Send a new message
 * @route   POST /api/chat/message
 * @access  Private
 */
const createMessage = async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;

    // 1. Validate Input
    if (!conversationId || !sender || !text) {
      return res.status(400).json({ message: "Message data is incomplete" });
    }

    // 2. Create Message
    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });

    const savedMessage = await newMessage.save();

    // 3. ✅ OPTIONAL FIX: Update Conversation timestamp so it moves to top of list
    // This helps with the "refresh needed" issue
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

    res.status(201).json(savedMessage);

  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/**
 * @desc    Get messages for a specific conversation
 * @route   GET /api/chat/message/:conversationId
 * @access  Private
 */
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .sort({ createdAt: 1 }); // ✅ FIX: Ensure messages load oldest -> newest

    res.status(200).json(messages);

  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

module.exports = {
  createConversation,
  getConversations,
  createMessage,
  getMessages,
};