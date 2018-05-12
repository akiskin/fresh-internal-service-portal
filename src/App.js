import React, { Component, Fragment } from 'react';
import './App.css';
import Requests from './requests.js'
import ClientLookup from './ClientLookup.js'

import GlobalContext from './withGlobals.js'

class App extends Component {
  state = {
    loggedIn: false,
    username: 'testsupport',
    password: 'P@ssw0rd',
    currentView: 'clientLookup'
  }

  requestsSingleton = new Requests();

  onInputFieldChange = (inputName) => (e) => this.setState({[inputName]: e.target.value})

  performLogin = async () => {
    
    this.requestsSingleton.setCredentials(this.state.username, this.state.password)
    this.setState({loggedIn: await this.requestsSingleton.login()})
    //this.setState({loggedIn: await login(this.state.username, this.state.password)})
  }


  render() {
    return (
      <GlobalContext.Provider value={this.requestsSingleton}>
        <div className="App">
          {this.state.loggedIn ? <WelcomeMessage /> : <LoginForm performLogin={this.performLogin}
                                                                  username={this.state.username}
                                                                  password={this.state.password}
                                                                  onUsernameChange={this.onInputFieldChange("username")}
                                                                  onPasswordChange={this.onInputFieldChange("password")}
          />}
          
          {this.state.currentView === 'clientLookup' && <ClientLookup />}
        </div>
      </GlobalContext.Provider>
    );
  }
}

const LoginForm = (props) => 
  <form>
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">Username</label>
      <div className="col-sm-10">
        <input type="email" value={props.username} className="form-control" id="inputUsername" placeholder="Username" onChange={props.onUsernameChange}/>
      </div>
    </div>
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">Password</label>
      <div className="col-sm-10">
        <input type="password" value={props.password} className="form-control" id="inputPassword" placeholder="Password" onChange={props.onPasswordChange} />
      </div>
    </div>

    <button type="button" className="btn btn-success" onClick={props.performLogin}>Login</button>
  </form>

const WelcomeMessage = () =>
  <Fragment>
    Welcome mate!
  </Fragment>

export default App;
