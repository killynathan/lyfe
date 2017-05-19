import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect
} from 'react-router-dom';
import {URL} from '../config/config';

import '../css/App.css';
import NavbarContainer from '../containers/NavbarContainer';
import HomePageContainer from '../containers/HomePageContainer';
import NewPostPageContainer from '../containers/NewPostPageContainer';
import Menu from '../components/Menu';
import ProfilePageContainer from './ProfilePageContainer';
import LoginPageContainer from './LoginPageContainer';
import RegisterPageContainer from './RegisterPageContainer';
import WelcomePage from '../components/WelcomePage';

import {isLoggedIn, getUsername} from '../services/auth/auth';

class App extends Component { 

	constructor(props) {
		super(props);

		this.setUser = this.setUser.bind(this);
		this.getUser = this.getUser.bind(this);

		this.state = {
			user: null,
			menuActive: false
		}

		this.getUser();
	}

	getUser() {
		let username = getUsername();
		if (!username) {
			this.setState({user: null})
		}
		else {
			fetch(URL + '/users/' + username + '/public')
			.then(resp => {
				return resp.json();
			})
			.then(resp => {
				if (resp.error) {
					this.setState({
						user: null
					});
				}
				else {
					this.setState({
						user: resp.data
					});
				}
			})

		}


	}

	setUser(_user) {
		this.setState({
			user: _user
		});	
	}

	submitPost(post) {
		this.setState({
			user: this.state.user.blogPosts.unshift(post)
		})
		this.updateUser();
	}

	toggleMenu(e) {
		e.stopPropagation();
		this.setState({menuActive: !this.state.menuActive});
	}

	dismissMenu(e) {
		this.setState({menuActive: false});
	}

	updateUser() {
		fetch(URL + '/users/' + this.state.user.username, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this.state.user)
		})
	}

  	render() {

    	return (
      		<div className="App">
       
       		<Router>
	        	<div>
	        		<NavbarContainer user={this.state.user} toggleMenu={this.toggleMenu.bind(this)} dismissMenu={this.dismissMenu.bind(this)}/>
	        		{this.state.menuActive && <Menu />}
	        		<div>
		        		<Route exact path='/' 
		        			render={(renderProps) => (
		        				isLoggedIn() ? (
		        					<HomePageContainer user={this.state.user} dismissMenu={this.dismissMenu.bind(this)}/>
		        				) : (
		        					<WelcomePage />
		        				)
		        			)}/>
		        		<Route 
		        			path='/u/:username'
		        			render={(renderProps) => (
		        				<ProfilePageContainer renderProps={renderProps}/>
		        			)}/>
			        	<Route 
			        		path='/newPost' 
		        			render={(renderProps) => (
		        				<NewPostPageContainer submitPost={this.submitPost.bind(this)} Router={Router} dismissMenu={this.dismissMenu.bind(this)}/>
		        			)}/>
		        		<Route
		        			path='/login'
		        			render={(renderProps) => (
		        				isLoggedIn() ? (
		        					<Redirect to='/'/>
		        				) : (
		        					<LoginPageContainer setUser={this.setUser}/>
		        				)
		        			)}/>
		        		<Route
		        			path='/register'
		        			render={(renderProps) => (
		        				isLoggedIn() ? (
		        					<Redirect to='/'/>
		        				) : (
		        					<RegisterPageContainer setUser={this.setUser}/>
		        				)
		        			)}/>
		        		
	        		</div>
		        </div>
	      	</Router>
	      </div>
    )
  }
}

export default App;