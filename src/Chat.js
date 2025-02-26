import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import logo from './media/zoe-logo.png';
import academic_icon from './media/academic.png';
import academic_icon_clicked from './media/academic-clicked.png';

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAcademicMode, setIsAcademicMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar a requisição
  const textAreaRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref para o fim das mensagens

  const [buttonColor, setButtonColor] = useState('#797979'); // Cor padrão

  const academicPrompt = 'Responda de forma acadêmica, utilizando uma linguagem clara e acessível, como se estivesse elaborando um trabalho de faculdade ou respondendo a uma questão de prova. Assegure-se de que sua resposta contenha definições, explicações e exemplos pertinentes, bem como uma linguagem acadêmica e didática.'
  const handleButtonClick = () => {
    // Alterna o modo acadêmico
    setIsAcademicMode(!isAcademicMode);
    // Alterna a cor do botão
    setButtonColor(buttonColor === '#797979' ? '#392480' : '#797979');
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  useEffect(() => {
    scrollToBottom(); // Chama a função de rolagem sempre que as mensagens mudam
  }, [messages]);

  const adjustHeight = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto"; // Reseta altura para evitar crescimento infinito
      textArea.style.height = textArea.scrollHeight + "px"; // Ajusta com base no conteúdo
    }
  };

  const scrollToBottom = () => {
    const scrollRef = messagesEndRef.current;
    if (scrollRef) {
      scrollRef.scrollIntoView({ behavior: "smooth" }); // Rola suavemente para baixo
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleClearMessages = async () => {
    // Envia a requisição para o backend Flask para limpar o histórico de chat
    try {
      const response = await fetch('https://zoe-web.onrender.com/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.message === "Chat history cleared") {
        setMessages([]); // Limpa as mensagens no frontend
      }
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return; // Evita mensagens vazias
    let trimmedMessage = message.trim(); // Mensagem enviada pelo usuário
    const originalMessage = message.trim()
    let messageToSend = originalMessage;

    if (isAcademicMode) {
      messageToSend = `${academicPrompt} ${messageToSend}`;
    }
    
    setMessage("");
    // Envia a mensagem do usuário
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: originalMessage, sender: "user" }
    ]);

    setIsLoading(true); // Define o estado de carregamento como true

    // Envia a mensagem para o backend Flask
    try {
      const response = await fetch('https://zoe-web.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
      });
      const data = await response.json();
      if (data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, sender: "bot" }
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsLoading(false); // Define o estado de carregamento como false
    setMessage(""); // Limpa o campo após enviar
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) { // Verifica se a tecla pressionada é Enter e se Shift não está pressionado
      event.preventDefault(); // Impede a nova linha
      handleSendMessage(); // Chama a função de envio de mensagem
    }
  };

  const formatMessage = (text) => {
    const parts = text.split(/(\*\*[^**]+\*\*)/g);
    return parts.map((part, index) => 
      part.startsWith("**") && part.endsWith("**") ? 
      <strong key={index}>{part.slice(2, -2)}</strong> : 
      part
    );
  };

  return (
    <div className="chat-container">
      
      {/* Exibe todas as mensagens enviadas */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-message">
            Sobre o que vamos falar hoje?
            <img draggable="false" className="logo-img" src={logo} alt="Logo" />
            </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.text.includes("[zoe]") ? "zoe-message" : ""}`}
              id={`${msg.text.includes("[zoe]") ? "zoe-message-container" : ""}`}
            >
              {formatMessage(msg.text.replace("[zoe]", "").trim())}
            </div>
          ))
        )}
        {isLoading && (
          <div className="chat-bubble zoe-message" id="zoe-message-container">
            <div className="loading">
              <span>•</span><span>•</span><span>•</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Div para o scroll */}
      </div>

      {/* Input de envio da mensagem */}
      <div className="chat-input-container">
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <textarea
            ref={textAreaRef}
            className="chat-input"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown} // Adiciona o manipulador de eventos
            placeholder="Digite sua mensagem..."
            rows={1}
          />
          <button className="academic-button" onClick={handleButtonClick} style={{ borderColor: buttonColor }}>
            <img draggable="false" className="academic-image" src={isAcademicMode ? academic_icon_clicked : academic_icon} alt="Acadêmico" />
            <p style={{color: buttonColor}}>Acadêmico</p>
          </button>
          <button className="chat-send-button" onClick={handleSendMessage}>➤</button>
        </div>
      </div>
      <div className="clear-button">
          <p onClick={handleClearMessages}>Limpar</p>
        </div>
    </div>
  );
}

export default Chat;