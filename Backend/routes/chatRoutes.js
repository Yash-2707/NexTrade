const router = require("express").Router();
const { 
  createConversation, 
  getConversations, 
  createMessage, 
  getMessages 
} = require("../controllers/chatController");

router.post("/conversation", createConversation);
router.get("/conversation/:userId", getConversations);
router.post("/message", createMessage);
router.get("/message/:conversationId", getMessages);

module.exports = router;