import { Routes, Route, Link, } from "react-router-dom";
import './App.css'
import Login from './login.jsx'
import Signup from './signup.jsx'
import Game from './game.jsx'
import  { axiosInstance } from "./axiosAPI.js";

function App(){
  async function handleLogout() {
    try {
        const response = await axiosInstance.post('/logout/', {
            "refresh_token": localStorage.getItem("refresh_token")
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        axiosInstance.defaults.headers['Authorization'] = null;
        return response;
    }
    catch (e) {
        console.log(e);
    }
};
      return (
          <div className="site">
              <nav>
                  <Link className={"nav-link"} to={"/"}>Home </Link>
                  <Link className={"nav-link"} to={"/login/"}>Login </Link>
                  <Link className={"nav-link"} to={"/signup/"}>Signup </Link>
                  <Link className={"nav-link"} to={"/Game/"}>Game </Link>
                  <button onClick={handleLogout}>Logout</button>
              </nav>
              <main>
                  <h1>Ahhh after 10,000 years I'm free. Time to conquer the Earth!</h1>

                  <Routes>
                      <Route path="/login/" element={<Login />} /> 
                      <Route path="/signup/" element={<Signup />} />
                      <Route path="/Game/" element={<Game />} />
                      <Route path="/" element={<div>Home againnnnnnnnnnn</div>} />
                  </Routes>
              </main>
          </div>
      );
}

export default App


// async handleLogout() {
//   try {
//       const response = await axiosInstance.post('/blacklist/', {
//           "refresh_token": localStorage.getItem("refresh_token")
//       });
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       axiosInstance.defaults.headers['Authorization'] = null;
//       return response;
//   }
//   catch (e) {
//       console.log(e);
//   }
// };