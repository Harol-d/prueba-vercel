import React from 'react';
import ChatBubble from './ChatBubble';

const ChatContainer = ({ messages, onOpenModal }) => {
  return (
    <div className="chat-container">
      {messages.map((msg) => (
        <ChatBubble 
          key={msg.id} 
          message={msg} 
          onOpenModal={onOpenModal} 
        />
      ))}
    </div>
  );
};

export default ChatContainer;
