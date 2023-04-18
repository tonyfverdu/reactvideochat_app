import React, { useEffect, useState, useRef } from 'react';
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import ChatBar from '../components/ChatBar.jsx';
import ChatBody from '../components/ChatBody.jsx';
import ChatFooter from '../components/ChatFooter.jsx';
import ButtonKlein from '../components/ButtonKlein.jsx';
import { BsEmojiSmile } from 'react-icons/bs';
import { IconContext } from "react-icons";

import '../sass/componentSass/ChatPage.scss';


//  1.- In the Socket.io client ("ChatPage.jsx" component), it "listens" for messages sent through the "messageResponse"
//  event and distributes the data in the message array (arrayMessages). The "arrayMessages" is passed to the 
//  ChatBody.jsx" component to be displayed in the user interface.

//  2.- In the Socket.io client ("ChatPage.jsx" component), it "listens" too the event "typingResponse" with the "data"
//      recived and distributes those data to the component "ChatBody" for renden and to be displayed in the user interface


function ChatPage({ socket }) {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const [toogleShowEmoji, setToogleShowEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [unifiedEmoji, setUnifiedEmoji] = useState("");

  const lastMessageRef = useRef(null);

  // Every time a new message arrives on the socket (listener event "messageResponse") from the server SocketIO, 
  // listen (socket.io method) shows it on screen (send to ChatBody.jsx component)

  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //  Listen the new event "typingResponse" from server socketIO, and send the data received from server to "ChatBody.jsx"
  useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(data));
  }, [socket]);

  function handleShowEmoji() {
    setToogleShowEmoji(!toogleShowEmoji);
  }

  function handleEmojiClick(emojiData, ev) {
    setSelectedEmoji(emojiData.emoji);
    setUnifiedEmoji(emojiData.unified);
  }


  return (
    <>
      <div className="contIcon" onClick={handleShowEmoji}>
        <IconContext.Provider value={{ color: "black", className: "global-class-name" }}>
          <BsEmojiSmile />
        </IconContext.Provider>
      </div>

      <div className="contMenuImages">

      </div>

      <div className="contChat">
        {toogleShowEmoji &&
          <div className="contEmojis">
            <div className="contEmojiPicker">
              <EmojiPicker
                onEmojiClick={(emojiData, ev) => handleEmojiClick(emojiData, ev)}
                searchDisabled={false}
                searchPlaceHolder='Search emoji ... '
                lazyLoadEmojis={true}
                theme={'dark'}
                emojiStyle='google'
                autoFocusSearch={false}
                suggestedEmojisMode='recent'
              />
            </div>
            <div className="contEmoji">
              <Emoji
                size={60}
                unified={unifiedEmoji}
              />
            </div>
          </div>
        }

        <ChatBar socket={socket} />
        <div className="chatMain">
          <ChatBody
            messages={messages}
            lastMessageRef={lastMessageRef}
            typingStatus={typingStatus}

          />
          <ChatFooter
            socket={socket}
            setMessages={setMessages}
            emoji={selectedEmoji}
          />
        </div>
      </div>
    </>
  );
};

export default ChatPage;