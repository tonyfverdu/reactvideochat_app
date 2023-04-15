import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


function Home({ socket }) {
  const navigate = useNavigate();  //  <<==  El hook "useNavigate" de ReactRouter devuelve una función que permite navegar mediante programación
  // let userName = useContext(UserContext)
  const [user, setUser] = useState('')

  //  Submit function of the chat input form "button".
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', user); // <== Storage in "local storage" of the logged-in user name
    socket.emit('newUser', { user, socketID: socket.id }); // <<==  sends the username and socket ID to the Node.js server
    navigate('/chat');   //  <== go to the "chat" page of the application. React Router's imperative API "navigate (route)
    // allows for programmatic navigation (changes the current location when rendered.)
  };


  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" className="username__input" minLength={6} name="username" value={user} onChange={(ev) => setUser(ev.target.value)} />
      <button className="home__cta">SIGN IN</button>
      {/* <p>{console.log('user de context:  ', userName)}</p> */}
    </form>
  );
};

export default Home;