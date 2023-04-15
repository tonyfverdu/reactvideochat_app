import { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import ChatPage from './Pages/ChatPage.jsx';
import socketIO from 'socket.io-client';
import './App.css';

const UserContext = createContext();

const socket = socketIO.connect('http://127.0.100.1:5002');   //  <<== Connection via socket.io to the backend socket server


function App() {
  const [count, setCount] = useState(0);
  const [userName, setUserName] = useState('');  //  Variable de estado de "nombre del usuario" del chat, controlado por React

  return (
    <UserContext.Provider value={userName}>
      <div className="App">
        <div>
          <h1>Hallo World</h1>
        </div>
        <BrowserRouter>
          <div>
            <Routes>
              <Route path="/" element={<Home socket={socket} />}></Route>
              <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;