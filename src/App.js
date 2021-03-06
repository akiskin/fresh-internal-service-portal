import React, { Component } from 'react';
import './App.css';
import Requests from './requests.js'
import Dictionary from './dictionary.js'
import ClientLookup from './ClientLookup.js'
import AccessHistory from './AccessHistory.js'

import GlobalContext from './withGlobals.js'

class App extends Component {
  state = {
    loggedIn: false,
    //username: 'testsupport',
    //password: 'P@ssw0rd',
    username: '',
    password: '',
    historyData: []
  }

  requestsSingleton = new Requests(this)
  dictionary = new Dictionary('en')

  onInputFieldChange = (inputName) => (e) => this.setState({[inputName]: e.target.value})

  performLogin = async (e) => {
    e.preventDefault()
    this.requestsSingleton.setCredentials(this.state.username, this.state.password)
    this.setState({loggedIn: await this.requestsSingleton.login()})
  }


  render() {
    return (
      <GlobalContext.Provider value={{requests: this.requestsSingleton, dict: this.dictionary}}>
        <div className="container App">
          <h1 className="display-1">
            Internal Service Portal
          </h1>
          {this.state.loggedIn ? null : <LoginForm performLogin={this.performLogin}
                                                                  username={this.state.username}
                                                                  password={this.state.password}
                                                                  onUsernameChange={this.onInputFieldChange("username")}
                                                                  onPasswordChange={this.onInputFieldChange("password")}
          />}
          
          {this.state.loggedIn && <ClientLookup />}
          {this.state.loggedIn && <AccessHistory historyData={this.state.historyData} />}
        </div>
      </GlobalContext.Provider>
    );
  }
}

const LoginForm = (props) =>
  <div className="row">
    <div className="col-3"></div>
    <div className="col">
      <form onSubmit={props.performLogin}>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Username</label>
          <div className="col-sm-10">
            <input type="text" value={props.username} className="form-control" id="inputUsername" placeholder="Username" onChange={props.onUsernameChange}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input type="password" value={props.password} className="form-control" id="inputPassword" placeholder="Password" onChange={props.onPasswordChange} />
          </div>
        </div>
        <button type="submit" className="btn btn-success">Login</button>
      </form>
    </div>
    <div className="col-3"></div>
  </div>

export default App;
