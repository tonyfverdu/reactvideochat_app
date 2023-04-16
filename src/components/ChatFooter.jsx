import React, { useState } from 'react';
import '../sass/componentSass/ChatFooter.scss';
import ButtonKlein from './ButtonKlein.jsx';


function ChatFooter({ socket, setMessages }) {
  const [message, setMessage] = useState('');

  //  Activation of the "typing" event each time a user types in the text field (input type="text").
  const handleTyping = () => {
    socket.emit('typing', `${localStorage.getItem('userName')} is typing`);
  }

  function handleSendMessage(ev) {
    ev.preventDefault();
    //  If the message is not "empty" (not '') and there is a user name "stored" in "Local Storage".
    //  If true   => message" entered in the input, with "socket.emit".
    //  If false  => pongo el mensaje (message) a ""
    if (message.trim() !== '' && localStorage.getItem('userName')) {
      socket.emit('message', {
        text: message,
        name: localStorage.getItem('userName'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage('');
  };

  function handleDeleteButton() {
    setMessages([]);
  }

  function handleSubmitButton() {
    console.log('submit');
  };


  return (
    <div className="chatFooter">
      <form className="formFooter" onSubmit={(ev) => handleSendMessage(ev)}>
        <input type="text" placeholder="Write message" className="messageInput" value={message}
          onChange={(ev) => setMessage(ev.target.value)}
          onKeyDown={handleTyping}
        />
        <div className="contButton">
          <ButtonKlein
            handleButton={handleDeleteButton}
            text="Delete"
            parW="4.4rem"
            parH="2.4rem"
            parFS="0.8rem"
          />
          <ButtonKlein
            handleButton={handleSubmitButton}
            text="Submit"
            parW="4.4rem"
            parH="2.4rem"
            parFS="0.8rem"
          />
        </div>
        {/* <button className="sendBtn">SEND</button> */}
      </form>
    </div>
  );
};

export default ChatFooter;