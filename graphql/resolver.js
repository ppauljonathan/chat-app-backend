const authController=require('../controllers/auth');
const chatController=require('../controllers/chat');

module.exports={
    getMsgInChat:chatController.getMsgInChat,
    getAllUsers:authController.getAllUsers,
    getYourChats:chatController.getYourChats,
    getUsersInChat:chatController.getUsersInChat,
    signup:authController.signup,
    login:authController.login,
    createChat:chatController.createChat,
    createMsg:chatController.createMsg,
    addUserToChat:chatController.addUserToChat,
    remChatMem:chatController.remChatMem,
    leaveChat:chatController.leaveChat,
    deleteAccount:authController.deleteAccount
}