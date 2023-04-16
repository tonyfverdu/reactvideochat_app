import { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BsXSquareFill } from 'react-icons/bs'
import Home from './components/Home.jsx';
import ChatPage from './Pages/ChatPage.jsx';
import socketIO from 'socket.io-client';
import HeaderComponent from './components/HeaderComponent.jsx';

import './sass/index.scss';

const UserContext = createContext();

const socket = socketIO.connect('http://127.0.100.1:5002');   //  <<== Connection via socket.io to the backend socket server


function App() {
  const title = 'MERN App Chat: React, MUI, NodeJS, SocketIO, Express and MongoDB';
  const titleMemoListHeader = 'Personalised Videochat';
  const subtitleMemoListHeader = 'MERN App (React-NodeJS-SocketIO-Express-MongoDB)';
  const titleSite = 'A Videochat in React';

  //Usestates variables: toggleHeader, count, userName
  const [toggleHeader, setToggleHeader] = useState(false);
  const [count, setCount] = useState(0);
  const [userName, setUserName] = useState('');  //  Variable de estado de "nombre del usuario" del chat, controlado por React

  //  Function for to exit of the header
  function handleonClickExit(ev) {
    setToggleHeader(!toggleHeader)
  }


  return (
    <div className='containerApp'>
      <div className="contIconExit" onClick={(ev) => handleonClickExit(ev)}>
        <BsXSquareFill
        />
      </div>
      <UserContext.Provider value={userName}>
        <div className="contCentral">
          {toggleHeader &&
            <>
              <div className="containerLogos">
                <figure className="MERNFigure">
                  <img className="imageLogo" src={`./src/assets/images/logos/React_logo.png`} alt='Logo React' />
                </figure>
                <figure className="MERNFigure">
                  <img className="imageLogo" src={`./src/assets/images/logos/logoMUI.png`} alt='Logo MUI' />
                </figure>
                <figure className="MERNFigure">
                  <img className="imageLogo" src={`./src/assets/images/logos/NodeJS.png`} alt='Logo NodeJS' />
                </figure>
                <figure className="MERNFigure">
                  <img className="imageLogo" src={`./src/assets/images/logos/LogoSocketIO.png`} alt='Logo SocketIO' />
                </figure>
                <figure className="MERNFigure">
                  <img className="imageLogo" src={`./src/assets/images/logos/nodeJSExpress.png`} alt='Logo Express' />
                </figure>
                <figure className="MERNFigure">
                  <img className="imageLogo" src={`./src/assets/images/logos/mongoDB.webp`} alt='Logo MongoDB' />
                </figure>
              </div>
              <div className="header-Principal">
                <h2>{title}</h2>
              </div>
            </>
          }

          <HeaderComponent
            title="Videochat Application"
            subtitle="With React, MCI, NodeJS, Express, SocketIO and MongoDB"
          />

          <BrowserRouter>
            <div className="contNav">
              <Routes>
                <Route path="/" element={<Home socket={socket} />}></Route>
                <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;