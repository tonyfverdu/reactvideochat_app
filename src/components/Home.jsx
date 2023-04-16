import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonKlein from '../components/ButtonKlein.jsx';
import { FaUser } from 'react-icons/fa';
import { IconContext } from "react-icons";

import '../sass/componentSass/Home.scss';


function Home({ socket }) {
  const navigate = useNavigate();  //  <<==  El hook "useNavigate" de ReactRouter devuelve una función que permite navegar mediante programación
  // let userName = useContext(UserContext)
  const [user, setUser] = useState('')

  //  Submit function of the chat input form "button".
  const handleSubmit = (ev) => {
    //ev.preventDefault();
    localStorage.setItem('userName', user); // <== Storage in "local storage" of the logged-in user name
    socket.emit('newUser', { user, socketID: socket.id }); // <<==  sends the username and socket ID to the Node.js server
    navigate('/chat');   //  <== go to the "chat" page of the application. React Router's imperative API "navigate (route)
    // allows for programmatic navigation (changes the current location when rendered.)
  };

  function handleButton(ev) {
    handleSubmit(ev);
  };


  return (
    <div className="containerApp">
      <form className="home__container" onSubmit={(ev) => handleSubmit(ev)}>
        <header className="headerTitle">
          <h2 className="home__header">Sign in to Open Chat</h2>
        </header>

        <div className="contInput">
          <IconContext.Provider value={{ color: "green", className: "global-class-name" }}>
            <div className="contLabel_icon">
              <label htmlFor="username">Username</label>
              <FaUser />
            </div>
          </IconContext.Provider>
          <input type="text" id="username" className="username__input" minLength={6} name="username" value={user} onChange={(ev) => setUser(ev.target.value)} />
        </div>

        <div className="contButtons">
          <ButtonKlein
            handleButton={(ev) => handleButton(ev)}
            text="SIGN IN"
            parW="4.4rem"
            parH="2.4rem"
            parFS="0.8rem"
          />
        </div>

      </form>
    </div>

  );
};

export default Home;