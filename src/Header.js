import React from "react";
import "./Header.css";
import logo from './media/zoe-header-logo.png'
import logo_mobile from './media/logo.png'

function Header() {
  return (
    <div className="header">
      <div>
        <img className="logo-img-hdr" src={logo} alt="Logo" />
        <img src={logo_mobile} class="mobile-logo" alt="Logo"/>
      </div>
      
      <p className="header-center">Zoe GPT 4.0</p>
      <p className="header-right">v1.0</p>
    </div>
  );
}

export default Header;