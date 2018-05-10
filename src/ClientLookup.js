import React, { Component, Fragment } from 'react';

class ClientLookup extends Component {
    state = {
        pattern: '',
        fetching: false,
        clients: [],
        currentClientId: ''
    }

    onPatternChange = (e) => this.setState({pattern: e.target.value})

    onSearch = () => {

        this.setState({fetching: true})


        //Get clients
        let clients = [{id: 'id1', name: 'name1'},{id: 'id2', name: 'name2'}]

        this.setState({
            fetching: false,
            clients: clients
        })
    }

    onSelectClient = (id) => () => {
        this.setState({currentClientId: id})
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
            {this.state.currentClientId && <ClientInfo client={this.state.clients.find((el) => el.id === this.state.currentClientId)}/>}
        </Fragment>)
    }


}

const SingleClient = (props) => 
    <span>
        <button type="button" className="btn btn-light" onClick={props.onSelectClient(props.id)}>{props.id + '::' + props.name}</button>         
    </span>

const ClientInfo = (props) =>
    <div>
        <h2>{props.client.name}</h2>
    </div>

export default ClientLookup;