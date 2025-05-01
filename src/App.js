import './App.css';
import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Host from './components/Host';
import Home from './components/Home';

function App() {
  const socket = io('https://unenadineenorserver.onrender.com');
  //const socket = io('http://localhost:4000');
  
  return (
    <div className="app">
      <h1 className="title">UNE<br/>NADINE<br/>EN OR</h1>
      <BrowserRouter>
        <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/host" element={<Host socket={socket} />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
