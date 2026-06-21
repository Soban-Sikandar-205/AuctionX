import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { getMessages, sendMessage } from '../../redux/chatActions';
import { useDispatch, useSelector } from 'react-redux';

const Chat = ({ itemId, currentUserId, onClose, category }) => {
  const [newMessage, setNewMessage] = useState('');
  const dispatch = useDispatch();
  
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getMessages(itemId, category));
    }, 2000);
  
    return () => clearInterval(interval);
  }, [dispatch, itemId, category]);
  
  const chats = useSelector((state) => state.auctionDataReducer.chatData);
  
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chats]);

  const handleSendMessage = async () => {
    try {
      await sendMessage(itemId, newMessage, currentUserId, category);
      dispatch(getMessages(itemId, category));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed bottom-0 right-0 m-4 flex items-center justify-center">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg border border-gray-200">
        {/* Top bar with close icon */}
        <div className="flex justify-between items-center p-4 bg-teal-600 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            &times;
          </button>
        </div>

        {/* Messages */}
        <div id="chat-container" className="p-4 max-h-80 overflow-y-auto">
          {(!chats || chats.length === 0) ? (
            <p className="text-gray-600 text-center">No messages yet. Start the conversation!</p>
          ) : (
            chats.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.senderId === currentUserId
                    ? 'bg-teal-200 text-right self-end'
                    : 'bg-gray-100 text-left self-start'
                }`}
              >
                <span className="block text-xs font-bold">
                  {msg.senderId === currentUserId ? 'You' : msg.senderId}
                </span>
                <span>{msg.message}</span>
              </div>
            ))
          )}
        </div>

        {/* Input box */}
        <div className="p-4 flex space-x-2 border-t border-gray-200">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('inboxPortal')
  );
};

export default Chat;
