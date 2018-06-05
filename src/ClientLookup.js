import React, { Component, Fragment } from 'react';
import {withGlobals} from './withGlobals.js'

class ClientLookup extends Component {
    state = {
        pattern: '',
        fetching: false,
        clients: [],
        currentClientId: '',
        currentClientData: {},
        gettingAccess: null
    }

    onPatternChange = (e) => this.setState({pattern: e.target.value})

    onSearchSubmit = async (e) => {
        e.preventDefault()

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

        //console.log(response)

        if (response) {
            let clients = response['payload']

            this.setState({
                fetching: false,
                clients: Array.isArray(clients) ? clients : []
            })
        }
    }

    onSelectClient = (id) => async () => {

        console.log("Entered onSelectClient " + id)

        let response = await this.props.requests.clientdbinfo(id)
        
        if (response) {
            this.setState({
                currentClientId: id,
                currentClientData: response['payload']
            })
        }
    }

    onGetAccess = (id) => async () => {

        console.log("Entered onGetAccess " + id)

        this.setState({gettingAccess: id})

        this.props.requests.getaccesswrapper(
            id, 
            this.refreshAfterAccessWasGranted, 
            () => this.setState({gettingAccess: null})
        )
    }

    refreshAfterAccessWasGranted = () => {
        this.onSelectClient(this.state.currentClientId)()
        this.setState({gettingAccess: null})
        this.props.requests.gethistorywrapper()
    }

    render() {
        return(
        <Fragment>
            <div className="row">
                <div className="col-3"></div>
                <div className="col">
                    <SearchForm 
                        pattern={this.state.pattern}
                        onPatternChange={this.onPatternChange}
                        onSearchSubmit={this.onSearchSubmit}
                    />
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
                                                    gettingAccess={this.state.gettingAccess}
                                                    />}
            </div>
        </Fragment>)
    }


}

const SearchForm = (props) =>
    <form onSubmit={props.onSearchSubmit}>
        <div className="mt-3 mb-3">
            <h3>Client Search</h3>
            <small>Search client list by name (at least 4 symbols required)</small>
        </div>
        <div className="form-group row">
            <input type="text" className="form-control" value={props.pattern} onChange={props.onPatternChange} pattern=".{4,}" required title="4 characters minimum"/>
        </div>
        <button type="submit" className="btn btn-success">Search</button>
    </form>


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
        {props.data.filter(el => el.status === 1).map(el => <AppRow key={el.id} data={el} onGetAccess={props.onGetAccess(el.id)} spinner={el.id === props.gettingAccess}/>)}
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
            {props.data.accessGranted ? <span className="align-middle">{'Access till: ' + (new Date(props.data.accessExpiryDate)).toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit'})}</span> : <NoAccess onGetAccess={props.onGetAccess} spinner={props.spinner} />}
        </div>
    </div>

const AccessLink = withGlobals(props =>
    <a href={props.link + "?N=" + props.requests.username + "&P=" + props.requests.password} className="btn btn-success" target="_blank" rel="noopener noreferrer">
        Enter app
    </a>)

const NoAccess = (props) =>
    <button className="btn btn-warning" onClick={props.onGetAccess} disabled={props.spinner}>
        {props.spinner ? <i className="fas fa-spinner fa-spin"></i> : <span>Get access (1 hour)</span>}
    </button>


export default withGlobals(ClientLookup);