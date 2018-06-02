import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './react.css';

function NewUserAdded() {
  return(
    <h6 className="registerMessage">Welcome! Go ahead and log in.</h6>
  )
}

function UsernameExists() {
  return (
    <h6 className="existsMessage">Username is already taken.</h6>
  )  
}

function CheckUser(props) {
  let user = props.user;
  let exists = props.exists;
  
  if(user) {return <NewUserAdded/>}
  if(exists) {return <UsernameExists/>}
  return null
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
        userProfile: '',
        passLength: false,
        passwordValid: false,
        formValid: false,
        userexists: false
      }
    }

  handleChange(eve) {
    const name = eve.target.name;
    const value = eve.target.value;
      this.setState({
        [name]: value
      }, () => {this.validation(name, value)});      
  }

  validation(name, value) {
    let passwordValid = this.state.passwordValid;
    let passLength = this.state.passLength;

  switch(name) {
    case 'newPassword':
    passLength = value.length >= 6;
    case 'newPassword':
    passwordValid = value.match(/[A-Za-z]/) && value.match(/[0-9]/) ? true : false;
    break;
    default:
    break;
  }
    this.setState({ passwordValid: passwordValid, passLength: passLength}, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.passwordValid && this.state.passLength});
  }

  createUserCredentials() {
    let userData = {
      newUsername: this.state.newUsername,
      newPassword: this.state.newPassword,
      userProfile: this.state.userProfile
    } 
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
      else if (data == 'userexists') {
        this.setState({userexists: true})
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
          <CheckUser user={this.state.newUser} exists={this.state.userexists}/>
          <h3>Register</h3>
          <input type="text" placeholder="Create Username" className="input" id="newuser" value={this.state.newUsername} name="newUsername" onChange={this.handleChange}/>
          <input type="text" placeholder="Create Password" className="input" if="newpass" value={this.state.newPassword} name="newPassword" onChange={this.handleChange}/>
          <Button disabled={!isEnabled} disabled={!this.state.formValid} className="submit" color="success" onClick={this.createUserCredentials} >Submit</Button>
          {/* <p className="p" >Password must contain at least 6 characters of letters and numbers</p> */}
        </div>
    )
  }
}


module.exports = RegisterUser;
