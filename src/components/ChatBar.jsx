import React, { useState, useEffect } from 'react';


function ChatBar({ socket }) {
  const [usersActivInChat, setUsersActivInChat] = useState([]);

  //  The Hook useEffect "listens" (socket.on) for the response sent from the Node.js server (newuserResponse?) 
  //  and collects the list of active users ("usersActivInChat"). 
  //  The list is assigned to the view and updated in real time.
  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsersActivInChat(data));
  }, [socket, usersActivInChat]);


  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {usersActivInChat.map((user) => <p key={user.socketID}>{user.user}</p>)}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;