import React from 'react';

const ChatWithOwnerButton = ({isOwner, onClick}) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button 
        className="text-white font-extrabold py-3.5 px-6 rounded-full shadow-2xl transition duration-150 btn-3d-teal flex items-center gap-2" 
        onClick={onClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>Chat with {isOwner ? 'Buyer' : 'Seller'}</span>
      </button>
    </div>
  );
};

export default ChatWithOwnerButton;
