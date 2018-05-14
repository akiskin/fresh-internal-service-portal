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

        if (this.state.pattern.length <= 3) {
            return false;
        }

        this.setState({
            fetching: true,
            clients: [],
            currentClientId: '',
            currentClientData: {}
        })

        let response = await this.props.requests.clientlookup(this.state.pattern)

        console.log(response)

        let clients = response['payload']

        this.setState({
            fetching: false,
            clients: Array.isArray(clients) ? clients : []
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
        
        if (response) {
            setTimeout(this.refreshAfterAccessWasGranted, 5000)
        }

        

    }

    refreshAfterAccessWasGranted = () => {
        this.onSelectClient(this.state.currentClientId)()
    }

    render() {
        return(
        <Fragment>
            <div className="row">
                <div className="col-3"></div>
                <div className="col">
                    <form>
                        <div className="mt-3 mb-3">
                            <h3>Client Search</h3>
                            <small>Search client list by name (at least 4 symbols required)</small>
                        </div>
                        <div className="form-group row">
                            <input type="text" className="form-control" value={this.state.pattern} onChange={this.onPatternChange}/>
                         </div>
                        <button type="button" className="btn btn-success" onClick={this.onSearch}>Search</button>
                    </form>
                </div>
                <div className="col-3"></div>
            </div>

            <div>
                {this.state.clients.length > 0 && <ClientsFoundHeader />}
                {this.state.clients.length > 0 && this.state.clients.map(el => <SingleClient key={el.id} name={el.name} id={el.id} onSelectClient={this.onSelectClient} />)}
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

const ClientsFoundHeader = () =>
    <div className="mt-3 mb-3">
        <h3 className="mt-3">Clients Found</h3>
        <small>Click on client name to see applications and request access</small>
    </div>

const SingleClient = (props) => 
    <span>
        <button type="button" className="btn btn-outline-dark mr-1" onClick={props.onSelectClient(props.id)}>{props.name}</button>         
    </span>

const ClientInfo = (props) =>
    <Fragment>
        <div className="mt-3 mb-3">
            <h3>{props.client.name}</h3>
            <small>Showing client's current applications</small>
        </div>
        {props.data.map(el => <AppRow key={el.id} data={el} onGetAccess={props.onGetAccess(el.id)}/>)}
    </Fragment>

const AppRow = (props) =>
    <div className="row mb-2 pb-1 border-bottom">
        <div className="col-3">
            <span className="align-middle">{props.data.name}</span>
        </div>
        <div className="col-5">
            <span className="align-middle">{props.data.link}</span>
        </div>
        <div className="col-2">
            {props.data.accessGranted && <AccessLink appId={props.data.id} link={props.data.link}/>}
        </div>
        <div className="col-2">
            {props.data.accessGranted ? <span className="align-middle">{'Access till: ' + props.data.expiryDate}</span> : <NoAccess onGetAccess={props.onGetAccess} />}
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