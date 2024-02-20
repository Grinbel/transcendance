import React from 'react';
import './App.css';
import Cookies from 'universal-cookie';



const cookies = new Cookies();
console.log('csrftoken: ' + cookies.get('csrftoken'));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      token: '',
      isLogin: false
    }
  }

  componentDidMount() {
  
    this.getSession();
  }

  getSession = () => {
    console.log('getSession()');
    // ...existing code...

    fetch('http://localhost:8000/user/session/', {
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Data: ' + data);
      if (data.isauthenticated === false) {
        this.setState({
          isLogin: false
        });
      } else if (data.isauthenticated === true) {
        this.setState({
          isLogin: true
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  whoami = () => {
    fetch('http://localhost:8000/user/whoami/', {
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      console.log('You are logged in as:  ' + data.username);
      })
    .catch(error => {
      console.error('error() Error:', error);
    });
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value
    });
  }
  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    });
  }

  ifResponseOk = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    throw new Error(response.statusText);
  }

  login = (event) => {
    console.log('login()');
    event.preventDefault();
    fetch('http://localhost:8000/user/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.get('csrftoken'),
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
    })
    .then(this.ifResponseOk)
    .then(data => {
      console.log('Success:', data);
      this.setState({
        isLogin: true, username: '', password: '', error: ''
      });
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({
        error: 'Could not login'
      });
    });
  }

  logout = () => {
    fetch('http://localhost:8000/user/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.get('csrftoken'),
      },
      credentials: 'include',
    })
    .then(this.ifResponseOk)
    .then(data => {
      console.log('Success:', data);
      this.setState({
        isLogin: false
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  render() {
      
    if (!this.state.isLogin) {
      return (
        <div className="container mt-3">
          <form onSubmit={this.login}>
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <input 
              className='form-control' 
              id='username' 
              type="text" 
              name="username"
              value = {this.state.username}
              onChange={this.handleUsernameChange} />
              
              <label htmlFor='password'>Password</label> 
              <input 
              className='form-control' 
              id='password' 
              type="password" 
              name="password" 
              value = {this.state.password}
              onChange={this.handlePasswordChange} />
              
              <div className="text-danger">{this.state.error}</div>
              <input className='btn btn-primary' type="submit" value="Login" onClick={this.login}/>
            </div>
          </form>
          {/* {this.state.isLogin ? <h1>Login Success</h1> : <h1>Login Failed</h1>} */}
        </div>
      );
    }
    else {
      return (
        <div className="container mt-3">
          <h1>You are logged in!</h1>
          <button className='btn btn-primary-mr-2' onClick={this.whoami}>Who am I?</button>
          <button className='btn btn-danger' onClick={this.logout}>Logout</button>
          
        </div>
      );
    }
  }
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

//  export default App;