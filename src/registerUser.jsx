import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import css from './react.css';


class RegisterUser extends React.Component {
  constructor(props) {
      super(props)
      
      this.createUserCredentials = this.createUserCredentials.bind(this);
      this.handleChange = this.handleChange.bind(this);

      this.state = {
        newUsername: '',
        newPassword: ''
      }
    }

  handleChange(eve) {
      this.setState({
        [eve.target.name]: eve.target.value
      })      
  }

  createUserCredentials() {
    let userData = {
      newUsername: this.state.newUsername,
      newPassword: this.state.newPassword
    } 
    console.log(userData);
    this.userRegistration(userData)
  }

  userRegistration(userData) {
    let url = `${location.origin}/register`;
    let params = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    }
    fetch(url, params)
    // .then(res => res.json())
    // .then(res)
  }


  render() {
    return (
        <div className="register">				
          <h3>Register</h3>
          <input type="text" placeholder="Create Username" className="input" id="newuser" value={this.state.newUsername} name="newUsername" onChange={this.handleChange}/>
          <input type="text" placeholder="Create Password" className="input" if="newpass" value={this.state.newPassword} name="newPassword" onChange={this.handleChange}/>
          <Button className="submit" color="success" onClick={this.createUserCredentials}>Submit</Button>
        </div>
    )
  }
}


module.exports = RegisterUser;
