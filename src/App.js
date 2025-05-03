import './App.css';
import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Host from './components/Host';
import Home from './components/Home';

function App() {
  console.log(process.env);
  const socket = process.env.REACT_APP_SERVER_URL ? io(process.env.REACT_APP_SERVER_URL) : io('http://localhost:4000');

  return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home socket={socket} />}></Route>
            <Route path="/host" element={<Host socket={socket} />}></Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
