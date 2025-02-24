import React, { useState } from 'react';
import Chat from './Chat';
import Header from "./Header";
import MessageList from './MessageList';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="App">
      <Header />
      <div className='container-message'>
        <Chat onSendMessage={handleSendMessage} /> {/* Chat fica abaixo */}
      </div>
    </div>
  );
}

export default App;
