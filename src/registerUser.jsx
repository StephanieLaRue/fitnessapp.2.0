import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './react.css';

function NewUserAdded(props) {
  if(!props.user) {
    return null;
  }
  return(
    <h6 className="registerMessage">Welcome! Go ahead and log in.</h6>
  )
}

class RegisterUser extends React.Component {
  constructor(props) {
      super(props)
      
      this.createUserCredentials = this.createUserCredentials.bind(this);
      this.handleChange = this.handleChange.bind(this);

      this.state = {
        newUsername: '',
        newPassword: '',
        newUser: '',
        userProfile: ''
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
      newPassword: this.state.newPassword,
      userProfile: this.state.userProfile
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
    .then((res) => res.text())
    .then((data) => {
      if(data == 'registered') {
        this.setState({newUser: true})
      }
      else {
        //something
      } 
    })
    .catch((err) => {
      return err;
    })
  }


  render() {
    const {newUsername, newPassword} = this.state;
    const isEnabled = newUsername.length > 0 && newPassword.length > 0;

    return (
        <div className="register">
          <NewUserAdded user={this.state.newUser} />				
          <h3>Register</h3>
          <input type="text" placeholder="Create Username" className="input" id="newuser" value={this.state.newUsername} name="newUsername" onChange={this.handleChange}/>
          <input type="text" placeholder="Create Password" className="input" if="newpass" value={this.state.newPassword} name="newPassword" onChange={this.handleChange}/>
          <Button disabled={!isEnabled} className="submit" color="success" onClick={this.createUserCredentials}>Submit</Button>
        </div>
    )
  }
}


module.exports = RegisterUser;
