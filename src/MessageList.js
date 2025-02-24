import React from 'react';
import './MessageList.css'; // Certifique-se de importar o CSS corretamente

function MessageList({ messages }) {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className="message-bubble">{msg}</div>
      ))}
    </div>
  );
}

export default MessageList;
