import React, { Component, Fragment } from 'react';
import {withGlobals} from './withGlobals.js'
import {AccessLink, NoAccess} from './Primitives.js'

class AccessHistory extends Component {

    componentDidMount() {
        this.props.requests.gethistorywrapper()
    }

    onGetAccess = (id) => async () => {

        console.log("Entered onGetAccess " + id)

        this.props.requests.getaccesswrapper(
            id, 
            this.refreshAfterAccessWasGranted, 
            () => this.setState({gettingAccess: null})
        )
    }

    refreshAfterAccessWasGranted = () => {
        this.props.requests.gethistorywrapper()
    }    

    render() {
        return(
        <Fragment>
            <div className="mt-3 mb-3">
                <h3 className="mt-3">History and current access</h3>
            </div>
            <div className="container">
                {this.props.historyData.map(el => <HistoryEntry 
                                                    key={el.link} 
                                                    data={el}
                                                    onGetAccess={this.onGetAccess(el.id)}
                                                    />)}
            </div>
        </Fragment>)
    }
}

const HistoryEntry = withGlobals(props =>
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
            {props.data.accessGranted 
                ? <span className="align-middle">{props.requests.accessExpiryDateString(props.data.accessExpiryDate)}</span> 
                : <NoAccess onGetAccess={props.onGetAccess} spinner={props.spinner} />
            }
        </div>
    </div>
    )

export default withGlobals(AccessHistory);