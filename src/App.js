import React, { Component, Fragment } from 'react';
import './App.css';
import Requests from './requests.js'
import ClientLookup from './ClientLookup.js'

class App extends Component {
  state = {
    loggedIn: false,
    username: 'testsupport',
    password: 'P@ssw0rd',
    currentView: 'clientLookup'
  }

  requestsSingleton = new Requests();


  performLogin = async () => {
    
    this.requestsSingleton.setCredentials(this.state.username, this.state.password)
    this.setState({loggedIn: await this.requestsSingleton.login()})
    //this.setState({loggedIn: await login(this.state.username, this.state.password)})
  }


  render() {
    return (
      <div className="App">
        {this.state.loggedIn ? <WelcomeMessage /> : <LoginForm performLogin={this.performLogin} />}
        
        {this.state.currentView === 'clientLookup' && <ClientLookup />}
      </div>
    );
  }
}

const LoginForm = (props) => 
  <form>
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">Username</label>
      <div className="col-sm-10">
        <input type="email" className="form-control" id="inputUsername" placeholder="Username" />
      </div>
    </div>
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">Password</label>
      <div className="col-sm-10">
        <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
      </div>
    </div>

    <button type="button" className="btn btn-success" onClick={props.performLogin}>Login</button>
  </form>

const WelcomeMessage = () =>
  <Fragment>
    Welcome mate!
  </Fragment>

export default App;
