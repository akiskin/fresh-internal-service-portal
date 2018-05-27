import React, { Component, Fragment } from 'react';
import {withGlobals} from './withGlobals.js'

class AccessHistory extends Component {
    state = {
        history: [],
    }

    getHistory = async () => {

        let response = await this.props.requests.gethistory()
        let history = response['payload']

        this.setState({
            history: history,
            needUpdate: false
        })
    }

    componentDidMount() {
        this.getHistory();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.updateHistory !== state.updateHistory) {
            return {
                history: [],
                updateHistory: props.id,
                needUpdate: true
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.needUpdate === true) {
            this.getHistory();
        }
    }


    render() {
        return(
        <Fragment>
            <div className="mt-3 mb-3">
                <h3 className="mt-3">History and current access</h3>
            </div>
            <div className="container">
                {this.state.history.map(el => <HistoryEntry key={el.link} data={el}/>)}
            </div>
        </Fragment>)
    }

}

const HistoryEntry = (props) =>
    <div className="row mb-2 pb-1 border-bottom">
        <div className="col-3">
            <span className="align-middle">{props.data.clientName}</span>
        </div>
        <div className="col-5">
            <span className="align-middle">{props.data.link}</span>
        </div>
        <div className="col-2">
            {props.data.accessGranted && <AccessLink link={props.data.link}/>}
        </div>
        <div className="col-2">
            {props.data.accessGranted ? <span className="align-middle">{'Access till: ' + (new Date(props.data.accessExpiryDate)).toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit'})}</span> : null}
        </div>
    </div>

const AccessLink = withGlobals(props =>
    <a href={props.link + "?N=" + props.requests.username + "&P=" + props.requests.password} className="btn btn-success" target="_blank" rel="noopener noreferrer">
        Enter app
    </a>)

export default withGlobals(AccessHistory);