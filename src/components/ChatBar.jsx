import React, { useState, useEffect } from 'react';
import '../sass/componentSass/ChatBar.scss';


function ChatBar({ socket }) {
  const [usersActivInChat, setUsersActivInChat] = useState([]);

  //  The Hook useEffect "listens" (socket.on) for the response sent from the Node.js server (newuserResponse?) 
  //  and collects the list of active users ("usersActivInChat"). 
  //  The list is assigned to the view and updated in real time.
  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsersActivInChat(data));
  }, [socket, usersActivInChat]);


  return (
    <div className="contChatBar">
      <header className="headerTitleBar">
        <h2 className="titleBar">Open Chat</h2>
      </header>
      <div className="contBar">
        <header className='headerActivUsers'>
          <h4 className="chat__header">ACTIVE USERS</h4>
        </header>
        <div className="contChatUsers">
          {usersActivInChat.map((user, i) => {
            return (
              <div key={user.socketID} className="contActivUser">
                <p className="nameUser">{user.user}<span className="statusUser">on-line</span></p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;