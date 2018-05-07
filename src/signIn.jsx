import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import css from './react.css';


class SignIn extends React.Component {
  constructor(props) {
      super(props)
      
      this.submitUserCredentials = this.submitUserCredentials.bind(this);
      this.handleChange = this.handleChange.bind(this);

      this.state = {
          username: '',
          password: ''
      }
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
    console.log(userData);
  }


  render() {
    return (
        <div className="signIn">
          <h3>Login</h3>
          <input type="text" placeholder="Username" className="input" id="username" value={this.state.username} id="usernameInput" name="username" onChange={this.handleChange}/>
          <input type="text" placeholder="Password" className="input" id="password" value={this.state.password} id="passwordInput" name="password" onChange={this.handleChange}/>
          <Button className="submit" color="success" onClick={this.submitUserCredentials}>Submit</Button>
        </div>
    )
  }
}



module.exports = SignIn;
