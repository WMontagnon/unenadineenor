import './App.css';
import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Host from './components/Host';
import Home from './components/Home';

function App() {
  const socket = io('https://unenadineenorserver.onrender.com');

  return (
    <>
      <h1>Une Nadine en Or</h1>
      <BrowserRouter>
        <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/host" element={<Host socket={socket} />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
