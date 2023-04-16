import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { IconContext } from "react-icons";
import ButtonKlein from './ButtonKlein.jsx';

import '../sass/componentSass/ChatBody.scss';


function ChatBody({ messages, userName, lastMessageRef, typingStatus }) {
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState('');

  //  Delete active user passed as "prop" (userName) from the list of active users. Switch to chat homepage and reload.
  const handleLeaveChat = () => {
    localStorage.removeItem('userName');  //  <<== If the connected user data is deleted in "local storage", a console message will be displayed in the backend.
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    setIsTyping('');
    setIsTyping(typingStatus);
  }, [typingStatus]);

  //  Reset of information of status typing
  useEffect(() => {
    setIsTyping('');
    setIsTyping(typingStatus);
  }, [messages])


  return (
    <div className="contChatBody">
      <div className="contTopChatBody">
        <header className="headerChatBody">
          <h2 className="titelChatBody">Hangout with Colleagues</h2>
        </header>

        <div className="contButton">
          <ButtonKlein
            handleButton={handleLeaveChat}
            text="EXIT"
            parW="4.4rem"
            parH="2.4rem"
            parFS="0.8rem"
          />
        </div>
      </div>

      <div className="contBottomChatBody">
        {/*This shows messages sent from you*/}
        <div className="contMessages">
          {messages.map((message) =>
            message.name === localStorage.getItem('userName') ? (
              <div className="theContainerMessYou">
                <div className="messageChatsYou" key={message.id}>
                  <p className="messageNameSend">You {userName}</p>
                  <div className="contMessageSend">
                    <p className="textMessage">{message.text}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="theContainerMessShe">
                <div className="messageChatsShe" key={message.id}>
                  <div className="contMessageSend">
                    <p className="textMessage">{message.text}</p>
                  </div>
                  <p className="messageNameSend">{message.name}</p>
                </div>
              </div>
            )
          )}

          {/* <div className="messageStatus"> */}
          <div className={`typingStatus !== '' ? messageStatus : null`}>
            <IconContext.Provider value={{ color: "red", className: "global-class-name" }}>
              <p></p>
              {isTyping &&
                <p><FaUser />{` ${isTyping}`}</p>
              }
            </IconContext.Provider>
          </div>
          <div ref={lastMessageRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatBody;