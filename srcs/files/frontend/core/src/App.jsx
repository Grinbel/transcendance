import { Routes, Route } from "react-router-dom";
import './App.css'
import Login from './login.jsx'
import Signup from './signup.jsx'

function App() {
  // const [count, setCount] = useState(0)
  return (
    <div className="site">
        <main>
            <h1>Ahhh after 10,000 years I'm free. Time to conquer the Earth!</h1>
            <Routes>
                <Route exact path={"/login/"} element={<Login />}/>
                <Route exact path={"/signup/"} element={<Signup />}/>
                <Route path={"/"} render={() => <div>Home again</div>}/>
           </Routes>
       </main>
    </div>
  );
}

export default App
