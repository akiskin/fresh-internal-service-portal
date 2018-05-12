import React, { Component, Fragment } from 'react';
import {withGlobals} from './withGlobals.js'

class ClientLookup extends Component {
    state = {
        pattern: '',
        fetching: false,
        clients: [],
        currentClientId: '',
        currentClientData: {}
    }

    onPatternChange = (e) => this.setState({pattern: e.target.value})

    onSearch = async () => {

        this.setState({fetching: true})

        let response = await this.props.requests.clientlookup(this.state.pattern)

        console.log(response)

        let clients = response['payload']

        this.setState({
            fetching: false,
            clients: clients
        })
    }

    onSelectClient = (id) => async () => {

        console.log("Entered onSelectClient " + id)

        let response = await this.props.requests.clientdbinfo(id)
        
        this.setState({
            currentClientId: id,
            currentClientData: response['payload']
        })
    }

    onGetAccess = (id) => async () => {

        console.log("Entered onGetAccess " + id)

        let response = await this.props.requests.getaccess(id)
        
        this.onSelectClient(this.state.currentClientId)()

    }

    render() {
        return(
        <Fragment>
            <form>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Client name (partial)</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={this.state.pattern} onChange={this.onPatternChange}/>
                    </div>
                </div>
                <button type="button" className="btn btn-success" onClick={this.onSearch}>Search</button>
            </form>
            <div>
                {this.state.clients.map(el => <SingleClient key={el.id} name={el.name} id={el.id} onSelectClient={this.onSelectClient} />)}
            </div>

            <div className="container">
                {this.state.currentClientId && <ClientInfo 
                                                    client={this.state.clients.find((el) => el.id === this.state.currentClientId)} 
                                                    data={this.state.currentClientData} 
                                                    onGetAccess={this.onGetAccess}
                                                    />}
            </div>


        </Fragment>)
    }


}

const SingleClient = (props) => 
    <span>
        <button type="button" className="btn btn-light" onClick={props.onSelectClient(props.id)}>{props.name}</button>         
    </span>

const ClientInfo = (props) =>
    <Fragment>
        <h2>{props.client.name}</h2>
        {props.data.map(el => <AppRow key={el.id} data={el} onGetAccess={props.onGetAccess(el.id)}/>)}
    </Fragment>

const AppRow = (props) =>
    <div className="row">
        <div className="col-3">
            {props.data.name}
        </div>
        <div className="col-5">
            {props.data.link}
        </div>
        <div className="col-2">
            {props.data.accessGranted && <AccessLink appId={props.data.id} link={props.data.link}/>}
        </div>
        <div className="col-2">
            {props.data.accessGranted ? 'Access till: ' + props.data.expiryDate : <NoAccess onGetAccess={props.onGetAccess} />}
        </div>
    </div>

const AccessLink = withGlobals(props =>
    <a href={props.link + "?N=" + props.requests.username + "&P=" + props.requests.password} className="btn btn-success">
        Enter app
    </a>)

const NoAccess = (props) =>
    <button className="btn btn-warning" onClick={props.onGetAccess}>
        Get access (1 hour)
    </button>


export default withGlobals(ClientLookup);