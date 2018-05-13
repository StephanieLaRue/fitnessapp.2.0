import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from './signIn.jsx';
import RegisterUser from './registerUser.jsx'
import {Button, Container, Nav} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './react.css';

function ToggleRegistration(props) {
	if(!props.reg) {
		return (
			<SignIn/>	
		)
	}
	return(
		<RegisterUser/>
	)
}


class Main extends React.Component {
	constructor(props) {
		super(props)

		this.toggle = this.toggle.bind(this)

		this.state = {
			toggleClick: false
		}
	}

	componentDidMount() {

	}

	toggle() {
    this.setState(prevState => ({
      toggleClick: !prevState.toggleClick
    }));
  }


	render() {
		return(
			<Container id="mainContainer">
				<Button className="toggleButton btn-outline-info btn-sm" onClick={this.toggle}>
					{this.state.toggleClick ? 'Login' : 'Register'}
				</Button>
				<ToggleRegistration reg={this.state.toggleClick}/>			
			</Container>
		) 
	}
}

ReactDOM.render(<Main />, document.getElementById('fitnessContainer'))