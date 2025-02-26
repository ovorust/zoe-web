import React, { useState } from "react";
import "./Header.css";
import logo from "./media/zoe-header-logo.png";
import logo_mobile from "./media/logo.png";
import { FiMenu, FiX } from "react-icons/fi";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAcademicMode, setIsAcademicMode] = useState(false);
  const [buttonColor, setButtonColor] = useState("#797979");
 const [academicMessage, setAcademicMessage] = useState("false");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleButtonClick = async () => {
    setIsAcademicMode(!isAcademicMode);
    setButtonColor(buttonColor === "#fff" ? "#392480" : "#fff");
    try {
      if (!isAcademicMode) {
        setAcademicMessage("Responda de forma acadêmica, como um especialista no assunto, com muita didática, como se estivesse fazendo um trabalho de faculdade ou respondendo uma quuestão de uma prova.")
      }else {
        setAcademicMessage("Responda no modo Zoe normal.");
      }
      const response = await fetch('https://zoe-web.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: academicMessage }),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="header">
      <div className="header-left">
       
        <img draggable="false" className="logo-img-hdr" src={logo} alt="Logo" />
        <img draggable="false" src={logo_mobile} className="mobile-logo" alt="Logo" />
      </div>
      
      <p className="header-center">Zoe AI</p>
      <button className="menu-btn" onClick={toggleSidebar}>
          <FiMenu size={28} color="white" />
        </button>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FiX size={30} />
        </button>
        <ul>
          <li><a href="#" style={{color: buttonColor}}onClick={handleButtonClick}>Acadêmico</a></li>
          <li><a href="#">Sobre</a></li>
          <li><a href="#">Serviços</a></li>
          <li><a href="#">Contato</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
