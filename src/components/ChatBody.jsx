import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';


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
    <>
      <header className="chat__mainHeader">
        <p>Hangout with Colleagues</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      {/*This shows messages sent from you*/}
      <div className="message__container">
        {messages.map((message) =>
          message.name === localStorage.getItem('userName') ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You:  {userName}</p>
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}

        <div className="message__status">
          <p></p>
          {isTyping &&
            <p><FaUser />{` ${isTyping}`}</p>
          }
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;