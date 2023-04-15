import React, { useState } from 'react';

function ChatFooter({ socket }) {
  const [message, setMessage] = useState('');

  //  Activation of the "typing" event each time a user types in the text field (input type="text").
  const handleTyping = () => {
    socket.emit('typing', `${localStorage.getItem('userName')} is typing`);
  }

  const handleSendMessage = (ev) => {
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


  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;