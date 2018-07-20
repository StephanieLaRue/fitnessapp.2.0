import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './react.css';


function CheckEntry(props) {
  if(!props.invalid) {
    return null
  }
  return(
    <h6 className="invalidMessage">Invalid Username or Password.</h6>
  ) 
}

function storeKey() {

}


class SignIn extends React.Component {
  constructor(props) {
      super(props)
      
      this.submitUserCredentials = this.submitUserCredentials.bind(this);
      this.handleChange = this.handleChange.bind(this);

      this.state = {
          username: '',
          password: '',
          invalidEntry: false,
      }
    }

    componentDidMount() {
    }

  handleChange(eve) {
      this.setState({
        [eve.target.name]: eve.target.value
      })      
  }

  submitUserCredentials() {
    let userData = {
      username: this.state.username,
      password: this.state.password
    } 
    this.userSignIn(userData)
  }

  userSignIn(userData) {
    let url = `${location.origin}/signin`;
    
    let params = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    }
    fetch(url, params)
    .then((res) => res.json())
    .then((data) => {      
      if(data.status == 'successful') {
        window.location.assign('http://localhost:3000/profile');   
        localStorage.setItem('key', JSON.stringify(data.token))       
      }
      if(data.status == 'invalidEntry') {
        console.log('invalid client entry');
        this.setState({invalidEntry: true})
      }              
    })
    .catch((err) => {return err});
  }


  render() {
    const {username, password} = this.state;
    const isEnabled = username.length > 0 && password.length > 0;
    
    return (
        <div className="signIn">
          <CheckEntry invalid={this.state.invalidEntry} />
          <h3>Sign In</h3>
          <input type="text" placeholder="Username" className="input" id="username" value={this.state.username} id="usernameInput" name="username" onChange={this.handleChange}/>
          <input type="text" placeholder="Password" className="input" id="password" value={this.state.password} id="passwordInput" name="password" onChange={this.handleChange}/>
          <Button disabled={!isEnabled} className="submit" color="success" onClick={this.submitUserCredentials}>Submit</Button>
        </div>
    )
  }
}





module.exports = SignIn;
