import React from 'react';
import {withGlobals} from './withGlobals.js'

export const AccessLink = withGlobals(props =>
    <a href={props.link + "?N=" + props.requests.username + "&P=" + props.requests.password} className="btn btn-success" target="_blank" rel="noopener noreferrer">
        Enter app
    </a>
    )

export const NoAccess = (props) =>
    <button className="btn btn-warning" onClick={props.onGetAccess} disabled={props.spinner}>
        {props.spinner ? <i className="fas fa-spinner fa-spin"></i> : <span>Get access (1 hour)</span>}
    </button>

